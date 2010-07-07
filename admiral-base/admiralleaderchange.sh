#!/bin/bash

# Using both -G and -g options to smbldap-usermod may seem like a belt and braces approach, but
# I am unconvinced that either on their own does enough.

if [[ "$1" == "" ]] || [[ "$2" == "" ]]; then
  echo "Usage: $0 oldleadername newleadername [-d]"
  echo "Use the -d option only if you wish to remove the old"
  echo "Research Group Leader completely and reassign their files to the"
  echo "new Research Group Leader!  Use without the -d option if old"
  echo "Research Group Leader still a member of the group."
  exit 1
elif [[ "$1" != "%{LeaderName}" ]]; then
  echo "This person is not the current Research Group Leader."
  echo "If you want to delete a Group Member please use the"
  echo "'admiraluserdel.sh' script instead."
  exit 1
else
  if [[ "$3" == "-d" ]]; then 
# Old RGLeader leaving/no longer research-active/died
    chown -R $2:RGLeader /home/data/$1
    chown -R $2:RGLeader /home/data/shared/$1
    chown -R $2:RGLeader /home/data/collab/$1
    chown -R $2:RGLeader /mnt/lv-admiral-data/home/$1
    smbldap-userdel -r $1
    rm -rf /home/$1-saved
    rm /etc/apache2/conf.d/user.$1
  else
# Old RGLeader doesn't want administrative hassle, but remains valid member of research group
    smbldap-usermod -G RGMember -g 601 $1
    chown -R $1:RGLeader /home/data/$1
    chown -R $1:RGMember /home/data/shared/$1
    chown -R $1:RGMember /home/data/collab/$1
    chown -R $1:RGMember /mnt/lv-admiral-data/home/$1
  fi
# Appoint new RGLeader
  smbldap-usermod -G RGLeader -g 600 $2
  chown -R $2:RGLeader /home/data/$2
  chown -R $2:RGLeader /home/data/shared/$2
  chown -R $2:RGLeader /home/data/collab/$2
  chown -R $2:RGLeader /mnt/lv-admiral-data/home/$2
# need a sed script here to go through /etc/apache2/conf.d/user.* replacing old leader with new leader
# here be dragons! this needs testing before using in anger, but no functional test system ATM!
  for i in /etc/apache2/conf.d/user.*; do mv $i $i.tmp; sed -e "s/$1/$2/" $i.tmp > $i; rm $i.tmp; done
fi
