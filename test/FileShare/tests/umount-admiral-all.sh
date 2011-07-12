#!/bin/bash

done=false

while [[ $done == false ]]
do
  /sbin/umount.cifs mountadmiral
  if [[ $? != 0 ]]; then
    done=true
  fi
done
    
  
  
