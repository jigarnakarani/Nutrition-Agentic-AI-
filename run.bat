@echo off
title NutriBot AI — IBM Granite LLM
color 1F
cls

echo ============================================================
echo   NutriBot AI - Personalized Nutrition — IBM Granite LLM
echo   GitHub: github.com/jigarnakarani/Nutrition-Agentic-AI-
echo ============================================================
echo.

:: ── Check Python ──────────────────────────────────────────────
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    echo.
    echo Please install Python 3.11+ from:
    echo   https://www.python.org/downloads/
    echo.
    echo During installation, CHECK "Add Python to PATH"
    pause
    exit /b 1
)

for /f "tokens=2 delims= " %%v in ('python --version 2^>^&1') do set PYVER=%%v
echo [OK] Python %PYVER% detected.

:: ── Navigate to project folder ────────────────────────────────
cd /d "%~dp0"
echo [OK] Project directory: %~dp0

:: ── Create virtual environment if not exists ──────────────────
if not exist "venv\" (
    echo.
    echo [SETUP] Creating Python virtual environment...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
    echo [OK] Virtual environment created.
) else (
    echo [OK] Virtual environment found.
)

:: ── Activate virtual environment ──────────────────────────────
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo [ERROR] Failed to activate virtual environment.
    pause
    exit /b 1
)
echo [OK] Virtual environment activated.

:: ── Upgrade pip silently ──────────────────────────────────────
python -m pip install --upgrade pip --quiet

:: ── Install / Update dependencies ─────────────────────────────
echo.
echo [SETUP] Installing required packages (this may take 1-2 minutes on first run)...
pip install -r requirements.txt --quiet
if %errorlevel% neq 0 (
    echo [WARNING] Some packages may not have installed correctly.
    echo           The app will run in Demo Mode without IBM Watsonx.
    echo.
) else (
    echo [OK] All packages installed successfully.
)

:: ── Load .env file if it exists ────────────────────────────────
echo.
if exist ".env" (
    echo [OK] Loading .env configuration...
    for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
        if not "%%A"=="" if not "%%A:~0,1%"=="#" (
            set "%%A=%%B"
        )
    )
    echo [OK] Environment variables loaded.
) else (
    echo [INFO] No .env file found. Copying from .env.example...
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo.
        echo ============================================================
        echo   OPTIONAL: Enable IBM Granite Full AI Mode
        echo ============================================================
        echo.
        echo   To connect to IBM watsonx.ai (IBM Granite LLM):
        echo   1. Open: %~dp0.env
        echo   2. Set WATSONX_API_KEY=^<your key^>
        echo   3. Set WATSONX_PROJECT_ID=^<your project id^>
        echo.
        echo   Get API Key  : https://cloud.ibm.com/iam/apikeys
        echo   Get Project  : https://dataplatform.cloud.ibm.com
        echo.
        echo   Without a key the app runs in DEMO MODE (fully functional).
        echo ============================================================
        echo.
    )
)

:: ── Create plans output directory ─────────────────────────────
if not exist "plans\" (
    mkdir plans
    echo [OK] Created plans/ output directory.
)

:: ── Launch the application ─────────────────────────────────────
echo.
echo ============================================================
echo   Starting NutriBot AI...
echo ============================================================
echo.
echo   URL  : http://localhost:5000
echo   Stop : Press Ctrl+C in this window
echo.
echo ============================================================
echo.

:: Open browser after short delay
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:5000"

:: Start Flask server
python app.py

:: ── Cleanup on exit ────────────────────────────────────────────
echo.
echo ============================================================
echo   NutriBot AI server stopped.
echo   Thank you for using NutriBot AI!
echo ============================================================
echo.
call venv\Scripts\deactivate.bat 2>nul
pause
