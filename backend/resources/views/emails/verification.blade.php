<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code - CND UPRAZE</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            margin: 0;
            padding: 0;
            background-color: #f4f7f9;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .header {
            background-color: #09090b;
            padding: 30px;
            text-align: center;
        }
        .header img {
            height: 40px;
        }
        .content {
            padding: 40px;
            text-align: center;
        }
        .welcome-text {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 20px;
            color: #09090b;
            text-transform: uppercase;
            letter-spacing: -0.02em;
        }
        .description {
            color: #666666;
            margin-bottom: 30px;
        }
        .otp-container {
            background-color: #f8fafc;
            border: 2px dashed #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            margin: 30px 0;
        }
        .otp-code {
            font-size: 38px;
            font-weight: 900;
            letter-spacing: 0.15em;
            color: #06b6d4;
            font-family: 'Courier New', Courier, monospace;
            white-space: nowrap;
        }
        .footer {
            padding: 30px;
            background-color: #fafafa;
            text-align: center;
            font-size: 12px;
            color: #999999;
            border-top: 1px solid #eeeeee;
        }
        .warning {
            color: #ef4444;
            font-weight: 600;
            font-size: 13px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div style="display: inline-block; vertical-align: middle; margin-right: 10px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .52-.88l7-4a1 1 0 0 1 .96 0l7 4A1 1 0 0 1 20 6v7z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <h1 style="display: inline-block; vertical-align: middle; color: white; margin: 0; font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em;">CND UPRAZE</h1>
        </div>
        <div class="content">
            <div style="margin-bottom: 20px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <div class="welcome-text">Verify Your Identity</div>
            <p class="description">To continue accessing your CND node, please use the secure verification code below. This code will expire in 5 minutes.</p>
            
            <div class="otp-container">
                <div class="otp-code">{{ $otp }}</div>
            </div>

            <p class="warning">If you did not request this code, please secure your account immediately.</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} CND Upraze Solutions. All rights reserved.</p>
            <p>Precise Digital Ecosystems for the Next Generation.</p>
        </div>
    </div>
</body>
</html>
