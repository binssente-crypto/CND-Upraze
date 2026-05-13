<?php

namespace App\Http\Controllers\Features;

use App\Http\Controllers\Controller;
use App\Models\AiConversation;
use Illuminate\Http\Request;

class AIAssistantController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->aiConversations()->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'conversation_id' => 'nullable|exists:ai_conversations,id',
        ]);

        $user = $request->user();
        
        if ($request->conversation_id) {
            $conversation = AiConversation::findOrFail($request->conversation_id);
        } else {
            $conversation = AiConversation::create([
                'user_id' => $user->id,
                'title' => substr($request->message, 0, 50),
                'messages' => [],
                'model_used' => 'mixtral-8x7b-32768',
            ]);
        }

        $messages = $conversation->messages ?? [];
        $messages[] = ['role' => 'user', 'content' => $request->message, 'ts' => now()->format('h:i A')];
        
        // Prepare messages for Groq API
        $groqMessages = [
            ['role' => 'system', 'content' => 'You are the CND Upraze AI Assistant. Provide helpful, concise, and intelligent responses to help optimize the user\'s business.']
        ];
        
        foreach ($messages as $msg) {
            $groqMessages[] = [
                'role' => $msg['role'],
                'content' => $msg['content']
            ];
        }

        try {
            $response = \Illuminate\Support\Facades\Http::withToken(env('GROQ_API_KEY'))
                ->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model' => 'llama-3.3-70b-versatile',
                    'messages' => $groqMessages,
                ]);

            if ($response->successful()) {
                $aiContent = $response->json('choices.0.message.content');
            } else {
                \Illuminate\Support\Facades\Log::error('Groq API Error: ' . $response->body());
                $aiContent = "I'm sorry, I encountered an error communicating with my neural network.";
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Groq Exception: ' . $e->getMessage());
            $aiContent = "I'm sorry, an exception occurred while thinking.";
        }

        $messages[] = ['role' => 'assistant', 'content' => $aiContent, 'ts' => now()->format('h:i A')];
        
        $conversation->update(['messages' => $messages]);

        return response()->json($conversation);
    }

    public function show(AiConversation $conversation)
    {
        return $conversation;
    }

    public function destroy(Request $request, $id)
    {
        $conversation = \App\Models\AiConversation::findOrFail($id);
        if ($conversation->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $conversation->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
