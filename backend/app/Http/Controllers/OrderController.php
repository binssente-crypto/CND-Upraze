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

            return response()->json([
                'message' => 'Order created successfully. Please wait for admin approval.',
                'order' => $order->fresh()
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
            'status' => 'required|string|in:pending,approved,processing,completed,cancelled',
        ]);

        $oldStatus = $order->status;
        $order->update(['status' => $validated['status']]);

        // If admin approves the order, generate payment link and send support message
        if ($oldStatus === 'pending' && $validated['status'] === 'approved') {
            try {
                $amount = 10000;
                if ($order->offer_id) {
                    $offer = \App\Models\Offer::find($order->offer_id);
                    if ($offer && $offer->price) {
                        $amount = (float) str_replace(',', '', $offer->price);
                    }
                }

                $xenditKey = env('XENDIT_SECRET_KEY');
                $response = \Illuminate\Support\Facades\Http::withBasicAuth($xenditKey, '')
                    ->post('https://api.xendit.co/v2/invoices', [
                        'external_id' => 'order-' . $order->id . '-' . time(),
                        'amount' => (float) $amount,
                        'payer_email' => $order->user->email,
                        'description' => 'Payment for ' . ($order->plan_name ?: 'Custom Package'),
                        'success_redirect_url' => env('FRONTEND_URL', 'http://localhost:5173') . '/dashboard',
                        'failure_redirect_url' => env('FRONTEND_URL', 'http://localhost:5173') . '/dashboard/billing',
                        'currency' => 'PHP',
                    ]);

                if ($response->successful()) {
                    $invoiceData = $response->json();
                    $order->update([
                        'xendit_invoice_id' => $invoiceData['id'] ?? null,
                        'payment_url' => $invoiceData['invoice_url'] ?? null,
                    ]);

                    // Create support thread and message
                    $thread = \App\Models\SupportThread::firstOrCreate(
                        [
                            'user_id' => $order->user_id,
                            'subject' => 'Payment Link for Order #' . $order->id,
                        ],
                        [
                            'category' => 'Billing',
                            'status' => 'open',
                            'assigned_admin_id' => $request->user()->id,
                        ]
                    );

                    \App\Models\SupportMessage::create([
                        'thread_id' => $thread->id,
                        'sender_id' => $request->user()->id,
                        'message' => "Your order for " . ($order->plan_name ?: 'Custom Package') . " has been approved! Please proceed with payment using this link: " . $invoiceData['invoice_url'],
                        'is_read' => false,
                    ]);
                }
            } catch (\Exception $e) {
                \Log::error('Xendit Error on Update: ' . $e->getMessage());
            }
        }

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order->fresh()
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
            if ($order && in_array($order->status, ['pending', 'approved'])) {
                $order->update(['status' => 'processing']);
                
                try {
                    \Illuminate\Support\Facades\Mail::to($order->user->email)->send(new \App\Mail\PaymentReceiptMail($order));
                } catch (\Exception $e) {
                    \Log::error('Failed to send payment receipt email: ' . $e->getMessage());
                }
            }
        }

        return response()->json(['success' => true]);
    }
}
