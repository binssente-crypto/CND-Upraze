<?php

namespace App\Http\Controllers\Features;

use App\Http\Controllers\Controller;
use App\Models\Model3d;
use Illuminate\Http\Request;

class ThreeDManipulationController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->models3d()->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file', // Ensure glb/obj logic later
            'name' => 'required|string|max:255',
        ]);

        $path = $request->file('file')->store('models_3d');

        $model = Model3d::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'file_path' => $path,
            'file_type' => $request->file('file')->getClientOriginalExtension(),
            'file_size' => $request->file('file')->getSize(),
        ]);

        return response()->json($model, 201);
    }
}
