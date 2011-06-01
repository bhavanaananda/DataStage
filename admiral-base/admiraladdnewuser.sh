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

if [[ "$1" == "" || "$2" == "" || "$3" == "" ]]; then
    echo "Usage: $0 RemoteUserID UserID [FullName] [Role] [Room Number] [Work phone] [Password]"
    exit 1
fi

if [[ "$RemoteUserID" == "" ]]; then
    echo "admiraladdnewuser.sh - no RemoteUserID provided"
    exit 2
fi

if [[ "$RemoteUserID" =~ "[a-z0-9_]" ]]; then
    echo "admiraladdnewuser.sh - You do not have permissions to add a new Admiral User."
    exit 2
fi

if [[ "$UserID" == "" ]]; then
    echo "admiraladdnewuser.sh - No UserID was provided to add a new Admiral User."
    exit 2
fi

if [[ "$UserID" =~ "[a-z0-9_/-]" ]]; then
    echo "admiraladdnewuser.sh - Invalid UserID provided to add a new Admiral User."
    exit 2
fi

source /root/admiraluseradd.sh

#admiraluseradd.sh username fullname role [room number] [work phone] [password]
if [[ "$Password" != "" ]]; then
    sudo -u $RemoteUserID  /root/admiraluseradd.sh $UserID "$FullName" "$Role" "$RoomNumber" "$WorkPhone" "$Password"
else
   echo "ADMIRAL SERVER ERROR: Enter a valid password to create the user! " 
fi



