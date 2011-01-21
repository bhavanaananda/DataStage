#!/bin/bash

if [[ "$1" == "" ]]; then
    echo "Usage:"
    echo "  $0 username"
    echo "      Generate system configuration for named user" 
    echo ""
    echo "  $0 all password"
    echo "      Generate system configuration for all recorded ADMIRAL users" 
    echo "      Each user gets a password of the form 'username-password',"
    echo "      which they should change on first login." 
    echo ""
    exit
fi

if [[ "$1" == "all"]]; then
    if [[ "$2" == "" ]]; then
        echo "Provide password suffix when regenerating all user accounts"
    fi
else
    if [[ ! -e /root/admiralconfig.d/admiralresearchgroupmembers/$1.sh ]]; then
        echo "No such user recorded: $1"
        exit
    fi
fi
 
source /root/admiralconfig.d/admiralconfig.sh

function setdataownerandaccess()
{
    # $1 is name of user data directories
    # $2 is the data owner name
    # $3 is the data owner role name (group)

    datadir=$1
    username=$2
    userrole=$3

    # Set default file system access modes (overridden by access control lists)
  
    chown --recursive $username:$userrole /home/data/private/$datadir
    chown --recursive $username:$userrole /home/data/shared/$datadir
    chown --recursive $username:$userrole /home/data/collab/$datadir
  
    # Set access control lists on new user directories
  
    # remove previous ACLs
    setfacl --recursive --remove-all /home/data/private/$datadir
    setfacl --recursive --remove-all /home/data/shared/$datadir
    setfacl --recursive --remove-all /home/data/collab/$datadir
  
    # User access
    setfacl --recursive -m u:$username:rwx /home/data/private/$datadir
    setfacl --recursive -m u:$username:rwx /home/data/shared/$datadir
    setfacl --recursive -m u:$username:rwx /home/data/collab/$datadir
  
    # Research group leader access
    setfacl --recursive -m g:RGLeader:rx /home/data/private/$datadir
    setfacl --recursive -m g:RGLeader:rx /home/data/shared/$datadir
    setfacl --recursive -m g:RGLeader:rx /home/data/collab/$datadir
  
    # Research group member access
    setfacl --recursive -m g:RGMember:rx /home/data/shared/$datadir
    setfacl --recursive -m g:RGMember:rx /home/data/collab/$datadir
  
    # Research group collaborator access
    setfacl --recursive -m g:RGCollaborator:rx /home/data/collab/$datadir
  
    # Web server access
    setfacl --recursive -m u:www-data:rwx /home/data/private/$datadir
    setfacl --recursive -m u:www-data:rwx /home/data/shared/$datadir
    setfacl --recursive -m u:www-data:rwx /home/data/collab/$datadir
  
    # Copy access modes to default access modes
    # (@@Do these propagate down to subdirectories without the --recursive option?)
    getfacl --access /home/data/private/$datadir | setfacl --recursive -d -M- /home/data/private/$datadir
    getfacl --access /home/data/shared/$datadir  | setfacl --recursive -d -M- /home/data/shared/$datadir
    getfacl --access /home/data/collab/$datadir  | setfacl --recursive -d -M- /home/data/collab/$datadir
    
}

function generatesystemuser()
{
    # $1 = users script name 
    # $2 = new user password suffix
    source $1
    password=$username-$2
    echo $username $userfullname $userrole $userroom $userphone $password

    if [[ "$userrole" != "RGCollaborator" ]]; then
    
      # Create new user account
    
      if [[ "$password" == "" ]]; then
        smbldap-useradd -a -P -m -g $userrole $username
      else
        smbldap-useradd -a -P -m -g $userrole $username <<END
$password
$password
END
      fi
      smbldap-userinfo -f "$userfullname" -r "$userroom" -w "$userphone" $username
    
      mv /home/$username /home/$username-saved
      ln -s /mnt/lv-admiral-data/home/$username /home/$username
    
      # Set user data area owner and ACLs
      setdataownerandaccess $username $username $userrole
    
      # Set up Apache access control configuration
      /root/createapacheuserconfig.sh $username
    
    fi
    
    if [[ "$userrole" == "RGCollaborator" ]]; then
    
      if [[ "$password" == "" ]]; then
        smbldap-useradd -a -P -m -s /bin/false -g $userrole $username
      else
        smbldap-useradd -a -P -m -s /bin/false -g $userrole $username <<END
$password
$password
END
      fi
    
      smbldap-userinfo -f "$userfullname" -r "$userroom" -w "$userphone" $username
    
    fi
}

# Process all user files in /root/admiralconfig.d/a/root/admiralresearchgroupmembers

if [[ "$1" == "all" ]]; then
    for u in `ls /root/admiralconfig.d/admiralresearchgroupmembers/*.sh`; do
        generatesystemuser $u $2
    done
    for u in `ls /root/admiralconfig.d/admiralresearchgrouporphans/*.sh`; do
        setdataownerandaccess $u admiral-orphan RGOrphan
    done
elif [[ -e "/root/admiralconfig.d/admiralresearchgroupmembers/$1.sh" ]]; then
    generatesystemuser /root/admiralconfig.d/admiralresearchgroupmembers/$1.sh    
else
    echo "No such user ($1)"
fi

# End.
