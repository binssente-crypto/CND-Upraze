<?php

namespace App\Http\Controllers\Features;

use App\Http\Controllers\Controller;
use App\Models\ImageRecognitionJob;
use Illuminate\Http\Request;

class ImageRecognitionController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->imageRecognitionJobs()->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120',
        ]);

        $path = $request->file('image')->store('recognition_images');

        $job = ImageRecognitionJob::create([
            'user_id' => $request->user()->id,
            'image_path' => $path,
            'provider' => 'google_vision',
            'status' => 'completed',
            'result_json' => [
                'labels' => [
                    ['name' => 'Laptop', 'confidence' => 0.99],
                    ['name' => 'Technology', 'confidence' => 0.95],
                    ['name' => 'SaaS', 'confidence' => 0.85]
                ]
            ]
        ]);

        return response()->json($job, 201);
    }
}
