#!/bin/bash
#
# Set access rights on ADMIRAL data file areas
#

source /root/admiralconfig.d/admiralconfig.sh

chgrp "RGMember" /home/data
chown test_admiral: ADMIRAL.README

# Add ACLs to prevent unauthenticated access?

mkdir -p /home/data/private
chown www-data: /home/data/private
chmod --recursive g+s /home/data/private

mkdir -p /home/data/shared
chown www-data: /home/data/shared
chmod --recursive g+s /home/data/shared

mkdir -p /home/data/collab
chown www-data: /home/data/collab
chmod --recursive g+s /home/data/collab

mkdir -p /home/data/common
chown www-data: /home/data/common
chmod --recursive u=rwx,g=rws,o= /home/data/common/
chmod --recursive g+s /home/data/common

setfacl --recursive -m g:RGLeader:rwx /home/data/common
setfacl --recursive -m g:RGMember:rwx /home/data/common
setfacl --recursive -m u:www-data:rwx /home/data/common

getfacl --access /home/data/common | setfacl --recursive -d -M- /home/data/common

# End.
