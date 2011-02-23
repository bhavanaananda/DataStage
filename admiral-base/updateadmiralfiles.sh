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
migrate apache-databank-proxy      /etc/apache2/sites-available/databank-proxy

rm /root/admiralleaderchange.sh

### migrate webauth.conf               /etc/apache2/webauth
### migrate webauth.keytab             /etc/apache2/webauth
### migrate webdav.keytab              /etc/apache2

# Leaving ldapconfig files for now

# Copy web site files

mkdir -p /var/www/docs
mkdir -p /var/www/images
mkdir -p /var/www/css/images
mkdir -p /var/www/js

migrate www/index.html /var/www/index.html

migrate www/docs/accesswebdav.html /var/www/docs/accesswebdav.html
migrate www/docs/adminusers.html /var/www/docs/adminusers.html
migrate www/docs/fileorganization.html /var/www/docs/fileorganization.html
migrate www/docs/accesshttp.html /var/www/docs/accesshttp.html
migrate www/docs/accessmacos.html /var/www/docs/accessmacos.html
migrate www/docs/accesswindows.html /var/www/docs/accesswindows.html
migrate www/docs/accesslinux.html /var/www/docs/accesslinux.html
migrate www/docs/accessdirect.html /var/www/docs/accessdirect.html

migrate www/images/ADMIRALogo96x96.png /var/www/images/ADMIRALogo96x96.png

migrate www/css/jquery.treeview.css /var/www/css/jquery.treeview.css

migrate www/css/images/treeview-famfamfam.gif /var/www/css/images/treeview-famfamfam.gif
migrate www/css/images/treeview-red.gif /var/www/css/images/treeview-red.gif
migrate www/css/images/treeview-gray-line.gif /var/www/css/images/treeview-gray-line.gif
migrate www/css/images/treeview-default-line.gif /var/www/css/images/treeview-default-line.gif
migrate www/css/images/treeview-famfamfam-line.gif /var/www/css/images/treeview-famfamfam-line.gif
migrate www/css/images/treeview-default.gif /var/www/css/images/treeview-default.gif
migrate www/css/images/plus.gif /var/www/css/images/plus.gif
migrate www/css/images/treeview-black.gif /var/www/css/images/treeview-black.gif
migrate www/css/images/folder-closed.gif /var/www/css/images/folder-closed.gif
migrate www/css/images/file.gif /var/www/css/images/file.gif
migrate www/css/images/treeview-gray.gif /var/www/css/images/treeview-gray.gif
migrate www/css/images/treeview-red-line.gif /var/www/css/images/treeview-red-line.gif
migrate www/css/images/treeview-black-line.gif /var/www/css/images/treeview-black-line.gif
migrate www/css/images/minus.gif /var/www/css/images/minus.gif
migrate www/css/images/folder.gif /var/www/css/images/folder.gif

migrate www/js/jquery-1.4.2.min.js /var/www/js/jquery-1.4.2.min.js
migrate www/js/jquery.treeview.min.js /var/www/js/jquery.treeview.min.js

# End.
