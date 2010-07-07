#!/bin/bash
#
# Run script in background with log file
#
# $1 = script name (.sh) and log file name (.log)
#

echo "Usage: ./nohup.sh <scriptname> (.sh and .log appended)"
echo "Process id is $$"
echo "Logfile is $1-$$.log"

if [ "$1" == "" ]; then
    echo "A script/log file name must be supplied"
    exit 1
fi

# Append pid to log file name, to prevent clashes when multiple copies are run together
nohup `pwd`/$1.sh 1>$1-$$.log 2>&1 &
tail -f $1-$$.log

# End
