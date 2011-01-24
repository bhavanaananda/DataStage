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
    exit
fi

if [[ "$1" == "all"]]; then
    if [[ "$2" == "" ]]; then
        echo "Provide password suffix when regenerating all user accounts"
    fi
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
        password=$username-$2
        generatesystemuser $u $password
        generatesystemuserhomedir $u
    done
    for u in `ls /root/admiralconfig.d/admiralresearchgrouporphans/*.sh`; do
        setdataownerandaccess $u admiral-orphan RGOrphan
    done
elif [[ -e "/root/admiralconfig.d/admiralresearchgroupmembers/$1.sh" ]]; then
    generatesystemuser /root/admiralconfig.d/admiralresearchgroupmembers/$1.sh    
else
    echo "No such user ($1)"
fi

# End.
