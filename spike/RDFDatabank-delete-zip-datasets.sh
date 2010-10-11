#!/bin/bash
#

RDBROOT=http://163.1.127.173/admiral-test

curl $RDBROOT/datasets -u admiral:admiral -H "Accept: text/plain" -o 000.tmp
DATASETS=`grep -o "zipfile:[0-9]*" 000.tmp`

for zipds in $DATASETS; do
   echo "Deleting $zipds"
   curl $RDBROOT/datasets/$zipds -X DELETE -u admiral:admiral -H "Accept: application/json"
   echo "Deleted $zipds"
done
