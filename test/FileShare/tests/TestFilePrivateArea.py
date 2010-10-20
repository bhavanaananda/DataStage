# $Id: TestFilePrivateArea.py 1047 2009-01-15 14:48:58Z graham $
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

class TestFilePrivateArea(unittest.TestCase):
        
    def setUp(self):
        return

    def tearDown(self):
        #TestCifsUtils.do_cifsUnmount()
        return

    def HTTP_redirect(self, opener, method, uri, data, content_type):
        TestHttpUtils.do_HTTP_redirect(opener, method, uri, data, content_type)
        return
    
    def cifsMount(self, userName, userPass):
        status= TestCifsUtils.do_cifsMount('private/'+userName, userName, userPass)
        self.assertEqual(status, 0, 'CIFS Mount failure')
        return

    def cifsUnmount(self):
        TestCifsUtils.do_cifsUnmount()
        return

    def cifsCreateFile(self, fileName, fileContent):
        TestCifsUtils.do_cifsCreateFile(fileName, fileContent)
        return

    def cifsReadFile(self, fileName , fileContent):
        l = TestCifsUtils.do_cifsReadFile(fileName , fileContent)
        return  
    
    def cifsUpdateFile(self,fileName, fileUpdateContent):
        TestCifsUtils.do_cifsUpdateFile(fileName, fileUpdateContent)
        return
    
    def cifsDeleteFile(self,fileName):
        TestCifsUtils.do_cifsDeleteFile(fileName)
        return   

    def httpAuthenticationHandler(self,userName, userPass):
        authhandler = TestHttpUtils.do_httpAuthenticationHandler(userName, userPass)
        return authhandler
    
    def httpCreateFile(self, userName, userPass, fileName, fileContent):
        TestHttpUtils.do_httpCreateFile('private/'+userName, userName, userPass, fileName, fileContent)
        return

    def httpReadFile(self, userName, userPass,fileName, fileContent):
        thepage = TestHttpUtils.do_httpReadFile( 'private/'+userName, userName, userPass,fileName, fileContent)
        self.assertEqual(thepage,fileContent)
        return
    
    def httpUpdateFile(self, userName, userPass,fileName, fileUpdateContent):
        TestHttpUtils.do_httpUpdateFile('private/'+userName, userName, userPass,fileName, fileUpdateContent)
        return
    
    def httpDeleteFile(self,areaName, userName, userPass,fileName):
        TestHttpUtils.do_httpDeleteFile( 'private/'+userName, userName, userPass,fileName)
        return

    # Test cases

    def testNull(self):
        assert (True), "True expected"
        return

    def testUserACreateCIFSUserAReadCIFS(self): 
        fileName = 'testCreateFileCIFS.tmp'
        fileContent= 'Test creation of file\n'
        self.cifsMount(TestConfig.userAname, TestConfig.userApass)
        self.cifsCreateFile(fileName, fileContent)       
        self.cifsReadFile(fileName, fileContent) 
        self.cifsUnmount()
        return

    def testUserACreateCIFSUserAReadHTTP(self): 
        fileName = 'testCreateFileCIFS.tmp'
        fileContent= 'Test creation of file\n'
        self.cifsMount(TestConfig.userAname, TestConfig.userApass)
        self.cifsCreateFile(fileName, fileContent)       
        self.httpReadFile( TestConfig.userAname, TestConfig.userApass,fileName, fileContent) 
        self.cifsUnmount()
        return
    
    def testUserAUpdateCIFSUserAReadCIFS(self): 
        fileName = 'testCreateFileCIFS.tmp'
        fileContent= 'Test creation of file\n'
        fileUpdateContent= 'Test update of file\n'
        self.cifsMount(TestConfig.userAname, TestConfig.userApass)
        self.cifsCreateFile(fileName, fileContent)       
        self.cifsUpdateFile(fileName, fileUpdateContent)
        updatedFileContent= fileContent + fileUpdateContent
        self.cifsReadFile(fileName, updatedFileContent) 
        self.cifsUnmount()
        return
    
    def testUserAUpdateHTTPUserAReadCIFS(self): 
        fileName = 'testCreateFileCIFS.tmp'
        fileContent= 'Test creation of file\n'
        fileUpdateContent= 'Test update of file\n'
        self.cifsMount(TestConfig.userAname, TestConfig.userApass)
        self.cifsCreateFile(fileName, fileContent)       
        updatedFileContent= fileContent + fileUpdateContent
        # HTTP Update overwrites(does not append the original) the file, hence expecting the updated content when read again.
        self.httpUpdateFile(TestConfig.userAname, TestConfig.userApass,fileName,updatedFileContent)
        self.cifsReadFile(fileName, updatedFileContent) 
        self.cifsUnmount()
        return
    
    def testUserACreateCIFSUserADeleteCIFS(self): 
        fileName = 'testCreateFileCIFS.tmp'
        fileContent= 'Test creation of file\n'
        self.cifsMount(TestConfig.userAname, TestConfig.userApass)
        self.cifsCreateFile(fileName, fileContent)     
        self.cifsDeleteFile(fileName)
        self.cifsUnmount()
        return
    
    def testUserACreateCIFSUserADeleteHTTP(self): 
        fileName = 'testCreateFileCIFS.tmp'
        fileContent= 'Test creation of file\n'
        self.cifsMount(TestConfig.userAname, TestConfig.userApass)
        self.cifsCreateFile(fileName, fileContent)       
        self.httpDeleteFile(TestConfig.userAname, TestConfig.userAname, TestConfig.userApass,fileName)
        self.cifsUnmount()
        return

    def testUserACreateHTTPUserAReadHTTP(self): 
        fileName = 'testCreateFileCIFS.tmp'
        fileContent= 'Test creation of file\n'
        self.httpCreateFile(TestConfig.userAname, TestConfig.userApass, fileName, fileContent) 
        self.httpReadFile(TestConfig.userAname, TestConfig.userApass,fileName, fileContent) 
        return
  
    #def testUserACreateCIFSUserAReadHTTP(self): 
       
    #def testUserAUpdateCIFSUserAReadCIFS(self): 
    
    #def testUserAUpdateHTTPUserAReadCIFS(self): 
       
    #def testUserACreateCIFSUserADeleteCIFS(self): 
        
    #def testUserACreateCIFSUserADeleteHTTP(self): 
        


    # Sentinel/placeholder tests

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
            , "testUserACreateCIFSUserAReadCIFS"
            , "testUserACreateCIFSUserAReadHTTP"
            , "testUserAUpdateCIFSUserAReadCIFS"
            , "testUserAUpdateHTTPUserAReadCIFS"
            , "testUserACreateCIFSUserADeleteCIFS"
            , "testUserACreateCIFSUserADeleteHTTP"
            , "testUserACreateHTTPUserAReadHTTP"
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
    return TestUtils.getTestSuite(TestFilePrivateArea, testdict, select=select)

# Run unit tests directly from command line
if __name__ == "__main__":
    TestUtils.runTests("TestFilePrivateArea.log", getTestSuite, sys.argv)

# End.


