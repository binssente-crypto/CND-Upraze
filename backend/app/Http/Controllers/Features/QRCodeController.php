<?php

namespace App\Http\Controllers\Features;

use App\Http\Controllers\Controller;
use App\Models\QrCode;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class QRCodeController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->qrCodes()->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'payload' => 'required|string',
        ]);

        $qrcode = QrCode::create([
            'user_id' => $request->user()->id,
            'payload' => $request->payload,
            'code' => Str::random(10),
            'scan_count' => 0,
            'is_active' => true,
        ]);

        return response()->json($qrcode, 201);
    }

    public function show($code)
    {
        $qrcode = QrCode::where('code', $code)->firstOrFail();
        $qrcode->increment('scan_count');
        
        // In a real app, this would redirect if payload is a URL
        return response()->json($qrcode);
    }
}
