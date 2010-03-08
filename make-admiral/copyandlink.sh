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
    echo "Usage: $0 (test|copy)"
    exit 2
fi

SRCDIR="."
TGTDIR="hg/admiral-jiscmrd/make-admiral"
BLACKLISTPATTERN="^(.*~|.*\\.(tmp|bak)|SAVED)$"
FILELIST=`ls -1 --directory --ignore-backups --file-type * ldapconfig/*`
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
                mv -f $f $TGTDIR/$f
                ln --symbolic $fb/$TGTDIR/$f $f
            else
                echo ">> mv -f $f $TGTDIR/$f"
                echo ">> ln --symbolic $fb/$TGTDIR/$f $f"
            fi
        else
            echo "Directory $TGTDIR/$f1 not found"
        fi
    fi
done
