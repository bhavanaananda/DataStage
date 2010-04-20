#!/bin/bash
# Assume that slapd and ldap-utils have been installed.
# Assume that db.ldif has been created.
# Assume that base.ldif has been created with the appropriate root password hash
# (use slappasswd -h {MD5} to create/display the hash).
# Assume that config.ldif has been created, again with the appropriate root password hash.
# Assume that acl.ldif has been created.
# See http://imageweb.zoo.ox.ac.uk/wiki/index.php/Zakynthos_Configuration#LDAP-based_authorization for further details.
# Use dpkg-reconfigure slapd to re-initialise an empty LDAP database.

if [ "$1" == "purge" ]; then
    /etc/init.d/slapd stop
    apt-get purge slapd
    rm /var/lib/ldap/*
    apt-get install slapd
fi

ldapadd -Y EXTERNAL -H ldapi:/// -f /etc/ldap/schema/cosine.ldif
ldapadd -Y EXTERNAL -H ldapi:/// -f /etc/ldap/schema/inetorgperson.ldif
ldapadd -Y EXTERNAL -H ldapi:/// -f /etc/ldap/schema/nis.ldif
ldapadd -Y EXTERNAL -H ldapi:/// -f db.ldif
ldapadd -Y EXTERNAL -H ldapi:/// -f migrated-base.ldif
ldapadd -Y EXTERNAL -H ldapi:/// -f base.ldif
ldapadd -Y EXTERNAL -H ldapi:/// -f config.ldif
# This final step requires re-entry of the password specified previously.
ldapmodify -x -D cn=admin,cn=config -W -f acl.ldif

