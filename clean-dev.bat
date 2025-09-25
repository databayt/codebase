@echo off
echo Cleaning Next.js development environment...

:: Kill all Node processes
echo Stopping all Node.js processes...
taskkill /F /IM node.exe 2>nul

:: Wait a moment for processes to fully terminate
timeout /t 2 /nobreak >nul

:: Force delete .next folder
echo Removing .next folder...
if exist .next (
    rmdir /S /Q .next 2>nul
    if exist .next (
        echo Warning: Could not delete .next folder - trying with admin rights
        takeown /f .next /r /d y >nul 2>&1
        icacls .next /grant administrators:F /t >nul 2>&1
        rmdir /S /Q .next 2>nul
    )
)

:: Clear npm/pnpm cache
echo Clearing package manager cache...
pnpm store prune 2>nul

echo.
echo Cleanup complete! You can now run 'pnpm dev' safely.
echo.