#!/bin/bash
#

# ldapsearch -xLLL -b cn=config -D cn=admin,cn=config -W $1
ldapsearch -xLLL -b dc=%{HOSTNAME},dc=zoo,dc=ox,dc=ac,dc=uk -D cn=admin,cn=config -W $1
#olcDatabase={1}hdb

# End.
