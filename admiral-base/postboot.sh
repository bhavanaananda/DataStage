if [[ "$1" != "test" && ! -e /mnt/lv-admiral-data/data/ADMIRAL.README ]]; then
  echo "Allocate and mount data volume first (or use '$0 test')"
  echo "See http://imageweb.zoo.ox.ac.uk/wiki/index.php/ADMIRAL_LVM_allocation"
  exit
fi

echo =============================
echo Install new packages
echo =============================
apt-get update
apt-get install -qy --force-yes openssh-server libpam-krb5 nagios3 nagios-nrpe-plugin nagios-nrpe-server tsm-client libpam-ldap

echo =============================
echo Configure new packages
echo =============================
cp /root/ssh_config /etc/ssh/ssh_config
cp /root/sshd_config /etc/ssh/sshd_config
cp /root/common-password /etc/pam.d/common-password
cp /root/nrpe.cfg /etc/nagios/nrpe.cfg
/etc/init.d/nagios-nrpe-server restart
cp /root/aliases /etc/aliases
cp /root/main.cf /etc/postfix/main.cf
cp /root/apache2.conf /etc/apache2/apache2.conf
mkdir /var/www/docs
cp /root/*.html /var/www/docs
newaliases

echo =============================
echo Configure and enable firewall
echo =============================
ufw allow ssh
ufw allow http
ufw allow https
ufw allow samba
ufw enable

echo ===============================
echo Installing and configuring LDAP
echo ===============================
./ldapsetup.sh

echo ===========================================
echo Installing and configuring shared data area
echo ===========================================
./admiraldatasetup.sh
/etc/init.d/apache2 restart
