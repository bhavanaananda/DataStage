#!/bin/bash
#
# Apply modifications to LDAP from ldif file
#

if [ -z $1 ]; then
    echo "Usage: $0 <distinguished-name>"
    exit
fi

ldapdelete -x -D cn=admin,dc=%{HOSTNAME},dc=zoo,dc=ox,dc=ac,dc=uk -W $1

# End.
