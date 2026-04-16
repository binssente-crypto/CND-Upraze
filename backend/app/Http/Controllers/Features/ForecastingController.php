<?php

namespace App\Http\Controllers\Features;

use App\Http\Controllers\Controller;
use App\Models\ForecastingJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ForecastingController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->forecastingJobs()->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,xlsx,txt',
        ]);

        $path = $request->file('file')->store('forecasting_files');

        $job = ForecastingJob::create([
            'user_id' => $request->user()->id,
            'file_path' => $path,
            'status' => 'completed', // Mocking completion for demonstration
            'result_json' => [
                'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                'actual' => [100, 120, 115, 140, 160],
                'predicted' => [105, 125, 120, 145, 165],
                'accuracy' => 0.96
            ]
        ]);

        return response()->json($job, 201);
    }
}
