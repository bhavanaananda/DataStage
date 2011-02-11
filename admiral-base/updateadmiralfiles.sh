#!/bin/bash
#
# /root/updateadmiralfiles.sh
#
# Update ADMIRAL configuration files on system.
#

USAGE="Usage: $0 RUN"
if [[ "$1" == "" ]]; then
    echo "$USAGE"
    echo ""
    echo "Before running this, run makeresearchgroupfiles.sh to create a" 
    echo "customized copy of the installation build files"
    exit 1
fi

# Functions
function migrate()
{
    # $1 = filename in admiral-base directory
    # $2 = target directory or file in system
    cp="cp -f $SRCDIR/$1 $2"
    echo "$cp"
    $cp
}

# 1. get system parameters

source /root/admiralconfig.d/admiralconfig.sh
SRCDIR="/mnt/data/tool/$ADMIRALHOSTNAME"

# 3. Copy new config files to their correct locations

migrate addorphanedtestuser.sh     /root
migrate addtestusers.sh            /root
migrate admiraldatasetup.sh        /root
migrate admiralleaderchange.sh     /root
migrate admiralmigrateusers.sh     /root
migrate admiraltoolsetup.sh        /root
migrate admiraluseradd.sh          /root
migrate admiraluserdel.sh          /root
migrate admiraluserlist.sh         /root
migrate admiralusermanagement.sh   /root
migrate createapacheuserconfig.sh  /root
migrate deltestusers.sh            /root
migrate lvmconfig.sh               /root
migrate postboot-1.sh              /root
migrate postboot-2.sh              /root
migrate postboot-3.sh              /root
migrate postboot-4.sh              /root

migrate etcldap.conf               /etc
migrate krb5.conf                  /etc
migrate krb5.keytab                /etc
migrate ntp.conf                   /etc
migrate sources.list               /etc/apt
migrate nrpe.cfg                   /etc/nagios
migrate common-auth                /etc/pam.d
migrate common-password            /etc/pam.d
migrate main.cf                    /etc/postfix
migrate smb.conf                   /etc/samba
migrate openssl.cnf                /etc/ssl
migrate ssh_config                 /etc/ssh
migrate sshd_config                /etc/ssh

migrate apache2.conf               /etc/apache2
migrate apache-default             /etc/apache2/sites-available/default
migrate apache-default-ssl         /etc/apache2/sites-available/default-ssl
### migrate webauth.conf               /etc/apache2/webauth
### migrate webauth.keytab             /etc/apache2/webauth
### migrate webdav.keytab              /etc/apache2

# Leaving ldapconfig files for now
# Leaving web site files for now

# End.
