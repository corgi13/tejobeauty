@echo off
echo Starting Tejo Beauty Platform...
echo.
echo Backend will start on: http://localhost:3001
echo Frontend will start on: http://localhost:3000
echo API Documentation: http://localhost:3001/api
echo.

start "Tejo Beauty Backend" cmd /k "cd backend && npm run start:dev"
timeout /t 3 /nobreak > nul
start "Tejo Beauty Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo Check the opened terminal windows for status
pause