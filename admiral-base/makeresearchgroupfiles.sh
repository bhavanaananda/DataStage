#!/bin/bash
#
# $Id: $
#
# Copy files from source directory to target directory, ignoring those listed as
# blacklisted, and replace the originals with a symlink to the copy.
#
# This is used to create a test  working copy of an ADMIRAL system, with
# supplied host name, password and interpolated into key 
# configuration files (???)
#
# Copyright (c) 2010 University of Oxford
# MIT Licensed - see LICENCE.txt or http://www.opensource.org/licenses/mit-license.php
#

USAGE="$0 (test|copy) hostname password [targetdir]"

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
TGTROOTS="/var/kvm /mnt/data/tool"
for TR in $TGTROOTS; do
    if [[ -e $TR ]]; then
        TGTDIR="$TR/$HOSTNAME"
    fi
done
if [[ "$4" != "" ]]; then
    TGTDIR="$4"
fi
if [[ "$TGTDIR" == "" ]]; then
    echo "No target directory could be determined (/mnt/data/tool or /var/kvm not found, none specified)"
    echo "(Has the /mnt/data symlink been created?)"
    exit 1
fi

echo "TGTDIR: $TGTDIR"
mkdir -p $TGTDIR

BLACKLISTPATTERN="^(.*~|.*\\.(tmp|bak)|a1\.sh|copywithhostandpassword\.sh)$"
FILELIST="`ls -1 --directory --ignore-backups --file-type * ldapconfig/* www/* www/*/* $HOSTNAME/* $HOSTNAME/*/*`"
REPORT="echo"
REPORT=":"
MD5PASSWD=`slappasswd -h {MD5} -s $PASSWORD`

if [[ "$IPADDR" == "" ]]; then
    IP=`host $HOSTNAME | cut -d ' ' -f4`
else
    IP=$IPADDR
fi

echo "Substitutions:"
echo "  s/%{RESEARCHGROUPNAME}/$RESEARCHGROUPNAME/g"
echo "  s/%{HOSTNAME}/$HOSTNAME/g"
echo "  s/%{PASSWORD}/$PASSWORD/g"
echo "  s/%{WORKGROUP}/$WORKGROUP/g"
echo "  s/%{IPADDR}/$IP/g"
echo "  s!%{MD5PASS}!$MD5PASSWD!g"
echo "  s/%{DATABANKHOST}/$DATABANKHOST/g"
echo "  s/%{DATABANKSILO}/$DATABANKSILO/g"
echo ""

#if [[ "$COPYTEST" == "copy" ]]; then
    mkdir -p $TGTDIR
    mkdir -p $TGTDIR/ldapconfig
    mkdir -p $TGTDIR/www
    mkdir -p $TGTDIR/www/docs
    mkdir -p $TGTDIR/www/images
    mkdir -p $TGTDIR/www/css
    mkdir -p $TGTDIR/www/css/images
    mkdir -p $TGTDIR/www/js
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
                    sed -e "s/%{RESEARCHGROUPNAME}/$RESEARCHGROUPNAME/g" \
                        -e "s/%{HOSTNAME}/$HOSTNAME/g" \
                        -e "s/%{PASSWORD}/$PASSWORD/g" \
                        -e "s/%{WORKGROUP}/$WORKGROUP/g" \
                        -e "s/%{IPADDR}/$IP/g" \
                        -e "s!%{MD5PASS}!$MD5PASSWD!g" \
                        -e "s/%{DATABANKHOST}/$DATABANKHOST/g" \
                        -e "s/%{DATABANKSILO}/$DATABANKSILO/g" \
                        <$f >$TGTDIR/$f3$f2
            else
                    echo "sed ... <$f >$TGTDIR/$f3$f2"
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

