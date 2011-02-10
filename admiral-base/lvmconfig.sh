#!/bin/bash
#
# Commands to create a data volume on the disk partition at /dev/sdb1,
# copy files from the /home/data directory, and symlink /home/data to the
# new data location
#
# This is the default case for a new system build when using a single 
# separate disk volume for ADMIRAL data

pvcreate /dev/sdb1
vgcreate vg-admiral-data /dev/sdb1
lvcreate --name lv-admiral-data --extents 100%FREE vg-admiral-data
mkfs.ext3 /dev/vg-admiral-data/lv-admiral-data
mkdir /mnt/lv-admiral-data
mount /dev/vg-admiral-data/lv-admiral-data /mnt/lv-admiral-data
if [[ -L /mnt/data ]]; then
    # /mnt/data is symlink
    rm /mnt/data
elif [[ -e /mnt/data ]]; then
    # /mnt/data is directory
    mv /mnt/data /mnt/data-saved
fi
ln -s /mnt/lv-admiral-data-ext/ /mnt/data
cd /home
cp -axv data/ /mnt/data/
mv data data-saved
ln -s /mnt/data/data/ data
mkdir /mnt/data/home 

# End.
