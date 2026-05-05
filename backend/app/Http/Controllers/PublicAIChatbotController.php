<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PublicAIChatbotController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'history' => 'array',
        ]);

        $history = $request->input('history', []);
        
        $systemPrompt = "You are the CND Upraze Public Assistant. You must ONLY answer questions related to the CND Upraze system and the services it offers (AI Assistance, Smart Forecasting, Vision AI, Quick Access QR Codes). If a user asks about any other topic, you must politely decline and state that you are only programmed to answer questions about CND Upraze. Keep your answers concise and professional. Do not provide code or answer general knowledge questions.";

        $groqMessages = [
            ['role' => 'system', 'content' => $systemPrompt]
        ];
        
        // Append history, limited to last 10 messages to prevent huge payloads
        $recentHistory = array_slice($history, -10);
        foreach ($recentHistory as $msg) {
            $groqMessages[] = [
                'role' => $msg['role'],
                'content' => $msg['content']
            ];
        }

        // Add the current user message
        $groqMessages[] = [
            'role' => 'user',
            'content' => $request->message
        ];

        try {
            $response = Http::withToken(env('GROQ_API_KEY'))
                ->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model' => 'llama-3.3-70b-versatile',
                    'messages' => $groqMessages,
                ]);

            if ($response->successful()) {
                $aiContent = $response->json('choices.0.message.content');
            } else {
                Log::error('Groq API Error (Public Chat): ' . $response->body());
                $aiContent = "I'm sorry, I'm having trouble connecting right now. Please try again later.";
            }
        } catch (\Exception $e) {
            Log::error('Groq Exception (Public Chat): ' . $e->getMessage());
            $aiContent = "I'm sorry, an error occurred while processing your request.";
        }

        return response()->json([
            'reply' => $aiContent
        ]);
    }
}
