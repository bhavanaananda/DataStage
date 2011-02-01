#!/bin/bash
#

RDBROOT=http://163.1.127.173/
curl $RDBROOT/silos/  -X GET -u admiral:admiral -H "Accept: application/json" -o tmpSilos.html
SILOS=`grep -o "zipfile:[0-9]*" tmpSilos.html`

for silo in $SILOS; do
   if $silo == 'admiral-test'
       echo "found"
   #curl $RDBROOT/datasets/$zipds -X DELETE -u admiral:admiral -H "Accept: application/json"

