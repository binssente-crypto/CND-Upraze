<?php

namespace App\Http\Controllers;

use App\Models\SupportMessage;
use App\Models\SupportThread;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SupportMessageController extends Controller
{
    /**
     * Add a message to an existing thread.
     */
    public function store(Request $request, SupportThread $thread)
    {
        $user = Auth::user();

        if ($user->role !== 'admin' && $thread->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $message = SupportMessage::create([
            'thread_id' => $thread->id,
            'sender_id' => $user->id,
            'message' => $validated['message'],
        ]);

        // Update thread status based on who sent it
        $thread->update([
            'status' => $user->role === 'admin' ? 'responded' : 'open',
        ]);

        $message->load('sender:id,name,role,avatar');

        return response()->json($message, 201);
    }

    /**
     * Mark all messages in a thread as read (for the current user).
     */
    public function markRead(SupportThread $thread)
    {
        $user = Auth::user();

        if ($user->role !== 'admin' && $thread->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $thread->messages()
            ->where('sender_id', '!=', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['status' => 'ok']);
    }
}
