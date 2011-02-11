#!/bin/bash

if [[ "$1" == "" ]]; then
    echo "Usage:"
    echo "  $0 username"
    echo "      Generate system configuration for named user" 
    echo ""
    echo "  $0 all password"
    echo "      Generate system configuration for all recorded ADMIRAL users" 
    echo "      Each user gets a password of the form 'username-password',"
    echo "      which they should change on first login." 
    echo ""
    echo "  $0 fileaccess"
    echo "      Scan all files for configured ADMIRAL users and set file " 
    echo "      ownership and permissions."
    echo ""
    exit
fi

if [[ "$1" == "all" ]]; then
    if [[ "$2" == "" ]]; then
        echo "Provide password suffix when regenerating all user accounts"
        exit
    fi
elif [[ "$1" == "fileaccess" ]]; then
    echo "Updating data volume file ownership and access"
else
    if [[ ! -e /root/admiralconfig.d/admiralresearchgroupmembers/$1.sh ]]; then
        echo "No such user recorded: $1"
        exit
    fi
fi
 
source /root/admiralconfig.d/admiralconfig.sh

source /root/admiralusermanagement.sh

# Process all user files in /root/admiralconfig.d/a/root/admiralresearchgroupmembers

if [[ "$1" == "all" ]]; then
    for u in `ls /root/admiralconfig.d/admiralresearchgroupmembers/*.sh`; do
        #@@TODO: save password hash with user record; use this to reinstate?
        #        (problem: may make user susceptible to dictionary attack, etc.)
        source $u
        echo "Migrate user $username..."
        password=$username-$2
        generatesystemuser $u $password
        generatesystemuserhomedir $username
        echo "Migrate user $username done."
    done

    for u in `ls /root/admiralconfig.d/admiralresearchgrouporphans/*.sh`; do
        source $u
        echo "Orphan user $username..."
        setdataownerandaccess $username admiral-orphan RGOrphan
        echo "Orphan user $username done."
    done
    
elif [[ "$1" == "fileaccess" ]]; then
    for u in `ls /root/admiralconfig.d/admiralresearchgroupmembers/*.sh`; do       
        source $u
        if [[ "$userrole" == "RGMember" || "$userrole" == "RGLeader" ]]; then
            echo "Set file access for user $username as $userrole ..."
            setdataownerandaccess $username $username $userrole
        fi
    done

    for u in `ls /root/admiralconfig.d/admiralresearchgrouporphans/*.sh`; do
        source $u
        echo "Set file access for orphan $username..."
        setdataownerandaccess $username admiral-orphan RGOrphan
    done

elif [[ -e "/root/admiralconfig.d/admiralresearchgroupmembers/$1.sh" ]]; then
    echo "Migrate designated user $1"
    generatesystemuser /root/admiralconfig.d/admiralresearchgroupmembers/$1.sh    
    generatesystemuserhomedir $1
    echo "Migrate user $1 done."

else
    echo "No such user ($1)"
fi

# End.
