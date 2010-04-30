#!/bin/bash

if [[ "$1" == "" ]]; then
  echo "Usage: $0 username"
  exit 1
fi

smbldap-userdel -r $1
rm -rf /home/data/$1
rm -rf /home/data/shared/$1
rm -rf /home/data/collab/$1
rm -rf /home/$1-saved
rm -rf /mnt/lv-admiral-data/home/$1
