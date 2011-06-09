#! /bin/bash
#
# Update the user details for the ADMIRAL User.
# This script is suid . Make sure that is cannot be modified by non-root users

# Check arguments to prevent injection attack

# $1 RemoteUserID trying to update the UserID details
# $2 UserID for whose details are being updated
# $3 FullName Updated FullName of the Admiral User with ID=UserID
# $4 Role Updated Role of the Admiral User with ID=UserID
# $5 RoomNumber Updated Room Number of the Admiral User with ID=UserID
# $6 WorkPhone Updated Work Phone Number of the Admiral User with ID=UserID
# $7 Password Updated Password for the Admiral User with ID=UserID

RemoteUserID=$1 
UserID=$2
FullName=$3
Role=$4
RoomNumber=$5
WorkPhone=$6
Password=$7

if [[ "$1" == "" || "$2" == "" || "$3" == "" ]]; then
  echo "Usage: $0 RemoteUserID UserID [FullName] [Role] [Room Number] [Work phone] [Password]"
  exit 1
fi

if [[ "$RemoteUserID" == "" ]]; then
    echo "admiralupdateuserinfo.sh - no RemoteUserID provided"
    exit 2
fi

if [[ "$RemoteUserID" =~ "[a-z0-9_]" ]]; then
    echo "admiralupdateuserinfo.sh - You do not have permissions to update the user details."
    exit 2
fi

if [[ "$UserID" == "" ]]; then
    echo "admiralupdateuserinfo.sh - No UserID was provided to update the user details"
    exit 2
fi

if [[ "$UserID" =~ "[a-z0-9_/-]" ]]; then
    echo "admiralupdateuserinfo.sh - Invalid UserID provided to update the user details"
    exit 2
fi

# Only the root has permissions to execute smbldap-userinfo
# Check if the  $RemoteUserID is RGLeader. If $RemoteUserID is RGLeader, then execute smbldap-userinfo as root
leaderList=$(smbldap-groupshow RGLeader | grep "memberUid" | awk -F":" '{ print $2 }' | tr "," "\n")

for leader in $leaderList
do
    if [[ $leader == $RemoteUserID ]]; then
        RemoteUserID="root"
    fi
done

# Check if the $UserID is a valid ADMIRAL user, else output the error message
outputMessage=$(smbldap-userinfo -l  $UserID | grep "/usr/sbin/smbldap-userinfo")

if [[ $outputMessage == "" ]]; then
    sudo -u $RemoteUserID smbldap-userinfo -f "$FullName" -r "$RoomNumber" -w  "$WorkPhone" $UserID
    if [[ "$Password" != "" ]]; then
      sudo -u $RemoteUserID smbldap-passwd $UserID <<END
$Password
$Password
END
    fi
    
    GidNumber=$(sudo -u $RemoteUserID smbldap-groupshow RGLeader| grep "gidNumber:"|awk -F":" '{ print $2 }')
    smbldap-usermod -G $Role -g $GidNumber $UserID
    source /root/admiralusermanagement.sh
    # Set user data area owner and ACLs
    setdataownerandaccess $UserID $UserID $Role
      
    # Set up Apache access control configuration
    /root/createapacheuserconfig.sh $UserID    
    sudo -u $RemoteUserID apache2ctl graceful
else
    error=$(sudo -u $RemoteUserID smbldap-userinfo -l  $UserID | awk  '{for(i=2; i<=NF; i++) print $i}')
    newline='\\n'
    space=" "
    error=$(echo ${error//$newline/$space})
    echo "ADMIRAL SERVER ERROR: "  $error
fi


