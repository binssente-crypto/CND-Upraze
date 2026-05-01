<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to CND UPRAZE</title>
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
            font-size: 16px;
        }
        .btn-container {
            margin: 35px 0;
        }
        .verify-btn {
            background-color: #06b6d4;
            color: #ffffff !important;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            display: inline-block;
            box-shadow: 0 4px 14px rgba(6, 182, 212, 0.3);
        }
        .footer {
            padding: 30px;
            background-color: #fafafa;
            text-align: center;
            font-size: 12px;
            color: #999999;
            border-top: 1px solid #eeeeee;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em;">CND UPRAZE</h1>
        </div>
        <div class="content">
            <div style="margin-bottom: 20px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div class="welcome-text">Welcome to the Ecosystem</div>
            <p class="description">Thank you for joining CND Upraze Solutions. To finalize your account and access your professional dashboard, please click the verification button below.</p>
            
            <div class="btn-container">
                <a href="{{ $url }}" class="verify-btn">Verify My Account</a>
            </div>

            <p style="color: #999; font-size: 13px;">If the button doesn't work, copy and paste this link into your browser:<br>
            <span style="color: #06b6d4;">{{ $url }}</span></p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} CND Upraze Solutions. All rights reserved.</p>
            <p>Precise Digital Ecosystems for the Next Generation.</p>
        </div>
    </div>
</body>
</html>
