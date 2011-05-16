#! /bin/bash
#
# List all ADMIRAL Users.
# This script is suid . Make sure that is cannot be modified by non-root users

# Check arguments to prevent injection attack

# $1 RemoteUserID requesting the list of ADMIRAL users

if [[ "$1" == "" ]]; then
    echo "listAdmiralUsers.sh - no remote username provided"
    exit 2
fi

if [[ "$1" =~ "[a-z0-9_]" ]]; then
    echo "listAdmiralUsers.sh - invalid remote username"
    exit 2
fi

smbldap-groupshow RGLeader | grep "memberUid" | awk -F":" '{ print $2 }'
smbldap-groupshow RGMember | grep "memberUid" | awk -F":" '{ print $2 }'
smbldap-groupshow RGCollaborator | grep "memberUid" | awk -F":" '{ print $2 }'


# sudo -u $1 ls -l "$2" | awk '{print $8}'
# sudo -u $1 /usr/local/sbin/testaccess.sh "$2"
# ls -al  /mnt/lv-admiral-data/home | awk '$4 == "RGLeader" || $4 == "RGMember" || $4 == "RGCollaborator" {print $8}'
# sudo -u $1 ls -al "$2" | awk '$4 == "RGLeader" || $4 == "RGMember" || $4 == "RGCollaborator" {print $8}'

