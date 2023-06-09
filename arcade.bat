start /min cmd /k "npm run dev"

timeout /t 5 /nobreak

"c:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk http://localhost:5173 --disable-pinch --no-user-gesture-required --autoplay-policy=no-user-gesture-required --overscroll-history-navigation=0
