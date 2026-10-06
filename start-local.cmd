@echo off
REM NexaRealEstate - local server launcher (port 1404)
cd /d "D:\Projects\Vortex\portfolio\NexaRealEstate"
echo.
echo   NexaRealEstate is starting...
echo   Local:    http://localhost:1404
echo   Network:  http://192.168.1.113:1404
echo.
echo   Keep this window OPEN while you use the site.
echo   Press Ctrl+C to stop the server.
echo.
if not exist ".next\BUILD_ID" (
  echo   First run: building production bundle...
  call npx next build --webpack
)
call npx next start -p 1404
