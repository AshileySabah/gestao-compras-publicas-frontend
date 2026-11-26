@echo off
setlocal
cd /d "%~dp0"
set BACK=%~dp0..\gestao-compras-publicas-backend
set FRONT=%~dp0
set ZERAR="-Dspring-boot.run.arguments=--spring.jpa.hibernate.ddl-auto=create"

if /i "%~1"=="-BD" goto bd
if /i "%~1"=="-BZ" goto bz
if /i "%~1"=="-F" goto f
if /i "%~1"=="-FBD" goto fbd
if /i "%~1"=="-FBZ" goto fbz
echo Uso: .\dev.cmd -BD ^| -BZ ^| -F ^| -FBD ^| -FBZ
exit /b 1

:bd
cd /d "%BACK%"
call "%BACK%\mvnw.cmd" spring-boot:run
exit /b

:bz
cd /d "%BACK%"
call "%BACK%\mvnw.cmd" spring-boot:run %ZERAR%
exit /b

:f
cd /d "%FRONT%"
if not exist node_modules call npm install || exit /b 1
call npm run dev -- --open
exit /b

:fbd
call :gerarfront || exit /b 1
call :abrirquandosubir
goto bd

:fbz
call :gerarfront || exit /b 1
call :abrirquandosubir
goto bz

:gerarfront
cd /d "%FRONT%"
if not exist node_modules call npm install || exit /b 1
call npm run build:backend || exit /b 1
exit /b

:abrirquandosubir
set PORTA=8080
for /f "tokens=2 delims==" %%a in ('findstr /b "SERVER_PORT=" "%BACK%\.env" 2^>nul') do set PORTA=%%a
start "" /b powershell -NoProfile -Command "$u='http://localhost:%PORTA%'; for ($i=0; $i -lt 150; $i++) { try { Invoke-WebRequest $u -UseBasicParsing | Out-Null; Start-Process $u; break } catch { Start-Sleep 2 } }"
exit /b
