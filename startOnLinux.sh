#!/bin/bash

echo "Select an option:"
echo "[1] Start API"
echo "[2] Start WebApp"
echo "[3] Start both"
read -p "Please choose an option: " choice

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
