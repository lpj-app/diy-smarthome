@echo off

chcp 65001 >nul 

echo Wähle eine Option:
echo [1] API starten
echo [2] WebApp starten
echo [3] Beides starten
set /p choice=Bitte wähle eine Option: 

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
