@echo off
SET SDK_PATH=C:\Users\paulo\AppData\Local\Android\Sdk

REM === Corrige ANDROID_HOME ===
echo Definindo ANDROID_HOME como %SDK_PATH%
setx ANDROID_HOME "%SDK_PATH%" /M

REM === Adiciona platform-tools e emulator ao PATH ===
echo Adicionando platform-tools e emulator ao PATH...
setx PATH "%PATH%;%SDK_PATH%\platform-tools;%SDK_PATH%\emulator" /M

REM === Reinicia adb ===
echo Reiniciando ADB...
cd /d %SDK_PATH%\platform-tools
adb kill-server
adb start-server

echo.
echo ✅ Ambiente Android corrigido!
echo ➜ Feche e reabra o terminal.
pause
