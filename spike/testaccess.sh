#! /bin/bash
#
# Test user access to the supplied path.
#

if [[ -w $1 ]]; then 
     exit 0; 
else 
     exit 1; 
fi

