@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0FRONTEND"
echo ==============================================
echo  Starting PrabhuPooja Main Frontend (Port 3000)
echo ==============================================
call npm start
pause
