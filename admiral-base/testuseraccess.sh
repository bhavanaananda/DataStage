#! /bin/bash
#
# Test user access to the supplied path.
# This script is suid . Make sure that is cannot be modified by non-root users

# Check arguments to prevent injection attack

# $1 UserID
# $2 FilePath

if [[ "$1" == "" ]]; then
    echo "testuseraccess.sh - no username provided"
    exit 2
fi

if [[ "$1" =~ "[a-z0-9_]" ]]; then
    echo "testuseraccess.sh - invalid username provided"
    exit 2
fi

if [[ "$2" == "" ]]; then
    echo "testuseraccess.sh - no filename provided"
    exit 2
fi


sudo -u $1 /usr/local/sbin/testwriteaccess.sh "$2"


