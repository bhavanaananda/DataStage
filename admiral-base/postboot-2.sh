#!/bin/bash
#
# Run from new VM console or SSH session

echo =============================
echo "Install new packages"
echo =============================

apt-get update
apt-get install -qy --force-yes libpam-krb5 nagios3 nagios-nrpe-plugin nagios-nrpe-server tsm-client
apt-get install -qy --force-yes lvm2 mercurial python-setuptools
easy_install rdflib

echo =============================
echo "Configure new packages"
echo =============================

cp /root/common-password /etc/pam.d/common-password
cp /root/nrpe.cfg /etc/nagios/nrpe.cfg
/etc/init.d/nagios-nrpe-server restart
cp /root/aliases /etc/aliases
newaliases
cp /root/main.cf /etc/postfix/main.cf
cp /root/apache2.conf /etc/apache2/apache2.conf
mkdir /var/www/docs
cp -ax /root/www/* /var/www/docs

echo =============================
echo "Configure and enable firewall"
echo =============================

ufw allow ssh
ufw allow http
ufw allow https
ufw allow samba
ufw enable

echo =============================
echo "Next step: postboot-3.sh"
echo =============================
