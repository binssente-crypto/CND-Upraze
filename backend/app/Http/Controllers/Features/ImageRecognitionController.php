<?php

namespace App\Http\Controllers\Features;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ImageRecognitionController extends Controller
{
    /**
     * Return static demo image recognition results (Google Vision style).
     */
    public function index(Request $request)
    {
        return response()->json([
            [
                'id' => 1,
                'provider' => 'google_vision',
                'status' => 'completed',
                'result_json' => [
                    'labels' => [
                        ['name' => 'Office Equipment', 'confidence' => 0.97],
                        ['name' => 'Computer Hardware', 'confidence' => 0.94],
                        ['name' => 'Indoor Workspace', 'confidence' => 0.91],
                        ['name' => 'Plastic / Metal', 'confidence' => 0.86],
                        ['name' => 'Silver / Black', 'confidence' => 0.82],
                    ],
                ],
            ],
        ]);
    }
}
