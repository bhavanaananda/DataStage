#!/bin/bash

source /root/admiralconfig.d/admiralconfig.sh

if [[ "$1" == "" ]]; then
  echo "Usage: $0 username [purge]"
  exit 1
elif [[ "$1" == "$RGLeaderName" ]]; then
  echo "Do not use this script to delete the Research Group Leader!"
  echo "Work out who is to be the new Research Group Leader user."
  echo "Then run the 'admiralleaderchange.sh' script."
  exit 1
else 

  if [[ "$2" == "purge" ]]; then

    rm -rf "/home/data/private/$1"
    rm -rf "/home/data/shared/$1"
    rm -rf "/home/data/collab/$1"
    rm -rf "/mnt/lv-admiral-data/home/$1"
    rm -rf "/home/$1"
    rm -rf "/home/$1-saved"
    rm -rf "/home/$1-deleted"

  else

    chown -R admiral-orphan:RGOrphan /home/data/private/$1
    chown -R admiral-orphan:RGOrphan /home/data/shared/$1
    chown -R admiral-orphan:RGOrphan /home/data/collab/$1
    chown -R admiral-orphan:RGOrphan /mnt/lv-admiral-data/home/$1
    if [[ -L "/home/$1" ]]; then
      rm "/home/$1"
    elif [[ -e "/home/$1" ]]; then
      mv "/home/$1" "/home/$1-deleted"
    fi
    if [[ -e "/home/$1-saved" ]]; then
      mv /home/$1-saved /home/$1
    fi

  fi

  smbldap-userdel -r $1
  rm /etc/apache2/conf.d/user.$1
  rm /root/admiralconfig.d/admiralresearchgroupmembers/$1.sh

fi

# End.
