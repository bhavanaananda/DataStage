#!/bin/bash
#
# Run from new VM console or SSH session

if [[ "$1" != "test" && ! -e /mnt/lv-admiral-data/data/ADMIRAL.README ]]; then
  echo "Allocate and mount data volume first (or use '$0 test')"
  echo "See http://imageweb.zoo.ox.ac.uk/wiki/index.php/ADMIRAL_LVM_allocation"
  exit
fi

if [[ "$1" == "test" ]]; then
  mkdir /mnt/lv-admiral-data
  mkdir /mnt/lv-admiral-data/home
  mkdir /mnt/lv-admiral-data/data
  ln -s /mnt/lv-admiral-data/data /home/data
fi

mkdir -p /root/admiralconfig.d
if [[ ! -e /root/admiralconfig.d/admiralconfig.sh ]]; then
    cp /root/admiralconfig.sh /root/admiralconfig.d/admiralconfig.sh
fi

echo ========================
echo "Installing ADMIRAL tools"
echo ========================

./admiraltoolsetup.sh

echo ===========================================
echo "Installing and configuring shared data area"
echo ===========================================

./admiraldatasetup.sh
/etc/init.d/apache2 restart

echo ===========================================
echo "Create user account for orphaned data files"
echo ===========================================

smbldap-useradd -a -P -m -s /bin/false -g RGOrphan admiral-orphan
smbldap-userinfo -f "Orphaned data" admiral-orphan

echo =================================
echo "Next step: configure system users"
echo =================================

mkdir -p /root/admiralconfig.d/admiralresearchgroupmembers

# End.
