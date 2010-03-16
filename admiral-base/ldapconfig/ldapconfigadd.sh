#!/bin/bash
#
# Apply modifications to LDAP from ldif file
#

if [ -z $1 ]; then
    echo "Usage: $0 <ldif-file>"
    exit
fi

ldapadd -x -D cn=admin,dc=%{HOSTNAME},dc=zoo,dc=ox,dc=ac,dc=uk -W -f $1
#cn=admin,cn=config 

# End.
