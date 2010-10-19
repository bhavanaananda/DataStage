#!/bin/bash
#
# $Id: $
#
# Copy files from source directory to target directory, ignoring those listed as
# blacklisted, and replace the originals with a symlink to the copy.
#
# This is used to creayte a test  working copy of an ADMIRAL system, with
# supplied host name, password and group leader names interpolated into key 
# configuration files (???)
#
# Copyright (c) 2010 University of Oxford
# MIT Licensed - see LICENCE.txt or http://www.opensource.org/licenses/mit-license.php
#

USAGE="$0 (test|copy) hostname password"

if [[ "$1" != "test" && "$1" != "copy" ]]; then
    echo "Usage: $USAGE"
    exit 2
fi

if [[ "$2" == "" || "$3" == "" ]]; then
    echo "Usage: $USAGE"
    exit 2
fi

# Host-specific parameters
COPYTEST=$1
HOSTNAME=$2
PASSWORD=$3
source $HOSTNAME/hostconfig.sh

# Common configuration code
SRCDIR="."
TGTDIR="/var/kvm/$HOSTNAME"
BLACKLISTPATTERN="^(.*~|.*\\.(tmp|bak)|a1\.sh|copywithhostandpassword\.sh)$"
FILELIST="`ls -1 --directory --ignore-backups --file-type * ldapconfig/* www/* www/*/* $HOSTNAME/* $HOSTNAME/*/* $HOSTNAME/*/*/*`"
REPORT="echo"
REPORT=":"
MD5PASSWD=`slappasswd -h {MD5} -s $PASSWORD`
IP=`host $HOSTNAME | cut -d ' ' -f4`

#if [[ "$COPYTEST" == "copy" ]]; then
    mkdir -p $TGTDIR
    mkdir -p $TGTDIR/ldapconfig
    mkdir -p $TGTDIR/www
    mkdir -p $TGTDIR/www/docs
#fi

for f in $FILELIST; do
    if [[ "$f" =~ /$ ]]; then
        $REPORT ".directory $f"
    elif [[ "$f" =~ @$ ]]; then
        $REPORT ".symlink $f"
    elif [[ "$f" =~ =$ ]]; then
        $REPORT ".socket $f"
    elif [[ "$f" =~ \|$ ]]; then
        $REPORT ".pipe (ipc) $f"
    elif [[ "$f" =~ \>$ ]]; then
        $REPORT ".door (ipc) $f"
    elif [[ $f =~ $BLACKLISTPATTERN ]]; then
        $REPORT ".blacklisted $f"
    else
        # See: http://tldp.org/LDP/abs/html/parameter-substitution.html
        # f2: filename with all leading directory names stripped out
        f2="${f##*/}"
        # f1: keep just the directory names - strip out the final filename
        f1="${f%$f2}"
        # f3: copy of file directory with leading host name directory removed
        f3="${f1#$HOSTNAME/}"
        # Fix relative base reference for one level of subdirectory
        # Copy and link file now
        $REPORT "not blacklisted $f (dir:$f1, name:$f2, target:$f3)"
        if [ -d $TGTDIR/$f3 ]; then
            if [[ "$COPYTEST" == "copy" ]]; then
                    sed -e "s/%{HOSTNAME}/$HOSTNAME/g" -e "s/%{PASSWORD}/$PASSWORD/g" -e "s/%{WORKGROUP}/$WORKGROUP/g" -e "s/%{IPADDR}/$IP/g" -e "s/%{LeaderName}/$LEADERNAME/g" -e "s/%{MD5PASS}/$MD5PASSWD/g" < $f >$TGTDIR/$f3$f2
            else
                    echo "sed -e 's/%{HOSTNAME}/$HOSTNAME/g' -e 's/%{PASSWORD}/$PASSWORD/g' -e 's/%{WORKGROUP}/$WORKGROUP/g' -e 's/%{IPADDR}/$IP/g' -e 's/%{LeaderName}/$LEADERNAME/g' -e 's/%{MD5PASS}/$MD5PASSWD/g' < $f >$TGTDIR/$f3$f2"
            fi
        else
            echo "Directory $TGTDIR/$f3 not found"
        fi
    fi
done

if [[ "$COPYTEST" == "copy" ]]; then
    chmod +x $TGTDIR/*.sh
    chmod +x $TGTDIR/ldapconfig/*.sh
fi

# End.

