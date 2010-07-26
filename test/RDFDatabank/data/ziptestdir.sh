#! /bin/bash
#
# Create ZIP files of test directories
#

rm testdir.zip
rm testdir2.zip
rm testrdf.zip
zip -r testdir.zip testdir
zip -r testdir2.zip testdir2
zip -r testrdf.zip testrdf

