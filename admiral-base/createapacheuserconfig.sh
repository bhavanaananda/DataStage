#!/bin/bash

if [[ "$1" == "" ]]; then
    echo "Usage:"
    echo "  $0 username [orphan]" 
    echo "      Generate Apache access configuration for named user (or deleted user)" 
    echo ""
    echo "  $0 all"
    echo "      Generate Apache access configuration for all configured ADMIRAL users" 
    echo ""
    exit
fi

if [[ "$1" != "all" ]]; then
    if [[ ! -e /root/admiralconfig.d/admiralresearchgroupmembers/$1.sh ]]; then
        echo "No such user: $1"
        exit
    fi
fi
 
source /root/admiralconfig.d/admiralconfig.sh

function generateuserconfigfile()
{
    # $1 = users script name
    # $2 = "user" / "orphan"
 
    source $1
    echo $username $userfullname $userrole
    
    # Set up Apache access control configuration

  cat << EOF > /etc/apache2/conf.d/$2.$username
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
  chown root:root /etc/apache2/conf.d/$2.$username
  chmod 644 /etc/apache2/conf.d/$2.$username
}

# Process all user files in /root/admiralconfig.d/a/root/admiralresearchgroupmembers

if [[ "$1" == "all" ]]; then
    for u in `ls /root/admiralconfig.d/admiralresearchgroupmembers/*.sh`; do
        generateuserconfigfile $u user
    done
    for u in `ls /root/admiralconfig.d/admiralresearchgrouporphans/*.sh`; do
        generateuserconfigfile $u orphan
    done
else
    usertype=user
    userdir=admiralresearchgroupmembers
    if [[ "$2" == "orphan" ]]; then
        usertype=orphan
        userdir=admiralresearchgrouporphans
    fi
    generateuserconfigfile /root/admiralconfig.d/$userdir/$1.sh $usertype  
fi

echo ==================================================================
echo "Remember to restart Apache server to use the revised configuration"
echo ==================================================================
echo "# /etc/init.d/apache restart"
echo

# End.
  