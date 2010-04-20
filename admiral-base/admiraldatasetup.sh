#!/bin/bash

source admiralconfig.sh


smbldap-groupadd -a -g $RGLeaderGID RGLeader
smbldap-groupadd -a -g $RGMemberGID RGMember
smbldap-groupadd -a -g $RGCollabGID RGCollaborator

echo =========================
echo Allowing file access
echo =========================
smbldap-useradd -a -P -m -g $RGMemberGID test_admiral
chgrp "RGMember" /home/data
chown test_admiral: ADMIRAL.README

# Add ACLs to prevent unauthenticated access?
mkdir /home/data/shared
chown www-data: /home/data/shared
#chmod g+ws /home/data/shared

mkdir /home/data/collab
chown www-data: /home/data/collab
#chmod g+ws /home/data/collab
