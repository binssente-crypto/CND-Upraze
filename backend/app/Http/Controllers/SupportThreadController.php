<?php

namespace App\Http\Controllers;

use App\Models\SupportThread;
use App\Models\SupportMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SupportThreadController extends Controller
{
    /**
     * List threads — users see their own, admins see all.
     */
    public function index()
    {
        $user = Auth::user();

        $isAdmin = in_array($user->role, ['admin', 'superadmin']);
        $threads = ($isAdmin
            ? SupportThread::select(['id', 'user_id', 'subject', 'category', 'status', 'created_at'])
                ->with(['user:id,name,email,avatar', 'latestMessage.sender:id,name'])
            : SupportThread::select(['id', 'user_id', 'subject', 'category', 'status', 'created_at'])
                ->where('user_id', $user->id)
                ->with(['latestMessage.sender:id,name'])
        )
        ->withCount(['messages as unread_count' => function ($q) use ($user) {
            $q->where('is_read', false)->where('sender_id', '!=', $user->id);
        }])
        ->latest()
        ->get();

        return response()->json($threads);
    }

    /**
     * Create a new support thread with an initial message.
     */
    public function store(Request $request)
    {
        if (in_array(Auth::user()->role, ['admin', 'superadmin'])) {
            return response()->json(['message' => 'Admins cannot create inquiries'], 403);
        }

        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'category' => 'required|string|in:system_inquiry,billing,technical,general',
            'message' => 'required|string',
        ]);

        $thread = SupportThread::create([
            'user_id' => Auth::id(),
            'subject' => $validated['subject'],
            'category' => $validated['category'],
            'status' => 'open',
        ]);

        $message = SupportMessage::create([
            'thread_id' => $thread->id,
            'sender_id' => Auth::id(),
            'message' => $validated['message'],
        ]);

        $thread->load(['user:id,name,email,avatar', 'messages.sender:id,name,role']);

        return response()->json($thread, 201);
    }

    /**
     * Get a single thread with all messages.
     */
    public function show(SupportThread $thread)
    {
        $user = Auth::user();

        if (!in_array($user->role, ['admin', 'superadmin']) && $thread->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Mark messages from the other party as read
        $thread->messages()
            ->where('sender_id', '!=', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $thread->load(['user:id,name,email,avatar', 'messages.sender:id,name,role,avatar']);

        return response()->json($thread);
    }

    /**
     * Close a thread.
     */
    public function close(SupportThread $thread)
    {
        $user = Auth::user();

        if (!in_array($user->role, ['admin', 'superadmin']) && $thread->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $thread->update(['status' => 'closed']);

        return response()->json($thread);
    }

    /**
     * Admin assigns a thread to themselves.
     */
    public function assign(Request $request, SupportThread $thread)
    {
        if (!in_array(Auth::user()->role, ['admin', 'superadmin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $thread->update([
            'assigned_admin_id' => Auth::id(),
            'status' => 'in_progress',
        ]);

        return response()->json($thread);
    }
}
