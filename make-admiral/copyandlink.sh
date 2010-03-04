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

SRCDIR="."
TGTDIR="./hg/admiral-jiscmrd/make-admiral"
BLACKLISTPATTERN="^(.*~|.*\\.(tmp|bak)|SAVED)$"
FILELIST=`ls -1 --directory --ignore-backups --file-type * ldapconfig/*`

for f in $FILELIST; do
    if [[ "$f" =~ /$ ]]; then
        echo ".directory $f"
    elif [[ "$f" =~ @$ ]]; then
        echo ".symlink $f"
    elif [[ "$f" =~ =$ ]]; then
        echo ".socket $f"
    elif [[ "$f" =~ \|$ ]]; then
        echo ".pipe (ipc) $f"
    elif [[ "$f" =~ \>$ ]]; then
        echo ".door (ipc) $f"
    elif [[ $f =~ $BLACKLISTPATTERN ]]; then
        echo ".blacklisted $f"
    else
        #f2="${f##*/}"
        #f1="${f%$f2}"
        #echo "not blacklisted $f ($f1---$f2)"
        echo "not blacklisted $f"
        #echo ">> mv -f $f $TGTDIR/$f"
        #echo ">> ln --symbolic $TGTDIR/$f $f"
        mv -f $f $TGTDIR/$f
        ln --symbolic $TGTDIR/$f $f
    fi
done
