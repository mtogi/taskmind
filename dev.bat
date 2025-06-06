@echo off
echo Starting TaskMind development servers...

REM Start the backend server in a new window
start cmd /k "cd server && npm run dev"

REM Wait a moment for the server to start
timeout /t 2 /nobreak > nul

REM Start the frontend server in a new window
start cmd /k "npm run dev"

echo Development servers are running.
echo Close the terminal windows to stop the servers. 