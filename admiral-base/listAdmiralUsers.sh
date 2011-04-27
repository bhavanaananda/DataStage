#! /bin/bash
#
# List all ADMIRAL Users.
# This script is suid . Make sure that is cannot be modified by non-root users

# Check arguments to prevent injection attack

# $1 UserID
# $2 FolderPath

if [[ "$1" == "" ]]; then
    echo "listAdmiralUsers.sh - no username provided"
    exit 2
fi

if [[ "$1" =~ "[a-z0-9_]" ]]; then
    echo "listAdmiralUsers.sh - invalid username provided"
    exit 2
fi
if [[ "$2" == "" ]]; then
    echo "listAdmiralUsers.sh - no folder path provided"
    exit 2
fi

if [[ "$2" =~ "[a-z0-9_/-]" ]]; then
    echo "listAdmiralUsers.sh - invalid folder path provided"
    exit 2
fi


#sudo -u $1 ls -al "$2" | awk '$4 == "RGLeader" || $4 == "RGMember" || $4 == "RGCollaborator" {print $8}'
sudo -u $1 ls -al "$2" | awk '{print $8}'
# sudo -u $1 /usr/local/sbin/testaccess.sh "$2"
# ls -al  /mnt/lv-admiral-data/home | awk '$4 == "RGLeader" || $4 == "RGMember" || $4 == "RGCollaborator" {print $8}'


