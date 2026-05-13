<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function current(Request $request)
    {
        $user = $request->user();
        $subscription = \App\Models\Subscription::where('user_id', $user->id)
            ->where(function ($query) {
                $query->whereNull('ends_at')
                      ->orWhere('ends_at', '>', now());
            })
            ->with('plan')
            ->latest()
            ->first();

        return response()->json([
            'subscription' => $subscription
        ]);
    }
}
