@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
echo ==============================================================
echo  Launching Both PrabhuPooja Frontend (3000) & Pandit Panel (3001)
echo ==============================================================
start "PrabhuPooja Main Frontend (Port 3000)" cmd /k "set PATH=C:\Program Files\nodejs;%%PATH%% && cd /d %~dp0FRONTEND && npm start"
start "PrabhuPooja Pandit Admin (Port 3001)" cmd /k "set PATH=C:\Program Files\nodejs;%%PATH%% && cd /d %~dp0panditpaneladmin && npm start"
echo Both servers started in their dedicated windows!
pause
