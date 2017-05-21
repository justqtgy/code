@echo off

cd %cd%
call pm2 kill
start pm2 start bin\www

exit