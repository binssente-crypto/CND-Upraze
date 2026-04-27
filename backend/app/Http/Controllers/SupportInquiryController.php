<?php

namespace App\Http\Controllers;

use App\Models\SupportInquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SupportInquiryController extends Controller
{
    /**
     * Display a listing of all inquiries (Admin only).
     */
    public function index()
    {
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return SupportInquiry::with('user')->latest()->get();
    }

    /**
     * Display a listing of inquiries for the current user.
     */
    public function userInquiries()
    {
        if (!Auth::check()) {
            return response()->json([]);
        }
        
        return SupportInquiry::where('user_id', Auth::id())->latest()->get();
    }

    /**
     * Store a newly created inquiry.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
        ]);

        $senderName = Auth::check() ? Auth::user()->name : ($validated['name'] ?? 'Guest');
        $senderEmail = Auth::check() ? Auth::user()->email : ($validated['email'] ?? null);

        $inquiry = SupportInquiry::create([
            'user_id' => Auth::id(),
            'name' => $senderName,
            'email' => $senderEmail,
            'subject' => $validated['subject'],
            'messages' => [
                [
                    'sender' => $senderName,
                    'sender_id' => Auth::id(),
                    'is_admin' => Auth::check() && Auth::user()->role === 'admin',
                    'message' => $validated['message'],
                    'created_at' => now(),
                ]
            ],
            'status' => 'open',
        ]);

        return response()->json($inquiry, 201);
    }

    /**
     * Display the specified inquiry.
     */
    public function show(SupportInquiry $supportInquiry)
    {
        if (Auth::user()->role !== 'admin' && $supportInquiry->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return $supportInquiry->load('user');
    }

    /**
     * Add a message to an existing inquiry.
     */
    public function addMessage(Request $request, SupportInquiry $supportInquiry)
    {
        if (!Auth::check()) {
             return response()->json(['message' => 'Unauthenticated'], 401);
        }

        if (Auth::user()->role !== 'admin' && $supportInquiry->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $messages = $supportInquiry->messages;
        $messages[] = [
            'sender' => Auth::user()->name,
            'sender_id' => Auth::id(),
            'is_admin' => Auth::user()->role === 'admin',
            'message' => $validated['message'],
            'created_at' => now(),
        ];

        $supportInquiry->update([
            'messages' => $messages,
            'status' => Auth::user()->role === 'admin' ? 'responded' : 'open',
        ]);

        return response()->json($supportInquiry);
    }

    /**
     * Close an inquiry.
     */
    public function close(SupportInquiry $supportInquiry)
    {
        if (Auth::user()->role !== 'admin' && $supportInquiry->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $supportInquiry->update(['status' => 'closed']);

        return response()->json($supportInquiry);
    }
}
