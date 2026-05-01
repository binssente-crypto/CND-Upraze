@echo off
SETLOCAL EnableDelayedExpansion
TITLE CND UPRAZE - Local Development Environment

:: Colors
SET "ESC="
SET "CYAN=%ESC%[96m"
SET "GREEN=%ESC%[92m"
SET "YELLOW=%ESC%[93m"
SET "RED=%ESC%[91m"
SET "RESET=%ESC%[0m"
SET "BOLD=%ESC%[1m"

cls
echo %CYAN%================================================================%RESET%
echo %CYAN%%BOLD%          CND UPRAZE SOLUTIONS - DEVELOPMENT LAUNCHER          %RESET%
echo %CYAN%================================================================%RESET%
echo.

:: Check if Docker is running
echo %YELLOW%[1/4] Checking Docker status...%RESET%
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%[ERROR] Docker is not running. Please start Docker Desktop and try again.%RESET%
    pause
    exit /b
)
echo %GREEN%[OK] Docker is active.%RESET%

:: Check Environment Files
echo %YELLOW%[2/5] Checking environment files...%RESET%
if not exist "backend\.env" (
    echo %YELLOW%[INFO] Creating backend .env from .env.example...%RESET%
    copy "backend\.env.example" "backend\.env" >nul
    echo %YELLOW%[INFO] Please update backend\.env with your secrets if needed.%RESET%
)
if not exist "frontend\.env" (
    if exist "frontend\.env.example" (
        echo %YELLOW%[INFO] Creating frontend .env from .env.example...%RESET%
        copy "frontend\.env.example" "frontend\.env" >nul
    )
)
echo %GREEN%[OK] Environment files checked.%RESET%

:: Start Containers
echo %YELLOW%[3/5] Starting services with Docker Compose...%RESET%
docker compose up -d
if %errorlevel% neq 0 (
    echo %RED%[ERROR] Failed to start Docker containers.%RESET%
    pause
    exit /b
)
echo %GREEN%[OK] Containers are booting up.%RESET%

:: Run Migrations
echo %YELLOW%[4/5] Ensuring database is up to date...%RESET%
echo.
docker compose exec backend php artisan migrate --force
if %errorlevel% neq 0 (
    echo %YELLOW%[INFO] Database might not be ready yet, retrying in 5 seconds...%RESET%
    timeout /t 5 /nobreak >nul
    docker compose exec backend php artisan migrate --force
)
echo %GREEN%[OK] Database migrated.%RESET%

:: Open Browser
echo %YELLOW%[5/5] Launching Frontend...%RESET%
echo %CYAN%URL: http://localhost:5173%RESET%
start http://localhost:5173

echo.
echo %GREEN%%BOLD%Development environment is ready!%RESET%
echo.
echo %YELLOW%Showing logs (Ctrl+C to stop logs, containers will keep running):%RESET%
echo.
docker compose logs -f frontend backend
