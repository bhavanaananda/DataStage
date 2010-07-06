#!/bin/bash
#
# Bulk rename images
#

for f in 2008*; do
	echo "mv $f test-${f##*-}"
	mv $f test-${f##*-}
done