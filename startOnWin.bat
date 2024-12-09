@echo off

chcp 65001 >nul 

echo Select an option:
echo [1] Start API
echo [2] Start WebApp
echo [3] Start both
set /p choice=Please select an option: 

if %choice%==1 (
    start cmd /k "cd shs-api && node nt-shs-api.js"
) else if %choice%==2 (
    start cmd /k "cd smarthome-system && npx next dev"
) else if %choice%==3 (
    start cmd /k "cd smarthome-system && npx next dev"
    start cmd /k "cd shs-api && node nt-shs-api.js"
) else (
    echo Ungültige Auswahl.
)
