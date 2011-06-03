#! /bin/bash
#
# Add a new ADMIRAL User.
# This script is suid . Make sure that is cannot be modified by non-root users

# Check arguments to prevent injection attack

# $1 RemoteUserID Remote user who is trying to add the UserID details
# $2 UserID Admiral user whose details are being created
# $3 FullName  FullName of the Admiral User with ID=UserID
# $4 Role  Role of the Admiral User with ID=UserID
# $5 RoomNumber  Room Number of the Admiral User with ID=UserID
# $6 WorkPhone  Work Phone Number of the Admiral User with ID=UserID
# $7 Password  Password for the Admiral User with ID=UserID

RemoteUserID=$1 
UserID=$2
FullName=$3
Role=$4
RoomNumber=$5
WorkPhone=$6
Password=$7

if [[ "$UserID" == "" || "$Password" == ""]]; then
    echo "ADMIRAL SERVER ERROR: Enter a valid User ID/Password"
    exit 1
fi

if [[ "$RemoteUserID" == "" ]]; then
    echo "ADMIRAL SERVER ERROR:  No RemoteUserID provided"
    exit 2
fi

if [[ "$RemoteUserID" =~ "[a-z0-9_]" ]]; then
    echo "ADMIRAL SERVER ERROR: You do not have permissions to add a new Admiral User."
    exit 2
fi

if [[ "$UserID" =~ "[a-z0-9_/-]" ]]; then
    echo "ADMIRAL SERVER ERROR: Invalid UserID provided to add a new Admiral User."
    exit 2
fi


# Only the root has permissions to execute admiraluseradd.sh
# Check if the  $RemoteUserID is RGLeader. If $RemoteUserID is RGLeader, then execute script as root
leaderList=$(smbldap-groupshow RGLeader | grep "memberUid" | awk -F":" '{ print $2 }' | tr "," "\n")

for leader in $leaderList
do
    if [[ $leader == $RemoteUserID ]]; then
        RemoteUserID="root"
    fi
done

# Check if the  $UserID already exists.
userList=$(smbldap-groupshow RGLeader | grep "memberUid" | awk -F":" '{ print $2 }' | tr "," "\n")

for leader in $leaderList
do
    if [[ $leader == $RemoteUserID ]]; then
        RemoteUserID="root"
    fi
done

#admiraluseradd.sh username fullname role [room number] [work phone] [password]

if [[ $RemoteUserID == "root" ]]; then
    if [[ "$Password" != "" ]]; then
        sudo -u $RemoteUserID  /root/admiraluseradd.sh $UserID "$FullName" "$Role" "$RoomNumber" "$WorkPhone" "$Password"
    else
        echo "ADMIRAL SERVER ERROR: Enter a valid password to create the user! " 
    fi
else
    echo "ADMIRAL SERVER ERROR: You do not have permissions to create a new user! "
fi 
