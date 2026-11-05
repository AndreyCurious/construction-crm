@echo off
setlocal
cd /d "%~dp0"

where node.exe >nul 2>nul
if errorlevel 1 (
  for /d %%N in ("%USERPROFILE%\Desktop\study\.tools\node-*-win-x64") do (
    if exist "%%~fN\node.exe" set "PATH=%%~fN;%PATH%"
  )
)

where node.exe >nul 2>nul
if errorlevel 1 (
  echo Install Node.js 22.12+ or 24 LTS and run this file again.
  pause
  exit /b 1
)

if not exist "node_modules" (
  call npm.cmd ci
  if errorlevel 1 (
    pause
    exit /b 1
  )
)

if not exist ".env.local" if not exist ".env" (
  >".env.local" echo VITE_DATA_SOURCE=demo
)

call npm.cmd run dev
