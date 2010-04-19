#!/bin/bash
#
# $Id: $
#
# Copy files from source directory to target directory, ignoring those listed as
# blacklisted, and replace the originals with a symlink to the copy.
#
# (This is to be used for moving working-copy files into a repository workspace,
# then running the working copy from the repository space.)
#
# Copyright (c) 2010 University of Oxford
# MIT Licensed - see LICENCE.txt or http://www.opensource.org/licenses/mit-license.php
#

if [[ "$1" != "test" && "$1" != "copy" ]]; then
    echo "Usage: $0 (test|copy) hostname password workgroup"
    exit 2
fi

if [[ "$2" == "" || "$3" == "" || "$4" == "" ]]; then
    echo "Usage: $0 (test|copy) hostname password workgroup"
    exit 2
fi

SRCDIR="."
TGTDIR="/var/kvm/$2"
BLACKLISTPATTERN="^(.*~|.*\\.(tmp|bak)|a1\.sh|copywithhostandpassword\.sh)$"
FILELIST="`ls -1 --directory --ignore-backups --file-type * ldapconfig/*`"
REPORT="echo"
REPORT=":"

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
        f2="${f##*/}"
        f1="${f%$f2}"
        # Fix relative base reference for one level of subdirectory
        fb="."
        if [[ "$f1" != "" ]]; then fb=".."; fi
        # Copy and link file now
        $REPORT "not blacklisted $f (dir:$f1, name:$f2, base:$fb)"
        if [ -d $TGTDIR/$f1 ]; then
            if [[ "$1" == "copy" ]]; then
                if [[ "$2" == "zakynthos" ]]; then
                    sed -e "s/%{HOSTNAME}/$2/g" -e "s/%{PASSWORD}/$3/g" -e "s/%{WORKGROUP}/$4/g" -e "s/%{IPADDR}/129.67.24.65/g" -e "s/%{LeaderName}/FritzVollrath/g" -e "s/%{MD5PASS}/vCxDg0JY2ieKRYCG0n417w==/g" < $f >$TGTDIR/$f
                elif [[ "$2" == "zoo-admiral-silk" ]]; then
                    sed -e "s/%{HOSTNAME}/$2/g" -e "s/%{PASSWORD}/$3/g" -e "s/%{WORKGROUP}/$4/g" -e "s/%{IPADDR}/129.67.24.16/g" -e "s/%{LeaderName}/FritzVollrath/g" -e "s/%{MD5PASS}/v\/v1K9IlY2poFPYJv\/kl6w==/g" < $f >$TGTDIR/$f
                fi
            else
                if [[ "$2" == "zakynthos" ]]; then
                    echo "sed -e 's/%{HOSTNAME}/$2/g' -e 's/%{PASSWORD}/$3/g' -e 's/%{WORKGROUP}/$4/g' -e 's/%{IPADDR}/129.67.24.65/g' -e 's/%{LeaderName}/FritzVollrath/g' -e 's/%{MD5PASS}/vCxDg0JY2ieKRYCG0n417w==/g' < $f >$TGTDIR/$f"
                elif [[ "$2" == "zoo-admiral-silk" ]]; then
                    echo "sed -e 's/%{HOSTNAME}/$2/g' -e 's/%{PASSWORD}/$3/g' -e 's/%{WORKGROUP}/$4/g' -e 's/%{IPADDR}/129.67.24.16/g' -e 's/%{LeaderName}/FritzVollrath/g' -e 's/%{MD5PASS}/v\/v1K9IlY2poFPYJv\/kl6w==/g' < $f >$TGTDIR/$f"
                fi
            fi
        else
            echo "Directory $TGTDIR/$f1 not found"
        fi
    fi
done

chmod +x $TGTDIR/*.sh
chmod +x $TGTDIR/ldapconfig/*.sh
