#!/bin/bash
#
# Sample script for creating test users
# (see test/FileShare/tests/TestConfig.py)

admiraluseradd TestUser1  "Test user 1"       RGMember       room1 111111 user1
admiraluseradd TestUser2  "Test user 2"       RGMember       room2 222222 user2
admiraluseradd TestLeader "Test group leader" RGLeader       room3 333333 leader
admiraluseradd TestCollab "Test collaborator" RGCollaborator room4 444444 collab

# End.
