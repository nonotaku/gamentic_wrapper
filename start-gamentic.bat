@echo off
title Gamentic - local game portal
cd /d "%~dp0"
echo.
echo  ============================================
echo   Gamentic game portal starting ...
echo   Browser will open at  http://localhost:4321
echo   Keep this window OPEN while playing.
echo   Close this window to stop the server.
echo  ============================================
echo.
start "" /min cmd /c "timeout /t 2 >nul & start http://localhost:4321"
node server.mjs
pause
