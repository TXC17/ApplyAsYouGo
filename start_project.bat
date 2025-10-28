@echo off
echo Starting ApplyAsYouGo College Project...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd SERVER && python app.py"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Development Server...
start "Frontend Server" cmd /k "cd internity && npm run dev"

echo.
echo Both servers are starting!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul