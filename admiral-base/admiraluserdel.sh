#!/bin/bash

source admiralconfig.sh

if [[ "$1" == "" ]]; then
  echo "Usage: $0 username"
  exit 1
elif [[ "$1" == "$RGLeaderName" ]]; then
  echo "Do not use this script to delete the Research Group Leader!"
  echo "Work out who is to be the new Research Group Leader user."
  echo "Then run the 'admiralleaderchange.sh' script."
  exit 1
else 
  chown -R $RGLeaderName:RGLeader /home/data/$1
  chown -R $RGLeaderName:RGLeader /home/data/shared/$1
  chown -R $RGLeaderName:RGLeader /home/data/collab/$1
  chown -R $RGLeaderName:RGLeader /mnt/lv-admiral-data/home/$1
  smbldap-userdel -r $1
  rm -rf /home/$1-saved
  rm /etc/apache2/conf.d/user.$1
  rm /root/admiralresearchgroupmembers/$1.sh
fi
