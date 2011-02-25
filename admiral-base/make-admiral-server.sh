# rm /etc/libvirt/qemu/admiral.xml
# sudo /etc/init.d/libvirt-bin restart
HOSTNAME=%{HOSTNAME}
DOMAINNAME=%{ADMIRALDOMAINNAME}
IPADDR=%{IPADDR}
PASSWD=%{PASSWORD}
if true; then
vmbuilder vmserver ubuntu \
  --suite karmic \
  --flavour virtual \
  --arch amd64 \
  --overwrite \
  --ip $IPADDR \
  --mask 255.255.252.0 \
  --gw 129.67.27.254 \
  --dns 129.67.1.1 \
  --bridge br0 \
  --part admiral.partitions \
  --user admiral \
  --pass $PASSWD \
  --domain $DOMAINNAME \
  --hostname $HOSTNAME \
  --addpkg acpid \
  --addpkg unattended-upgrades \
  --addpkg denyhosts \
  --addpkg ufw \
  --addpkg apache2 \
  --addpkg samba \
  --addpkg samba-doc \
  --addpkg krb5-user \
  --addpkg ntp \
  --addpkg libapache2-webauth \
  --addpkg libapache2-mod-auth-kerb \
  --addpkg cadaver \
  --addpkg nano \
  --addpkg slapd \
  --addpkg ldap-utils \
  --addpkg smbldap-tools \
  --addpkg manpages \
  --addpkg man-db \
  --addpkg locate \
  --addpkg kernel-package \
  --addpkg linux-headers-2.6.31-20-server \
  --addpkg lvm2 \
  --addpkg acl \
  --copy config-files \
  --firstboot firstboot.sh \


# When using this, remove old XML files in /etc/libvirt/qemu and restart libvirt-bin service
# before running this script
#  --libvirt qemu:///system \

#  --addpkg libpam-krb5 \
#  --firstlogin login.sh \  # BUG: generated firstlogin script issues sudo command, requires password entry
#
fi
# mkdir -p VMBuilder/plugins/libvirt/templates
# cp /etc/vmbuilder/libvirt/* VMBuilder/plugins/libvirt/templates/
time=`date +%Y%m%dT%H%M`
mkdir $time
if [ -e ubuntu-vmserver/disk0.vmdk ]
then
    cp ubuntu-vmserver/disk0.vmdk $time
else
    echo Problem creating disk image
fi
if [ -e ubuntu-vmserver/$HOSTNAME.vmx ]
then
    cp ubuntu-vmserver/$HOSTNAME.vmx $time
else
    echo Problem creating VMX file
fi
