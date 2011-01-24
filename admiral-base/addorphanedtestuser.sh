#!/bin/bash

# Create testUserD and files
/root/admiraluseradd.sh TestUserD "Deleted User" RGMember 4444 4444 userd
echo "Deleted User Private File" > /home/data/private/TestUserD/testDeletedUserFile.tmp
echo "Deleted User Shared File" > /home/data/shared/TestUserD/testDeletedUserFile.tmp
echo "Deleted User Collab File" > /home/data/collab/TestUserD/testDeletedUserFile.tmp

# Delete TestUserD, orphaning the files
/root/admiraluserdel.sh TestUserD

# End.
