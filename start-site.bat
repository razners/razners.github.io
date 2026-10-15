@echo off
cd /d "%~dp0"
set PORT=8082

for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "$r=(Get-NetRoute -DestinationPrefix 0.0.0.0/0 | Sort-Object RouteMetric | Select-Object -First 1).InterfaceIndex; (Get-NetIPAddress -AddressFamily IPv4 -InterfaceIndex $r).IPAddress"`) do set IP=%%i

echo.
echo  Portfolio (ARVEST studio + works) is running. Do not close this window.
echo.
echo  On this computer:  http://localhost:%PORT%/
if defined IP echo  On your phone:     http://%IP%:%PORT%/   (same Wi-Fi as the computer)
if not defined IP echo  Phone address: run ipconfig and use the Wi-Fi IPv4 address
echo.
echo  To stop the site, close this window or press Ctrl+C.
echo.

start "" "http://localhost:%PORT%/"
python -m http.server %PORT% --bind 0.0.0.0
pause
