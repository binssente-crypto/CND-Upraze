@echo off
SETLOCAL EnableDelayedExpansion
TITLE CND UPRAZE - Stopping Services

:: Colors
SET "ESC= "
SET "CYAN=%ESC%[96m"
SET "YELLOW=%ESC%[93m"
SET "GREEN=%ESC%[92m"
SET "RESET=%ESC%[0m"

cls
echo %CYAN%================================================================%RESET%
echo %CYAN%          CND UPRAZE SOLUTIONS - STOPPING SERVICES             %RESET%
echo %CYAN%================================================================%RESET%
echo.

echo %YELLOW%Stopping all containers...%RESET%
docker compose down

echo.
echo %GREEN%All services stopped successfully.%RESET%
timeout /t 3
exit
