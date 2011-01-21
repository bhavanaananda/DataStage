# $Id: TestDeletedUserCheckFileAccess.py 1047 2009-01-15 14:48:58Z graham $
#
# Unit testing for access to private file area
#

import os
import sys
import httplib
import urllib2
import unittest
import subprocess

sys.path.append("../..")

from TestConfig import TestConfig

import TestCifsUtils
import TestHttpUtils

class TestDeletedUserCheckFileAccess(unittest.TestCase):
        
    def setUp(self):
        return

    def tearDown(self):
        #self.cifsUnmount()
        return

    def HTTP_redirect(self, opener, method, uri, data, content_type):
        TestHttpUtils.do_HTTP_redirect(opener, method, uri, data, content_type)
        return
    
    def cifsMountAs(self, access, userArea, userName, userPass):
        status= TestCifsUtils.do_cifsMount(access+'/'+userArea, userName, userPass)
        if status != 32*256:    # 32 is exit status for mount failure: just return status
            self.assertEqual(status, 0, 'CIFS Mount failure')
        return status
    
    def cifsMount(self,access, userName, userPass):
        return self.cifsMountAs(access,userName, userName, userPass)

    def cifsUnmount(self):
        TestCifsUtils.do_cifsUnmount()
        return

    def cifsCreateFile(self, fileName, createFileContent):
        TestCifsUtils.do_cifsCreateFile(fileName, createFileContent)
        return createFileContent

    def cifsReadFile(self, fileName ):
        readFileContent = TestCifsUtils.do_cifsReadFile(fileName)
        return  readFileContent
    
    def cifsUpdateFile(self,fileName, updateFileContent):
        TestCifsUtils.do_cifsUpdateFile(fileName, updateFileContent)
        return updateFileContent
    
    def cifsDeleteFile(self,fileName):
        deleteMessage = TestCifsUtils.do_cifsDeleteFile(fileName)
        return  deleteMessage
    
    def httpAuthenticationHandler(self,userName, userPass):
        authhandler = TestHttpUtils.do_httpAuthenticationHandler(userName, userPass)
        return authhandler
    
    def httpCreateFileAs(self, access, areaName, userName, userPass, fileName, fileContent):
        createMessage = TestHttpUtils.do_httpCreateFile(access+'/'+areaName, userName, userPass, fileName, fileContent)
        return createMessage
    
    def httpCreateFile(self, userName, userPass, fileName, fileContent):
        createMessage = self.httpCreateFileAs(userName, userName, userPass, fileName, fileContent)
        return createMessage
    
    def httpReadFileAs(self, access, areaName, userName, userPass,fileName):
        readFileContent = TestHttpUtils.do_httpReadFile( access+'/'+areaName, userName, userPass,fileName)
        return readFileContent

    def httpReadFile(self, userName, userPass,fileName):
        readFileContent = self.httpReadFileAs( userName, userName, userPass,fileName)
        return readFileContent
      
    def httpUpdateFileAs(self, access, areaName, userName, userPass,fileName, updateFileContent):
        updateMessage = TestHttpUtils.do_httpUpdateFile(access+'/'+areaName, userName, userPass,fileName, updateFileContent)
        return updateMessage
    
    def httpUpdateFile(self, userName, userPass,fileName, updateFileContent):
        updateMessage = self.httpUpdateFileAs(userName, userName, userPass,fileName, updateFileContent)
        return updateMessage
    
    def httpDeleteFileAs(self,access, areaName, userName, userPass,fileName):
        deleteMessage = TestHttpUtils.do_httpDeleteFile(access+'/'+areaName, userName, userPass,fileName)
        return deleteMessage
    
    def httpDeleteFile(self, userName, userPass,fileName):
        deleteMessage = self.httpDeleteFileAs(userName, userName, userPass,fileName)
        return deleteMessage

    def testNull(self):
        assert (True), "True expected"
        return
       
    
# Test for CIFS

# Access to private area files
    # Test User D's access permission in User As Private area, after user D is deleted
    # User D should not be allowed access his private area after his details have been deleted
    def testDeletedUserDReadUserDCIFSPrivateArea(self): 
        fileName = 'testDeletedUserFile.tmp'
        fileContent= 'Deleted User Private File\n'
        disallowed = False
        status = self.cifsMount('private',TestConfig.userDname, TestConfig.userDpass)
        self.assertEqual(status, 256*32, "Mount operation should fail with status 32*256=8192, was: "+str(status))
        return
    
    # Test User A's access permission in User D's Private area, after user D is deleted
    # User A should not be allowed access into User D's private area
    def testUserAReadUserDCIFSPrivateArea(self): 
        fileName = 'testDeletedUserFile.tmp'
        fileContent= 'Deleted User Private File\n'

        self.cifsMountAs('private',TestConfig.userDname, TestConfig.userAname, TestConfig.userApass)
        #print "Status = "+ str(status)
        disallowed = False
        try:
            self.cifsReadFile(fileName)
        except IOError as e:
            self.assertEqual(e.errno, 13, "Operation should fail with error 13, was: "+str(e))
            self.assertEqual(e.strerror, "Permission denied", "Operation should fail with 'Permission denied', was: "+str(e))
            disallowed = True
        assert disallowed, "User A can read a file in User D's filespace by CIFS!"
        self.cifsUnmount()
        return
    
    # Test RGLeader's access permission in User D's Private area, after user D is deleted   
    # RGLeader should be allowed access into User D's private area even after User D has been deleted
    def testRGLeaderReadUserDCIFSPrivateArea(self): 
        fileName = 'testDeletedUserFile.tmp'
        fileContent= 'Deleted User Private File\n'

        self.cifsMountAs('private',TestConfig.userDname, TestConfig.userRGleadername, TestConfig.userRGleaderpass)
        readFileContent = self.cifsReadFile(fileName) 
        self.assertEqual(readFileContent,fileContent) 
        self.cifsUnmount()   
        return
    
    # Test Collaborator's access permission in User D's Private area, after user D is deleted   
    # Collaborator should be allowed access into User D's private area even after User D has been deleted
    def testCollabReadUserDCIFSPrivateArea(self): 
        fileName = 'testDeletedUserFile.tmp'
        fileContent= 'Deleted User Private File\n'

        status = self.cifsMountAs('private',TestConfig.userDname, TestConfig.collabname, TestConfig.collabpass)
        self.assertEqual(status, 256*32, "Mount operation should fail with status 32*256=8192, was: "+str(status))
#        disallowed = False
#        try:
#            self.cifsReadFile(fileName)
#        except IOError as e:
#            self.assertEqual(e.errno, 13, "Operation should fail with error 13, was: "+str(e))
#            self.assertEqual(e.strerror, "Permission denied", "Operation should fail with 'Permission denied', was: "+str(e))
#            disallowed = True
#        assert disallowed, "Collaborator can read a file in User D's filespace by CIFS!"
        self.cifsUnmount()   
        return
    
    
 # Access to shared area files
    # Test User D's access permission in User As Shared area, after user D is deleted
    # User D should not be allowed access his shared area after his details have been deleted
    def testDeletedUserDReadUserDCIFSSharedArea(self): 
        fileName = 'testDeletedUserFile.tmp'
        fileContent= 'Deleted User Shared File\n'
        disallowed = False
        status = self.cifsMount('shared',TestConfig.userDname, TestConfig.userDpass)
        self.assertEqual(status, 256*32, "Mount operation should fail with status 32*256=8192, was: "+str(status))
        return
    
    # Test User A's access permission in User D's Shared area, after user D is deleted
    # User A should not be allowed access into User D's shared area
    def testUserAReadUserDCIFSSharedArea(self): 
        fileName = 'testDeletedUserFile.tmp'
        fileContent= 'Deleted User Shared File\n'

        self.cifsMountAs('shared',TestConfig.userDname, TestConfig.userAname, TestConfig.userApass)
        readFileContent = self.cifsReadFile(fileName) 
        self.assertEqual(readFileContent,fileContent) 
        self.cifsUnmount()   
        return
    
    # Test RGLeader's access permission in User D's Shared area, after user D is deleted   
    # RGLeader should be allowed access into User D's shared area even after User D has been deleted
    def testRGLeaderReadUserDCIFSSharedArea(self): 
        fileName = 'testDeletedUserFile.tmp'
        fileContent= 'Deleted User Shared File\n'

        self.cifsMountAs('shared',TestConfig.userDname, TestConfig.userRGleadername, TestConfig.userRGleaderpass)
        readFileContent = self.cifsReadFile(fileName) 
        self.assertEqual(readFileContent,fileContent) 
        self.cifsUnmount()   
        return
    
    # Test Collaborator's access permission in User D's Shared area, after user D is deleted   
    # Collaborator should be allowed access into User D's shared area even after User D has been deleted
    def testCollabReadUserDCIFSSharedArea(self): 
        fileName = 'testDeletedUserFile.tmp'
        fileContent= 'Deleted User Shared File\n'

        status = self.cifsMountAs('private',TestConfig.userDname, TestConfig.collabname, TestConfig.collabpass)
        self.assertEqual(status, 256*32, "Mount operation should fail with status 32*256=8192, was: "+str(status))
#        disallowed = False
#        try:
#            self.cifsReadFile(fileName)
#        except IOError as e:
#            self.assertEqual(e.errno, 13, "Operation should fail with error 13, was: "+str(e))
#            self.assertEqual(e.strerror, "Permission denied", "Operation should fail with 'Permission denied', was: "+str(e))
#            disallowed = True
#        assert disallowed, "Collaborator can read a file in User D's filespace by CIFS!"
        self.cifsUnmount()   
        return
     
     
  # Access to collab area files
    # Test User D's access permission in User As collab area, after user D is deleted
    # User D should  be allowed to access collab area, even after his details have been deleted
    def testDeletedUserDReadUserDCIFSCollabArea(self): 
        fileName = 'testDeletedUserFile.tmp'
        fileContent= 'Deleted User Collab File\n'
        disallowed = False
        status = self.cifsMount('collab',TestConfig.userDname, TestConfig.userDpass)
        self.assertEqual(status, 256*32, "Mount operation should fail with status 32*256=8192, was: "+str(status))
        return
    
    # Test User A's access permission in User D's collab area, after user D is deleted
    # User A should be allowed access into User D's collab area, even after his details have been deleted
    def testUserAReadUserDCIFSCollabArea(self): 
        fileName = 'testDeletedUserFile.tmp'
        fileContent= 'Deleted User Collab File\n'

        self.cifsMountAs('collab',TestConfig.userDname, TestConfig.userAname, TestConfig.userApass)
        readFileContent = self.cifsReadFile(fileName) 
        self.assertEqual(readFileContent,fileContent) 
        self.cifsUnmount()   
        return
    
    # Test RGLeader's access permission in User D's collab area, after user D is deleted   
    # RGLeader should be allowed access into User D's collab area even after User D has been deleted
    def testRGLeaderReadUserDCIFSCollabArea(self): 
        fileName = 'testDeletedUserFile.tmp'
        fileContent= 'Deleted User Collab File\n'

        self.cifsMountAs('collab',TestConfig.userDname, TestConfig.userRGleadername, TestConfig.userRGleaderpass)
        readFileContent = self.cifsReadFile(fileName) 
        self.assertEqual(readFileContent,fileContent) 
        self.cifsUnmount()   
        return
    
    # Test Collaborator's access permission in User D's collab area, after user D is deleted   
    # Collaborator should be allowed access into User D's collab area even after User D has been deleted
    def testCollabReadUserDCIFSCollabArea(self): 
        fileName = 'testDeletedUserFile.tmp'
        fileContent= 'Deleted User Collab File\n'

        status = self.cifsMountAs('collab',TestConfig.userDname, TestConfig.collabname, TestConfig.collabpass)
        self.assertEqual(status, 256*32, "Mount operation should fail with status 32*256=8192, was: "+str(status))
        return
  

    
# Test for HTTP
# Access to private area files

    # Test User D's access permission in User Ds Private area, after user D is deleted
    # User D should not be allowed access after his details have been deleted.
    def testDeletedUserDReadUserDHTTPPrivateArea(self): 
        fileName = 'testDeletedUserFile.tmp'
        fileContent= 'Deleted User Private File\n' 
       
        try:
            self.httpReadFileAs('private',TestConfig.userDname, TestConfig.userDname, TestConfig.userDpass, fileName)
            #self.httpReadFile(TestConfig.userAname, TestConfig.userApass,fileName)
        except urllib2.HTTPError as e:
            self.assertEqual(e.code, 401, "Operation should be 401 (auth failed), was: "+str(e))
            disallowed = True
        assert disallowed, "User D cannot read a file in User D's filespace by HTTP!"
        return
    
    
    # Test User A's access permission in User Ds Private area, after user D is deleted
    # User A should not be allowed access into User D's private area 
    def testUserAReadUserDHTTPPrivateArea(self): 
        fileName = 'testDeletedUserFile.tmp'
        fileContent= 'Deleted User Private File\n'

        try:
            self.httpReadFileAs('private',TestConfig.userDname, TestConfig.userAname, TestConfig.userApass, fileName)
            #self.httpReadFile(TestConfig.userAname, TestConfig.userApass,fileName)
        except urllib2.HTTPError as e:
            self.assertEqual(e.code, 401, "Operation should be 401 (auth failed), was: "+str(e))
            disallowed = True
        assert disallowed, "User A can read a file in User D's filespace by HTTP!"
        return


    # Test RGLeader's access permission in User D's Private area, after user D is deleted   
    # RGLeader should be allowed access into User D's private area even after User D has been deleted
    def testRGLeaderReadUserDHTTPPrivateArea(self): 
        fileName = 'testDeletedUserFile.tmp'
        fileContent= 'Deleted User Private File\n'
        
        readFileContent = self.httpReadFileAs('private',TestConfig.userDname, TestConfig.userRGleadername, TestConfig.userRGleaderpass, fileName)      
        self.assertEqual(readFileContent,fileContent)   
        return
            
    # Test Collaborator's access permission in User Ds Private area, after user D is deleted
    # Collaborator should not be allowed access into User D's private area 
    def testCollabReadUserDHTTPPrivateArea(self): 
        fileName = 'testDeletedUserFile.tmp'
        fileContent= 'Deleted User Private File\n'

        try:
            self.httpReadFileAs('private',TestConfig.userDname, TestConfig.collabname, TestConfig.collabpass, fileName)
            #self.httpReadFile(TestConfig.userAname, TestConfig.userApass,fileName)
        except urllib2.HTTPError as e:
            self.assertEqual(e.code, 401, "Operation should be 401 (auth failed), was: "+str(e))
            disallowed = True
        assert disallowed, "Collaborator can read a file in User D's filespace by HTTP!"
        return
    
    
# Access to shared area files
    
    # Test User D's access permission in User Ds Shared area, after user D is deleted
    # User D should not be allowed access after his details have been deleted.
    def testDeletedUserDReadUserDHTTPSharedArea(self): 
        fileName = 'testDeletedUserFile.tmp'
        fileContent= 'Deleted User Shared File\n' 
       
        try:
            self.httpReadFileAs('shared',TestConfig.userDname, TestConfig.userDname, TestConfig.userDpass, fileName)
            #self.httpReadFile(TestConfig.userAname, TestConfig.userApass,fileName)
        except urllib2.HTTPError as e:
            self.assertEqual(e.code, 401, "Operation should be 401 (auth failed), was: "+str(e))
            disallowed = True
        assert disallowed, "User D can read a file in User D's filespace by HTTP!"
        return
    
    
    # Test User A's access permission in User Ds Shared area, after user D is deleted
    # User A should be allowed to access User D's shared area files
    def testUserAReadUserDHTTPSharedArea(self): 
        fileName = 'testDeletedUserFile.tmp'
        fileContent= 'Deleted User Shared File\n'

        readFileContent = self.httpReadFileAs('shared',TestConfig.userDname, TestConfig.userAname, TestConfig.userApass, fileName)
        self.assertEqual(readFileContent,fileContent)  
        return


    # Test RGLeader's access permission in User D's Shared area, after user D is deleted   
    # RGLeader should not be allowed access into User D's shared area
    def testRGLeaderReadUserDHTTPSharedArea(self): 
        fileName = 'testDeletedUserFile.tmp'
        fileContent= 'Deleted User Shared File\n'
        
        readFileContent = self.httpReadFileAs('shared',TestConfig.userDname, TestConfig.userRGleadername, TestConfig.userRGleaderpass, fileName)
        self.assertEqual(readFileContent,fileContent)  
        return
            
    # Test Collaborator's access permission in User Ds Shared area, after user D is deleted
    # Collaborator should not be allowed access into User D's Shared area 
    def testCollabReadUserDHTTPSharedArea(self): 
        fileName = 'testDeletedUserFile.tmp'
        fileContent= 'Deleted User Shared File\n'

        try:
            self.httpReadFileAs('shared',TestConfig.userDname, TestConfig.collabname, TestConfig.collabpass, fileName)
            #self.httpReadFile(TestConfig.userAname, TestConfig.userApass,fileName)
        except urllib2.HTTPError as e:
                self.assertEqual(e.code, 401, "Operation should be 401 (auth failed), was: "+str(e))
                disallowed = True
        assert disallowed, "User D can read a file in User D's filespace by HTTP!"
        return

# Access to collab area files
    
    # Test User D's access permission in User Ds collab area, after user D is deleted
    # User D should not be allowed access after his collab have been deleted.
    def testDeletedUserDReadUserDHTTPCollabArea(self): 
        fileName = 'testDeletedUserFile.tmp'
        fileContent= 'Deleted User Collab File\n' 
       
        try:
            self.httpReadFileAs('collab',TestConfig.userDname, TestConfig.userDname, TestConfig.userDpass, fileName)
            #self.httpReadFile(TestConfig.userAname, TestConfig.userApass,fileName)
        except urllib2.HTTPError as e:
            self.assertEqual(e.code, 401, "Operation should be 401 (auth failed), was: "+str(e))
            disallowed = True
        assert disallowed, "User D can read a file in User D's filespace by HTTP!"
        return
    
    
    # Test User A's access permission in User Ds Collab area, after user D is deleted
    # User A should be allowed to access User D's Collab area files
    def testUserAReadUserDHTTPCollabArea(self): 
        fileName = 'testDeletedUserFile.tmp'
        fileContent= 'Deleted User Collab File\n'

        readFileContent = self.httpReadFileAs('collab',TestConfig.userDname, TestConfig.userAname, TestConfig.userApass, fileName)
        self.assertEqual(readFileContent,fileContent)  
        return


    # Test RGLeader's access permission in User D's Collab area, after user D is deleted   
    # RGLeader should be allowed access into User D's Collab area even after User D has been deleted
    def testRGLeaderReadUserDHTTPCollabArea(self): 
        fileName = 'testDeletedUserFile.tmp'
        fileContent= 'Deleted User Collab File\n'
        
        readFileContent = self.httpReadFileAs('collab',TestConfig.userDname, TestConfig.userRGleadername, TestConfig.userRGleaderpass, fileName)      
        self.assertEqual(readFileContent,fileContent)   
        return
            
    # Test Collaborator's access permission in User Ds Collab area, after user D is deleted
    # Collaborator should not be allowed access into User D's Collab area 
    def testCollabReadUserDHTTPCollabArea(self): 
        fileName = 'testDeletedUserFile.tmp'
        fileContent= 'Deleted User Collab File\n'

        readFileContent = self.httpReadFileAs('collab',TestConfig.userDname, TestConfig.collabname, TestConfig.collabpass, fileName)
        self.assertEqual(readFileContent,fileContent)  
        return
    


    def testUnits(self):
        assert (True)

    def testComponents(self):
        assert (True)

    def testIntegration(self):
        assert (True)

    def testPending(self):
        assert (False), "No pending test"

# Assemble test suite

from MiscLib import TestUtils

def getTestSuite(select="unit"):
    """
    Get test suite

    select  is one of the following:
            "unit"      return suite of unit tests only
            "component" return suite of unit and component tests
            "all"       return suite of unit, component and integration tests
            "pending"   return suite of pending tests
            name        a single named test to be run
    """
    testdict = {
        "unit": 
            [ "testUnits"
            , "testNull"
            # Test access to Private area CIFs
            , "testDeletedUserDReadUserDCIFSPrivateArea"
            , "testUserAReadUserDCIFSPrivateArea"
            , "testRGLeaderReadUserDCIFSPrivateArea"
            , "testCollabReadUserDCIFSPrivateArea"
            # Test access to Shared area CIFS
            , "testDeletedUserDReadUserDCIFSSharedArea"
            , "testUserAReadUserDCIFSSharedArea"
            , "testRGLeaderReadUserDCIFSSharedArea"
            , "testCollabReadUserDCIFSSharedArea"
            # Test access to Collab area CIFS
            , "testDeletedUserDReadUserDCIFSCollabArea"
            , "testUserAReadUserDCIFSCollabArea"
            , "testRGLeaderReadUserDCIFSCollabArea"
            , "testCollabReadUserDCIFSCollabArea"
            
            
            # Test access to Private area HTTP
            , "testDeletedUserDReadUserDHTTPPrivateArea"
            , "testUserAReadUserDHTTPPrivateArea"
            , "testRGLeaderReadUserDHTTPPrivateArea"
            , "testCollabReadUserDHTTPPrivateArea"
            # Test access to Shared area HTTP
            , "testDeletedUserDReadUserDHTTPSharedArea"
            , "testUserAReadUserDHTTPSharedArea"
            , "testRGLeaderReadUserDHTTPSharedArea"
            , "testCollabReadUserDHTTPSharedArea"
            # Test access to Collab area HTTP
            , "testDeletedUserDReadUserDHTTPCollabArea"
            , "testUserAReadUserDHTTPCollabArea"
            , "testRGLeaderReadUserDHTTPCollabArea"
            , "testCollabReadUserDHTTPCollabArea"
            ],
        "component":
            [ "testComponents"
            ],
        "integration":
            [ "testIntegration"
            ],
        "pending":
            [ "testPending"
            ]
        }
    return TestUtils.getTestSuite(TestDeletedUserCheckFileAccess, testdict, select=select)

# Run unit tests directly from command line
if __name__ == "__main__":
    TestUtils.runTests("TestDeletedUserCheckFileAccess.log", getTestSuite, sys.argv)

# End.


