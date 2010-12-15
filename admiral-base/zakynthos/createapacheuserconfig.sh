#!/bin/bash

source admiralconfig.sh

function generateuserconfigfile()
{
    # $1 = users script name
 
    source $1
    echo $username $userfullname $userrole
    
    # Set up Apache access control configuration

  cat << EOF > /etc/apache2/conf.d/user.$username
<Location /data/private/$username>
    Order Deny,Allow
    Allow from all
    <LimitExcept REPORT GET OPTIONS PROPFIND>
      Require user $username
    </LimitExcept>
    <Limit PROPFIND OPTIONS GET REPORT>
      # NOTE:
      # Tried to use a combination of "Require user" and "Require ldap-attribute"
      # here, but this caused access failures for all users.
      # TestLeader is included here for testing only.
      #Ê@@TODO: fix to use RG leader group id (to follow leader)
      Require user $username $RGLeaderName
    </Limit>
</Location>

<Location /data/shared/$username>
    Order Deny,Allow
    Allow from all
    <LimitExcept REPORT GET OPTIONS PROPFIND>
      Require user $username
    </LimitExcept>
    <Limit PROPFIND OPTIONS GET REPORT>
      Require ldap-attribute gidNumber=$RGLeaderGID
      Require ldap-attribute gidNumber=$RGMemberGID
    </Limit>
</Location>

<Location /data/collab/$username>
    Order Deny,Allow
    Allow from all
    <LimitExcept REPORT GET OPTIONS PROPFIND>
      Require user $username
    </LimitExcept>
    <Limit PROPFIND OPTIONS GET REPORT>
      Require ldap-attribute gidNumber=$RGLeaderGID
      Require ldap-attribute gidNumber=$RGMemberGID
      Require ldap-attribute gidNumber=$RGCollabGID
    </Limit>
</Location>

EOF
  chown root:root /etc/apache2/conf.d/user.$username
  chmod 644 /etc/apache2/conf.d/user.$username
}

# Process all user files in /root/admiralresearchgroupmembers

for u in `ls /root/admiralresearchgroupmembers/*.sh`; do
    generateuserconfigfile $u
done
