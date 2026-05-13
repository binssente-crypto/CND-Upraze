<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;

use Illuminate\Validation\Rules\Password;

use App\Mail\WelcomeVerifyEmail;
use App\Mail\VerificationEmail;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', Password::min(8)->mixedCase()->numbers()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'company_name' => $request->company_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
        ]);

        // Generate OTP
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        // Store OTP in cache for 5 minutes
        Cache::put('otp_' . $request->email, $otp, now()->addMinutes(5));

        // Generate Verification Link for the Button
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        $verifyUrl = $frontendUrl . '/login?verify=true&email=' . urlencode($request->email) . '&otp=' . $otp;

        // Send Branded HTML Welcome Email with Button
        try {
            Mail::to($request->email)->send(new WelcomeVerifyEmail($verifyUrl));
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to queue welcome email.'], 500);
        }

        return response()->json([
            'message' => 'Verification email sent. Please check your inbox.',
            'email' => $request->email,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Generate OTP
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        // Store OTP in cache for 5 minutes
        Cache::put('otp_' . $request->email, $otp, now()->addMinutes(5));

        // Send Branded HTML Email (Queued for performance)
        try {
            Mail::to($request->email)->send(new VerificationEmail($otp));
        } catch (\Exception $e) {
            // Log error or handle gracefully
            return response()->json(['message' => 'Failed to queue OTP email.'], 500);
        }

        return response()->json([
            'message' => 'Verification code sent to your email.',
            'email' => $request->email
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ]);

        $cachedOtp = Cache::get('otp_' . $request->email);

        if (!$cachedOtp || $cachedOtp !== $request->otp) {
            throw ValidationException::withMessages([
                'otp' => ['The verification code is invalid or has expired.'],
            ]);
        }

        // Clear OTP after successful verification
        Cache::forget('otp_' . $request->email);

        $user = User::where('email', $request->email)->firstOrFail();

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('auth_token')->plainTextToken,
            'role' => $user->role,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        
        $unreadSupportCount = \App\Models\SupportMessage::whereHas('thread', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->where('is_read', false)
        ->where('sender_id', '!=', $user->id)
        ->count();

        return response()->json([
            'user' => $user,
            'role' => $user->role,
            'unread_support_count' => $unreadSupportCount
        ]);
    }

    public function setNickname(Request $request)
    {
        $request->validate([
            'nickname' => 'required|string|min:2|max:50',
        ]);

        $user = $request->user();
        $user->update(['nickname' => $request->nickname]);

        return response()->json([
            'user' => $user->fresh(),
            'message' => 'Nickname set successfully.',
        ]);
    }
}
