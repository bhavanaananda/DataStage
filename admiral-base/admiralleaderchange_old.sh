#!/bin/bash

# Using both -G and -g options to smbldap-usermod may seem like a belt and 
# braces approach, but I am unconvinced that either on their own does enough.

source /root/admiralconfig.d/admiralRGLeader.sh

if [[ 0 ]]; then
  echo "Current leader: $RGLeaderName"
  echo "Change from: $1"
  echo "Change to:   $2"
fi

if [[ "$1" == "" ]] || [[ "$2" == "" ]]; then
  echo "Usage: $0 oldleadername newleadername [-d]"
  echo "Use the -d option only if you wish to remove the old"
  echo "Research Group Leader completely and reassign their files to the"
  echo "new Research Group Leader!  Use without the -d option if old"
  echo "Research Group Leader still a member of the group."
  exit 1
elif [[ "$1" != "$RGLeaderName" ]]; then
  echo "This person ($1) is not the current Research Group Leader."
  echo "If you want to delete a Group Member please use the"
  echo "'admiraluserdel.sh' script instead."
  exit 1
elif [[ ! -e /root/admiralconfig.d/admiralresearchgroupmembers/$1.sh ]]; then
  echo "This person ($1) is not a defined Research Group member."
  echo "(The user configuration record is not consistent - please seek technical help)"
  exit 1
elif [[ ! -e /root/admiralconfig.d/admiralresearchgroupmembers/$2.sh ]]; then
  echo "This person ($2) is not a defined Research Group member."
  exit 1
else

  # Appoint new RGLeader
  smbldap-usermod -G RGLeader -g 600 $2
  chown -R $2:RGLeader /home/data/private/$2
  chown -R $2:RGLeader /home/data/shared/$2
  chown -R $2:RGLeader /home/data/collab/$2
  chown -R $2:RGLeader /mnt/data/home/$2
  
  cat >/root/admiralconfig.d/admiralRGLeader.sh <<EOF
#!/bin/bash

RGLeaderName=$2

EOF

  # Adjust status of old RG leader
  if [[ "$3" == "-d" ]]; then 
    # Old RGLeader leaving/no longer research-active/died
    /root/admiraluserdel.sh $1
  else
    # Old RGLeader doesn't want administrative hassle, but remains valid member of research group
    smbldap-usermod -G RGMember -g 601 $1
    chown -R $1:RGMember /home/data/private/$1
    chown -R $1:RGMember /home/data/shared/$1
    chown -R $1:RGMember /home/data/collab/$1
    chown -R $1:RGMember /mnt/data/home/$1
  fi

  # Regenerate the apache user access control files
  /root/createapacheuserconfig.sh all

fi
