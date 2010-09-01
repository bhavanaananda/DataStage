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

echo =========================
echo Adding base setup schemas
echo =========================
ldapadd -Y EXTERNAL -H ldapi:/// -f /etc/ldap/schema/cosine.ldif
ldapadd -Y EXTERNAL -H ldapi:/// -f /etc/ldap/schema/inetorgperson.ldif
ldapadd -Y EXTERNAL -H ldapi:/// -f /etc/ldap/schema/nis.ldif
ldapadd -Y EXTERNAL -H ldapi:/// -f db.ldif
ldapadd -Y EXTERNAL -H ldapi:/// -f migrated-base.ldif
ldapadd -Y EXTERNAL -H ldapi:/// -f base.ldif
ldapadd -Y EXTERNAL -H ldapi:/// -f config.ldif
# This final step requires re-entry of the password specified previously.
echo Adding access control, password needed
ldapmodify -x -D cn=admin,cn=config -W -f acl.ldif

echo =========================
echo Creating a CA, and making
echo self-signed certificates
echo Passwords/phrases required
echo =========================
./makeCA.sh
./makeCertKey.sh
./copyCert.sh
ldapmodify -x -D cn=admin,cn=config -W -f certs.ldif

echo =========================
echo Configuring Samba/LDAP
echo =========================
/etc/init.d/slapd restart
echo Adding Samba schema
ldapadd -x -D cn=admin,cn=config -W -f /root/cn\=samba.ldif
./ldapconfigmodify.sh samba_indexes.ldif

echo =========================
echo Configuring smbldap-tools
echo =========================
perl /usr/share/doc/smbldap-tools/configure.pl

slapcat -l backup.ldif
echo Populating database
smbldap-populate
echo Adding admin user
smbpasswd -w %{PASSWORD}
smbpasswd -s -a admiral <<END
%{PASSWORD}
%{PASSWORD}
END
/etc/init.d/samba restart
echo Adding test_admiral user
smbldap-useradd -a -P -m test_admiral
/etc/init.d/samba restart
echo ====================================
echo Need to delete and re-add first LDAP
echo user added, as UID detection fails
echo first time round
echo ====================================
smbldap-userdel -r test_admiral
echo User test_admiral deleted

echo =========================
echo Configuring PAM/LDAP
echo =========================
auth-client-config -t nss -p lac_ldap
pam-auth-update
echo =========================================
echo pam-auth-update puts the unix and LDAP 
echo lines in common-auth the wrong way round!
echo =========================================
cp common-auth /etc/pam.d/common-auth
cp etcldap.conf /etc/ldap.conf
echo "/etc/pam.d/common-auth and /etc/ldap.conf updated"

/etc/init.d/samba restart

