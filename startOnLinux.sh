#!/bin/bash

echo "Wähle eine Option:"
echo "[1] API starten"
echo "[2] WebApp starten"
echo "[3] Beides starten"
read -p "Bitte wähle eine Option: " choice

case $choice in
    1)
        (cd shs-api && node nt-shs-api.js)
        ;;
    2)
        (cd smarthome-system && npx next dev)
        ;;
    3)
        (cd smarthome-system && npx next dev &)
        (cd shs-api && node nt-shs-api.js)
        ;;
    *)
        echo "Ungültige Auswahl."
        ;;
esac
