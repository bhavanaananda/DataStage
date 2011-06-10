#!/bin/bash
function generateuserrecord()
{
    # $1 - username 
    # $2 - fullname
    # $3 - rolename or group
    # $4 - room number
    # $5 - phone number
    cat > /root/admiralconfig.d/admiralresearchgroupmembers/$1.sh <<EOF
username="$1"
userfullname="$2"
userrole="$3"
userroom="$4"
userphone="$5"
EOF
}

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
  
    chmod --recursive u=rwx,g=,o= /home/data/private/$datadir
    chmod --recursive u=rwx,g=,o= /home/data/shared/$datadir
    chmod --recursive u=rwx,g=,o= /home/data/collab/$datadir

    #ls -ald /home/data/private/$datadir
    #ls -ald /home/data/shared/$datadir
    #ls -ald /home/data/collab/$datadir
  
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
    setfacl --recursive -m g:RGLeader:rwx /home/data/collab/$datadir
  
    # Research group member access
    setfacl --recursive -m g:RGMember:rx /home/data/shared/$datadir
    setfacl --recursive -m g:RGMember:rwx /home/data/collab/$datadir
  
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
    # $2 = new user password
    source $1
    password=$2
    echo $username \"$userfullname\" $userrole \"$userroom\" \"$userphone\" $password

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

    # For non-collaborators, create user directories and set permissions
    if [[ "$userrole" != "RGCollaborator" ]]; then
        # Create ADMIRAL working directory areas for the new user
        # if they don't already exist
        mkdir -p /home/data/private/$username
        mkdir -p /home/data/shared/$username
        mkdir -p /home/data/collab/$username
      
        # Set user data area owner and ACLs
        setdataownerandaccess $username $username $userrole
      
        # Set up Apache access control configuration
        /root/createapacheuserconfig.sh $username    
    fi
}

function generatesystemuserhomedir()
{  
    # $1 - username

    # if no home directory on target data volume, copy home directory there
    if [[ ! -e /mnt/data/home/$1 ]]; then
        echo "Copy directory tree /home/$1 to /mnt/data/home/"
        cp -ax /home/$1 /mnt/data/home/
    fi

    # if home directory exists and is not a symlink, rename as saved copy and create link
    if [[ -e /home/$1 ]]; then
        if [[ ! -h /home/$1 ]]; then    # if not symlink
            echo "Save and symlink directory /home/$1 to /mnt/data/home/$1"
            mv /home/$1 /home/$1-saved
            ln -s /mnt/data/home/$1 /home/$1
        fi
    fi
}

# End.
