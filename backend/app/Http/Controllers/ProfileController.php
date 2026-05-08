<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    public function updateNickname(Request $request)
    {
        $request->validate([
            'nickname' => 'required|string|min:2|max:50',
        ]);

        $user = $request->user();
        $user->update(['nickname' => $request->nickname]);

        return response()->json([
            'user' => $user->fresh(),
            'message' => 'Nickname updated successfully.',
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|current_password',
            'new_password' => ['required', Password::min(8)->mixedCase()->numbers(), 'confirmed'],
        ]);

        $user = $request->user();
        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        return response()->json([
            'message' => 'Password changed successfully.',
        ]);
    }
}
