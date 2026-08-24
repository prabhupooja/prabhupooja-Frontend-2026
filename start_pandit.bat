@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0panditpaneladmin"
echo ==============================================
echo  Starting Pandit Panel Admin (Port 3001)
echo ==============================================
call npm start
pause
