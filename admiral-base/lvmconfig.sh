#!/bin/bash

pvcreate /dev/sdb1
vgcreate vg-admiral-data /dev/sdb1
lvcreate --name lv-admiral-data --extents 100%FREE vg-admiral-data
mkfs.ext3 /dev/vg-admiral-data/lv-admiral-data
mkdir /mnt/lv-admiral-data
mount /dev/vg-admiral-data/lv-admiral-data /mnt/lv-admiral-data/
cd /home
cp -axv data/ /mnt/lv-admiral-data/
mv data data-saved
ln -s /mnt/lv-admiral-data/data/ data

