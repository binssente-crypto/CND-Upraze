<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        // For admin/superadmin to see all orders
        $orders = \App\Models\Order::with(['user', 'offer'])->orderBy('created_at', 'desc')->get();
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        try {
            \Log::info('Order store called', ['user' => $request->user()?->id]);

            $validated = $request->validate([
                'offer_id' => 'nullable|exists:offers,id',
                'plan_name' => 'nullable|string',
                'company_name' => 'nullable|string',
                'company_logo' => 'nullable|string',
                'short_description' => 'nullable|string',
                'design_preference' => 'nullable|string',
                'feature_options' => 'nullable|string',
            ]);

            \Log::info('Validation passed', $validated);

            $order = \App\Models\Order::create([
                'user_id' => $request->user()->id,
                'offer_id' => $validated['offer_id'] ?? null,
                'plan_name' => $validated['plan_name'] ?? null,
                'company_name' => $validated['company_name'] ?? null,
                'company_logo' => $validated['company_logo'] ?? null,
                'short_description' => $validated['short_description'] ?? null,
                'design_preference' => $validated['design_preference'] ?? null,
                'feature_options' => $validated['feature_options'] ?? null,
                'status' => 'pending',
            ]);

            \Log::info('Order created', ['order_id' => $order->id]);

            try {
                // Find price based on offer or default
                $amount = 10000; // default 10k PHP
                if ($order->offer_id) {
                    $offer = \App\Models\Offer::find($order->offer_id);
                    if ($offer && $offer->price) {
                        // Strip commas in case admin entered "3,500" format
                        $amount = (float) str_replace(',', '', $offer->price);
                    }
                }

                // Use direct HTTP call to Xendit API (bypassing SDK bug)
                $xenditKey = env('XENDIT_SECRET_KEY');
                \Log::info('Calling Xendit API', ['amount' => $amount, 'key_prefix' => substr($xenditKey, 0, 20)]);

                $response = \Illuminate\Support\Facades\Http::withBasicAuth($xenditKey, '')
                    ->post('https://api.xendit.co/v2/invoices', [
                        'external_id' => 'order-' . $order->id . '-' . time(),
                        'amount' => (float) $amount,
                        'payer_email' => $request->user()->email,
                        'description' => 'Payment for ' . ($order->plan_name ?: 'Custom Package'),
                        'success_redirect_url' => env('FRONTEND_URL', 'http://localhost:5173') . '/dashboard',
                        'failure_redirect_url' => env('FRONTEND_URL', 'http://localhost:5173') . '/dashboard/billing',
                        'currency' => 'PHP',
                    ]);

                \Log::info('Xendit response', ['status' => $response->status(), 'body' => $response->body()]);

                if ($response->successful()) {
                    $invoiceData = $response->json();
                    $order->update([
                        'xendit_invoice_id' => $invoiceData['id'] ?? null,
                        'payment_url' => $invoiceData['invoice_url'] ?? null,
                    ]);
                } else {
                    \Log::error('Xendit API Error: ' . $response->body());
                }

            } catch (\Exception $e) {
                \Log::error('Xendit Error: ' . $e->getMessage() . ' | ' . $e->getTraceAsString());
            }

            return response()->json([
                'message' => 'Order created successfully',
                'order' => $order->fresh(),
                'payment_url' => $order->fresh()->payment_url
            ], 201);

        } catch (\Throwable $e) {
            \Log::error('ORDER STORE FATAL: ' . $e->getMessage() . ' at ' . $e->getFile() . ':' . $e->getLine());
            return response()->json([
                'error' => true,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $order = \App\Models\Order::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|string|in:pending,processing,completed,cancelled',
        ]);

        $order->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order
        ]);
    }

    public function handleXenditWebhook(Request $request)
    {
        // Verify Xendit Webhook Token
        $xenditToken = env('XENDIT_WEBHOOK_TOKEN');
        if ($request->header('x-callback-token') !== $xenditToken) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Check if invoice is PAID
        if ($request->status === 'PAID') {
            $order = \App\Models\Order::where('xendit_invoice_id', $request->id)->first();
            if ($order && $order->status === 'pending') {
                $order->update(['status' => 'processing']);
            }
        }

        return response()->json(['success' => true]);
    }
}
