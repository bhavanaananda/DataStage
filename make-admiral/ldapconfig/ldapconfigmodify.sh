#!/bin/bash
#
# Apply modifications to LDAP from ldif file
#

if [ -z $1 ]; then
    echo "Usage: $0 <ldif-file>"
    exit
fi

ldapmodify -x -D cn=admin,cn=config -W -f $1

# End.
