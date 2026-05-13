<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    public function index()
    {
        return response()->json(Offer::all());
    }

    public function store(Request $request)
    {
        if (!in_array($request->user()->role, ['admin', 'superadmin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string',
            'price' => 'required|string',
            'interval' => 'required|string',
            'features' => 'required|array',
            'status' => 'required|string',
            'type' => 'required|string',
        ]);

        $offer = Offer::create([
            'name' => $validated['name'],
            'price' => $validated['price'],
            'interval' => $validated['interval'],
            'features' => $validated['features'],
            'status' => $validated['status'],
            'type' => $validated['type'],
        ]);

        return response()->json($offer, 201);
    }

    public function update(Request $request, Offer $offer)
    {
        if (!in_array($request->user()->role, ['admin', 'superadmin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'price' => 'sometimes|string',
            'interval' => 'sometimes|string',
            'features' => 'sometimes|array',
            'status' => 'sometimes|string',
            'type' => 'sometimes|string',
        ]);

        $offer->update($validated);

        return response()->json($offer);
    }

    public function destroy(Request $request, Offer $offer)
    {
        if (!in_array($request->user()->role, ['admin', 'superadmin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $offer->delete();

        return response()->json(['message' => 'Offer deleted successfully']);
    }
}
