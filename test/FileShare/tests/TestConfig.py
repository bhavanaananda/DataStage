# $Id: $
#
# Test configuration parameters
#

class TestConfig:
    
    #hostname         = "zoo-admiral-behav.zoo.ox.ac.uk"
    #hostname         = "zoo-admiral-silk.zoo.ox.ac.uk"
    #hostname         = "zoo-admiral-devel.zoo.ox.ac.uk"
    hostname         = "zoo-admiral-ibrg.zoo.ox.ac.uk"
    #hostname         = "zakynthos.zoo.ox.ac.uk"
    
    cifssharename    = "data"
    cifsmountpoint   = "mountadmiral"
    webdavmountpoint = "mountadmiralwebdav"
    webdavbaseurl    = "http://"+hostname+"/data/"
    readmefile       = "ADMIRAL.README"
    readmetext       = "This directory is the root of the ADMIRAL shared file system.\n"
    userAname        = "TestUser1"
    userApass        = "user1"
    userBname        = "TestUser2"
    userBpass        = "user2"
    userDname        = "TestUserD"
    userDpass        = "userd"
    userRGleadername = "TestLeader"
    userRGleaderpass = "leader"
    collabname       = "TestCollab"
    collabpass       = "collab"

# End.


