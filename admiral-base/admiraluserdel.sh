#!/bin/bash

source /root/admiralconfig.d/admiralconfig.sh

if [[ "$1" == "" ]]; then
  echo "Usage: $0 username [purge]"
  exit 1
else 

  if [[ "$2" == "purge" ]]; then

    rm -rf "/home/data/private/$1"
    rm -rf "/home/data/shared/$1"
    rm -rf "/home/data/collab/$1"
    rm -rf "/mnt/data/home/$1"
    rm -rf "/home/$1"
    rm -rf "/home/$1-saved"
    rm -rf "/home/$1-deleted"
    
    rm -f /etc/apache2/conf.d/user.$1
    rm -f /root/admiralconfig.d/admiralresearchgroupmembers/$1.sh
    rm -f /etc/apache2/conf.d/orphan.$1
    rm -f /root/admiralconfig.d/admiralresearchgrouporphans/$1.sh
    
  else

    chown -R admiral-orphan:RGOrphan /home/data/private/$1
    chown -R admiral-orphan:RGOrphan /home/data/shared/$1
    chown -R admiral-orphan:RGOrphan /home/data/collab/$1
    chown -R admiral-orphan:RGOrphan /mnt/data/home/$1
    # (-L tests for symlink ...)
    if [[ -L "/home/$1" ]]; then
      rm "/home/$1"
    elif [[ -e "/home/$1" ]]; then
      mv "/home/$1" "/home/$1-deleted"
    fi
    if [[ -e "/home/$1-saved" ]]; then
      mv /home/$1-saved /home/$1
    fi
  
    mv /etc/apache2/conf.d/user.$1 /etc/apache2/conf.d/orphan.$1
    mkdir -p /root/admiralconfig.d/admiralresearchgrouporphans
    mv /root/admiralconfig.d/admiralresearchgroupmembers/$1.sh /root/admiralconfig.d/admiralresearchgrouporphans/
  fi
   
  smbldap-userdel -r $1
 
fi

# End.
