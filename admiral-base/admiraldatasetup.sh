#!/bin/bash

source /root/admiralconfig.d/admiralconfig.sh

smbldap-groupadd -a -g $RGLeaderGID RGLeader
smbldap-groupadd -a -g $RGMemberGID RGMember
smbldap-groupadd -a -g $RGCollabGID RGCollaborator
smbldap-groupadd -a -g $RGOrphanGID RGOrphan

smbldap-useradd -a -P -m -g $RGMemberGID test_admiral

echo =========================
echo Allowing file access
echo =========================

source /root/admiraldataaccess.sh

# End.
