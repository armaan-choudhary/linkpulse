@echo off
echo ======================================================
echo Starting Lnk Full-Stack Dev Environment
echo ======================================================

echo [Backend] Starting API server on http://localhost:5000...
start "Backend API" cmd /c "cd backend && npm run dev"

echo [Frontend] Starting SPA dev server on http://localhost:5173...
start "Frontend SPA" cmd /c "cd frontend && npm run dev"

echo.
echo Both servers launched in separate command windows.
pause
