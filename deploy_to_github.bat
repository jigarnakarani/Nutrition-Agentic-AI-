@echo off
title NutriBot AI — GitHub Deploy
color 0A
cls

echo ============================================================
echo   NutriBot AI — GitHub Deployment Script
echo   Repo: https://github.com/jigarnakarani/Nutrition-Agentic-AI-
echo ============================================================
echo.

:: Navigate to this script's folder
cd /d "%~dp0"
echo [OK] Working directory: %~dp0
echo.

:: ── Check Git ─────────────────────────────────────────────────
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in PATH.
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo Then re-run this script.
    pause
    exit /b 1
)

for /f "tokens=3" %%v in ('git --version') do set GITVER=%%v
echo [OK] Git %GITVER% detected.
echo.

:: ── Check Python ──────────────────────────────────────────────
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found. Install Python 3.11+ first.
    echo   https://www.python.org/downloads/
    pause
    exit /b 1
)
echo [OK] Python detected.
echo.

:: ── Configure Git identity (update these if needed) ───────────
echo [GIT] Configuring git identity...
git config user.email "jigar@nutribot.ai" 2>nul
git config user.name "jigarnakarani" 2>nul

:: ── Init repo if not already initialised ──────────────────────
if not exist ".git\" (
    echo [GIT] Initialising git repository...
    git init
    if %errorlevel% neq 0 (
        echo [ERROR] git init failed.
        pause
        exit /b 1
    )
    echo [OK] Git repository initialised.
) else (
    echo [OK] Git repository already exists.
)
echo.

:: ── Set default branch to main ────────────────────────────────
git checkout -b main 2>nul
if %errorlevel% neq 0 (
    git checkout main 2>nul
)
echo [OK] Branch: main

:: ── Set remote origin ─────────────────────────────────────────
echo.
echo [GIT] Configuring remote origin...
git remote remove origin 2>nul
git remote add origin https://github.com/jigarnakarani/Nutrition-Agentic-AI-.git
if %errorlevel% neq 0 (
    echo [ERROR] Failed to set remote origin.
    pause
    exit /b 1
)
echo [OK] Remote set to: https://github.com/jigarnakarani/Nutrition-Agentic-AI-.git

:: ── Stage all files ────────────────────────────────────────────
echo.
echo [GIT] Staging all project files...
git add .
if %errorlevel% neq 0 (
    echo [ERROR] git add failed.
    pause
    exit /b 1
)
echo [OK] Files staged.

:: Show what will be committed
echo.
echo [GIT] Files to be committed:
git status --short
echo.

:: ── Commit ─────────────────────────────────────────────────────
echo [GIT] Creating initial commit...
git commit -m "Initial commit: NutriBot AI — Nutrition Agentic AI with IBM Granite LLM

- Flask backend with IBM Granite (granite-13b-instruct-v2) integration
- Personalized 7-day nutrition plan generation
- Agentic AI SDLC with ethics guardrails (HAM framework)
- Medical condition-aware (diabetes, hypertension, heart disease, etc.)
- Conversational NutriBot chat agent
- .md plan export with medical disclaimer
- Demo mode (no API key required)
- Windows one-click launcher (run.bat)
- IBM AI Ethics: transparency, fairness, robustness, privacy, accountability
- Responsive web UI (HTML/CSS/Vanilla JS)

Powered by IBM watsonx.ai | Built following Agentic AI SDLC principles"

if %errorlevel% neq 0 (
    echo [WARNING] Commit may have failed (nothing to commit or git error).
    echo           Trying to push existing commits...
)

:: ── Push to GitHub ─────────────────────────────────────────────
echo.
echo ============================================================
echo   Pushing to GitHub...
echo   You may be prompted to sign in to GitHub.
echo   Use a Personal Access Token (PAT) as the password.
echo   Create one at: https://github.com/settings/tokens
echo ============================================================
echo.

git push -u origin main --force
if %errorlevel% neq 0 (
    echo.
    echo [RETRY] Trying with master branch...
    git push -u origin master --force
    if %errorlevel% neq 0 (
        echo.
        echo ============================================================
        echo   [ERROR] Push failed. Common fixes:
        echo ============================================================
        echo.
        echo   1. Authentication: Use a GitHub Personal Access Token (PAT)
        echo      Create at: https://github.com/settings/tokens
        echo      When prompted for password, paste the PAT token.
        echo.
        echo   2. If using SSH: ensure your SSH key is added to GitHub
        echo      https://github.com/settings/keys
        echo.
        echo   3. Check the repo exists:
        echo      https://github.com/jigarnakarani/Nutrition-Agentic-AI-
        echo ============================================================
        pause
        exit /b 1
    )
)

:: ── Success ────────────────────────────────────────────────────
echo.
echo ============================================================
echo   SUCCESS! NutriBot AI deployed to GitHub!
echo ============================================================
echo.
echo   Repository: https://github.com/jigarnakarani/Nutrition-Agentic-AI-
echo.
echo   Next steps:
echo   1. Visit the repo URL above to verify your files
echo   2. Run  run.bat  to start the app locally
echo   3. Share the GitHub link with others!
echo.
echo ============================================================

:: Open the GitHub repo in browser
start https://github.com/jigarnakarani/Nutrition-Agentic-AI-

pause
