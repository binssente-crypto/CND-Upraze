<!DOCTYPE html>
<html>
<head>
    <title>Payment Receipt</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #0f3460;">Payment Received!</h2>
        </div>
        
        <p>Hi {{ $order->user->name }},</p>
        <p>Thank you for your payment. Your order for <strong>{{ $order->plan_name ?: 'Custom Package' }}</strong> has been successfully processed.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Order ID:</strong> #{{ $order->id }}</p>
            <p style="margin: 5px 0;"><strong>Company Name:</strong> {{ $order->company_name ?: 'N/A' }}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> Processing</p>
            @if($order->payment_url)
                <p style="margin: 5px 0;"><strong>Invoice Link:</strong> <a href="{{ $order->payment_url }}">{{ $order->payment_url }}</a></p>
            @endif
        </div>

        <p>Our team has been notified and will begin processing your order immediately. You can track your order status from your dashboard.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee; text-align: center; font-size: 12px; color: #888888;">
            <p>&copy; {{ date('Y') }} CND UPRAZE SOLUTIONS. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
