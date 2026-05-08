<?php

namespace App\Http\Controllers\Features;

use App\Http\Controllers\Controller;
use App\Models\QrCode;

class QRCodeController extends Controller
{
    public function index()
    {
        // Return demo QR codes
        return response()->json([
            [
                'id' => 1,
                'name' => 'CND Upraze Landing',
                'code' => 'cnd-landing',
                'payload' => 'https://cndupraze.com',
                'scan_count' => 1482,
                'is_active' => true,
            ],
            [
                'id' => 2,
                'name' => 'CND Solutions Portal',
                'code' => 'cnd-solutions',
                'payload' => 'https://cndupraze.com',
                'scan_count' => 673,
                'is_active' => true,
            ],
            [
                'id' => 3,
                'name' => 'CND Product Demo',
                'code' => 'cnd-demo',
                'payload' => 'https://cndupraze.com',
                'scan_count' => 2104,
                'is_active' => true,
            ],
        ]);
    }

    /**
     * Scan handler — redirects to CND Upraze landing page.
     */
    public function show($code)
    {
        $qrcode = QrCode::where('code', $code)->where('is_active', true)->first();

        if ($qrcode) {
            $qrcode->increment('scan_count');
        }

        // Always redirect to CND landing page
        return redirect('https://cndupraze.com');
    }
}
