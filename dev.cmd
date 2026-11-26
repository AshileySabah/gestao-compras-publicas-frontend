@echo off
setlocal
cd /d "%~dp0"
set BACK=%~dp0..\gestao-compras-publicas-backend
set FRONT=%~dp0

if /i "%~1"=="-BD" goto bd
if /i "%~1"=="-BZ" goto bz
if /i "%~1"=="-F" goto f
if /i "%~1"=="-FB" goto fb
echo Uso: .\dev.cmd -BD ^| -BZ ^| -F ^| -FB
exit /b 1

:bd
cd /d "%BACK%"
call "%BACK%\mvnw.cmd" spring-boot:run
exit /b

:bz
cd /d "%BACK%"
call "%BACK%\mvnw.cmd" spring-boot:run "-Dspring-boot.run.arguments=--spring.jpa.hibernate.ddl-auto=create"
exit /b

:f
cd /d "%FRONT%"
if not exist node_modules call npm install || exit /b 1
call npm run dev
exit /b

:fb
cd /d "%FRONT%"
if not exist node_modules call npm install || exit /b 1
call npm run build:backend || exit /b 1
cd /d "%BACK%"
call "%BACK%\mvnw.cmd" spring-boot:run
exit /b
