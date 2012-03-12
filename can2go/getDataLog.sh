#! /usr/bin/ksh

HOST=192.168.0.111
USER=uiucsd
PASSWD=uiuc$d2011

exec 4>&1
ftp -nv >&4 2>&4 |&

print -p open $HOST
print -p user "uiucsd" 'uiuc$d2011'
print -p cd /logging/data
print -p get bcpm_1.csv
print -p bye

wait
exit 0
