# This script will run the first time the virtual machine boots
# It is run as root.

echo "*****FIRST BOOT*****"
apt-get update
apt-get install -qy --force-yes openssh-server libpam-krb5
cp /root/ssh_config /etc/ssh/ssh_config
cp /root/sshd_config /etc/ssh/sshd_config
cp /root/common-password /etc/pam.d/common-password

mkdir /var/files
chmod u+rw,g+rws /var/files

smbpasswd -s -a admiral <<END
zakynthos
zakynthos
END

a2enmod webauth
a2enmod ssl
a2ensite default-ssl
ln -s /var/lib/webauth /etc/apache2/webauth

cp /root/webauth.keytab /etc/apache2/webauth/keytab
chgrp www-data /etc/apache2/webauth/keytab
chmod u=rw,g=r,o= /etc/apache2/webauth/keytab

cp /root/krb5.keytab /etc/krb5.keytab
chmod u=rw,go= /etc/krb5.keytab

mkdir /var/www/files
chown www-data /var/www/files

chmod +x /root/make-apache2-cert.sh
/root/make-apache2-cert.sh zakynthos.zoo.ox.ac.uk
cp /root/default-ssl /etc/apache2/sites-available/default-ssl

a2enmod dav
a2enmod dav_fs
a2enmod auth_kerb
mkdir /usr/share/apache2/var
touch /usr/share/apache2/var/DAVlock
chown -R www-data:www-data /usr/share/apache2/var
mkdir -p /var/www/webdav-files
chown www-data:root /var/www/webdav-files
mv /etc/apache2/sites-available/default /etc/apache2/sites-available/default_orig
cp /root/default /etc/apache2/sites-available/default

cp /root/webdav.keytab /etc/apache2/webdav.keytab
chown root:www-data /etc/apache2/webdav.keytab
chmod 640 /etc/apache2/webdav.keytab

/etc/init.d/apache2 restart
