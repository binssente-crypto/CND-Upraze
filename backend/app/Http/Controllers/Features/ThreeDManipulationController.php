<?php

namespace App\Http\Controllers\Features;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ThreeDManipulationController extends Controller
{
    /**
     * Return static demo 3D model list.
     */
    public function index(Request $request)
    {
        return response()->json([
            [
                'id' => 1,
                'name' => 'Product_Demo.glb',
                'file_type' => 'glb',
                'file_size' => 2516582,
            ],
            [
                'id' => 2,
                'name' => 'Prototype_V2.glb',
                'file_type' => 'glb',
                'file_size' => 5347264,
            ],
        ]);
    }
}
