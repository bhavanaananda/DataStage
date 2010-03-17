apt-get update
apt-get install -qy --force-yes openssh-server libpam-krb5 nagios3 nagios-nrpe-plugin nagios-nrpe-server tsm-client
cp /root/ssh_config /etc/ssh/ssh_config
cp /root/sshd_config /etc/ssh/sshd_config
cp /root/common-password /etc/pam.d/common-password
cp /root/nrpe.cfg /etc/nagios/nrpe.cfg
/etc/init.d/nagios-nrpe-server restart
cp /root/aliases /etc/aliases
cp /root/main.cf /etc/postfix/main.cf
newaliases

echo ===============================
echo Installing and configuring LDAP
echo ===============================
./ldapsetup.sh
