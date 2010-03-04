virsh shutdown zakynthos
# rm /etc/libvirt/qemu/admiral.xml
# sudo /etc/init.d/libvirt-bin restart
if true; then
vmbuilder kvm ubuntu \
  --suite karmic \
  --flavour virtual \
  --arch amd64 \
  --overwrite \
  --ip 129.67.24.65 \
  --mask 255.255.252.0 \
  --gw 129.67.27.254 \
  --dns 129.67.1.1 \
  --bridge br0 \
  --part admiral.partitions \
  --user admiral \
  --pass zakynthos \
  --domain zoo.ox.ac.uk \
  --hostname zakynthos \
  --addpkg acpid \
  --addpkg unattended-upgrades \
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
  --copy config-files \
  --firstboot boot.sh \

#  --addpkg denyhosts \

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
if [ -e ubuntu-kvm/disk0.qcow2 ]
then
    cp ubuntu-kvm/disk0.qcow2 $time
    virsh start zakynthos
else
    echo Problem creating disk image
fi
