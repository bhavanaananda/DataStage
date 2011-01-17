#!/bin/bash

source /root/admiralconfig.d/admiralconfig.sh

if [[ "$1" == "" || "$2" == "" || "$3" == "" ]]; then
  echo "Usage: $0 username fullname role [room number] [work phone] [password]"
  exit 1
fi

if [[ -e "/home/$1" || -e "/mnt/lv-admiral-data/home/$1" ]]; then
  echo "User $1 already exists (or home directory exists)"
  exit 1
fi

if [[ -e "/root/admiralconfig.d/admiralresearchgroupmembers/$1.sh" ]]; then
  echo "User $1 configuration record already exists"
  exit 1
fi

# --------
# Create a record of the new user details in 
# /root/admiralconfig.d/admiralresearchgroupmembers

cat > /root/admiralconfig.d/admiralresearchgroupmembers/$1.sh <<EOF
username="$1"
userfullname="$2"
userrole="$3"
EOF

# --------
# Setup for research group members

if [[ "$3" != "RGCollaborator" ]]; then

  # Create new user account

  if [[ "$6" == "" ]]; then
    smbldap-useradd -a -P -m -g $3 $1
  else
    smbldap-useradd -a -P -m -g $3 $1 <<END
$6
$6
END
  fi
  smbldap-userinfo -f "$2" -r $4 -w $5 $1
  #smbldap-usermod -G $3 $1

  cp -ax /home/$1 /mnt/lv-admiral-data/home/
  mv /home/$1 /home/$1-saved
  ln -s /mnt/lv-admiral-data/home/$1 /home/$1

  # Create directory areas for the new user

  mkdir -p /home/data/private/$1
  mkdir -p /home/data/shared/$1
  mkdir -p /home/data/collab/$1

  # Set default file system access modes (overridden by access control lists)

  chown $1:$3 /home/data/private/$1
  chown $1:$3 /home/data/shared/$1
  chown $1:$3 /home/data/collab/$1
  chmod 700 /home/data/private/$1
  chmod 700 /home/data/shared/$1
  chmod 700 /home/data/collab/$1
  chmod g-s /home/data/private/$1
  chmod g-s /home/data/shared/$1
  chmod g-s /home/data/collab/$1

  # Set access control lists on new user directories

  # User access
  setfacl -m u:$1:rwx /home/data/private/$1
  setfacl -m u:$1:rwx /home/data/shared/$1  
  setfacl -m u:$1:rwx /home/data/collab/$1

  # Research group leader access
  setfacl -m g:RGLeader:rx /home/data/private/$1
  setfacl -m g:RGLeader:rx /home/data/shared/$1
  setfacl -m g:RGLeader:rx /home/data/collab/$1

  # Research group member access
  setfacl -m g:RGMember:rx /home/data/shared/$1
  setfacl -m g:RGMember:rx /home/data/collab/$1

  # Research group collaborator access
  setfacl -m g:RGCollaborator:rx /home/data/collab/$1

  # Web server access
  setfacl -m u:www-data:rwx /home/data/private/$1
  setfacl -m u:www-data:rwx /home/data/shared/$1
  setfacl -m u:www-data:rwx /home/data/collab/$1

  # Copy access modes to default access modes
  getfacl --access /home/data/private/$1 | setfacl -d -M- /home/data/private/$1
  getfacl --access /home/data/shared/$1  | setfacl -d -M- /home/data/shared/$1
  getfacl --access /home/data/collab/$1  | setfacl -d -M- /home/data/collab/$1

  cp /root/ADMIRAL.README /home/data/private/$1
  chown $1:RGMember /home/data/private/$1/ADMIRAL.README

  # Set up Apache access control configuration
  /root/createapacheuserconfig.sh $1

fi

# --------
# Setup for collaborator account

if [[ "$3" == "RGCollaborator" ]]; then

  if [[ "$6" == "" ]]; then
    smbldap-useradd -a -P -m -s /bin/false -g $3 $1
  else
    smbldap-useradd -a -P -m -s /bin/false -g $3 $1 <<END
$6
$6
END
  fi

  smbldap-userinfo -f "$2" -r $4 -w $5 $1

fi

# End.
