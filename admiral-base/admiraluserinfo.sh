#! /bin/bash
#
# Get user details for the requested ADMIRAL User.
# This script is suid . Make sure that is cannot be modified by non-root users

# Check arguments to prevent injection attack

# $1 RemoteUserID requesting the UserID details
# $2 UserID for whose details are being requested

RemoteUserID=$1 
UserID=$2

if [[ "$RemoteUserID" == "" ]]; then
    echo "admiraluserinfo.sh - no RemoteUserID provided"
    exit 2
fi

if [[ "$RemoteUserID" =~ "[a-z0-9_]" ]]; then
    echo "admiraluserinfo.sh - You do not have permissions to view the user details."
    exit 2
fi
if [[ "$UserID" == "" ]]; then
    echo "admiraluserinfo.sh - No UserID was provided to extract the user details"
    exit 2
fi

if [[ "$UserID" =~ "[a-z0-9_/-]" ]]; then
    echo "admiraluserinfo.sh - Invalid UserID provided to extract the user details"
    exit 2
fi

if [[smbldap-groupshow RGLeader | grep "memberUid" | awk -F":" '{ print $2 }' == $RemoteUserID]]; then
    $RemoteUserID = "root"
fi
    
sudo -u $RemoteUserID smbldap-userinfo -l  $UserID | grep "Full Name" | awk '{print "FullName:" $3 " " $4}'
sudo -u $RemoteUserID ls -l /home/data/private | grep $UserID | awk '{print "UserRole:" $4}'
sudo -u $RemoteUserID smbldap-userinfo -l  $UserID | grep "Room Number"| awk '{print "RoomNumber:" $3}'
sudo -u $RemoteUserID smbldap-userinfo -l  $UserID| grep "Work Phone"| awk '{print "WorkPhone:" $3}'


#ldap groupid
# SMBLDAP-TOOLS -f Bhavana | grep "Full name" | awk -F":" '{ print $2 }'SMBLDAP-TOOLS -f Bhavana | grep "Full name" | awk -F":" '{ print $2 }'
# sudo -u $1 ls -al "$2" | awk '$4 == "RGLeader" || $4 == "RGMember" || $4 == "RGCollaborator" {print $8}'
# sudo -u $1 ls -l "$2" | awk '{print $8}'
# sudo -u $1 /usr/local/sbin/testaccess.sh "$2"
# ls -al  /mnt/lv-admiral-data/home | awk '$4 == "RGLeader" || $4 == "RGMember" || $4 == "RGCollaborator" {print $8}'
# ls -l /home/data/private | awk '{if ($8=="BhavanaAnanda")print $4}'


