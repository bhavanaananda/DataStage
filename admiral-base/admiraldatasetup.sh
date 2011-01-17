#!/bin/bash

source /root/admiralconfig.d/admiralconfig.sh

smbldap-groupadd -a -g $RGLeaderGID RGLeader
smbldap-groupadd -a -g $RGMemberGID RGMember
smbldap-groupadd -a -g $RGCollabGID RGCollaborator
smbldap-groupadd -a -g $RGOrphanGID RGOrphan

echo =========================
echo Allowing file access
echo =========================
smbldap-useradd -a -P -m -g $RGMemberGID test_admiral
chgrp "RGMember" /home/data
chown test_admiral: ADMIRAL.README

# Add ACLs to prevent unauthenticated access?

mkdir -p /home/data/private
chown www-data: /home/data/private
#chmod g+ws /home/data/private

mkdir -p /home/data/shared
chown www-data: /home/data/shared
#chmod g+ws /home/data/shared

mkdir -p /home/data/collab
chown www-data: /home/data/collab
#chmod g+ws /home/data/collab
