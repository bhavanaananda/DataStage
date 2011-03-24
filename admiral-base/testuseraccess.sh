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

if [[ "$2" =~ "[a-z0-9_/-]" ]]; then
    echo "testuseraccess.sh - invalid filename provided"
    exit 2
fi

#TODO: arrange to read filename(s) from sdtin, to allow full range of names
#sudo -u $1 /usr/local/sbin/testaccess.sh "$2"


sudo -u $1 -s test -w "$2"

