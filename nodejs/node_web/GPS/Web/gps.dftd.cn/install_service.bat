@echo off

Set BasePath=D:\Node_Web\

%BasePath%\nssm\win64\nssm install node_website "%BasePath%\www\gps.dftd.cn\pm2_run_website.bat"

pause