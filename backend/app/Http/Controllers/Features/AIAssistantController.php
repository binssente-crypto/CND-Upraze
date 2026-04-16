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
                'model_used' => 'gpt-4o',
            ]);
        }

        // Mock AI response
        $aiResponse = "I am your CND Upraze AI Assistant. This is a simulated response to: " . $request->message;
        
        $messages = $conversation->messages;
        $messages[] = ['role' => 'user', 'content' => $request->message, 'ts' => now()];
        $messages[] = ['role' => 'assistant', 'content' => $aiResponse, 'ts' => now()];
        
        $conversation->update(['messages' => $messages]);

        return response()->json($conversation);
    }

    public function show(AiConversation $conversation)
    {
        return $conversation;
    }
}
