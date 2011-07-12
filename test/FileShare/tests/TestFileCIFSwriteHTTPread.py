# $Id: TestFileCIFSwriteHTTPread.py 1047 2009-01-15 14:48:58Z graham $
#
# Unit testing for TestFileCIFSwriteHTTPread module
#

import os
import sys
import httplib
import urllib2
import unittest
import subprocess

sys.path.append("../..")

from TestConfig import TestConfig

import TestHttpUtils

class TestFileCIFSwriteHTTPread(unittest.TestCase):
    def do_HTTP_redirect(self, opener, method, uri, data, content_type):
        return TestHttpUtils.do_HTTP_redirect(opener, method, uri, data, content_type)
        
    
    def setUp(self):
        return

    def tearDown(self):
        return

    # Test cases
    def testNull(self):
        assert (True), "True expected"
        return

    def testSharedUserCIFS(self):
        mountcommand = ( '/sbin/mount.cifs //%(host)s/%(share)s/ %(mountpt)s -o rw,user=%(user)s,password=%(pass)s,nounix,forcedirectio' %
                         { 'host': TestConfig.hostname
                         , 'share': TestConfig.cifssharename
                         , 'userA': TestConfig.userAname
                         , 'user': TestConfig.userAname
                         , 'mountpt': TestConfig.cifsmountpoint
                         , 'pass': TestConfig.userApass
                         } )
        status=os.system(mountcommand)
        self.assertEqual(status, 0, 'CIFS Mount failure')

        f = open(TestConfig.cifsmountpoint+'/shared/'+TestConfig.userAname+'/testCreateFileCIFSAsharedspace.tmp','w+')
        assert (f), "File creation failed"
        f.write('Test creation of file\n')
        f.close()
        f = open(TestConfig.cifsmountpoint+'/shared/'+TestConfig.userAname+'/testCreateFileCIFSAsharedspace.tmp','r')
        l = f.readline()
        f.close()
        self.assertEqual(l, 'Test creation of file\n', 'Unexpected file content by user A in shared space') 
        f = open(TestConfig.cifsmountpoint+'/collab/'+TestConfig.userAname+'/testCreateFileCIFSAcollabspace.tmp','w+')
        assert (f), "File creation failed"
        f.write('Test creation of file\n')
        f.close()
        f = open(TestConfig.cifsmountpoint+'/collab/'+TestConfig.userAname+'/testCreateFileCIFSAcollabspace.tmp','r')
        l = f.readline()
        f.close()
        self.assertEqual(l, 'Test creation of file\n', 'Unexpected file content by user A') 
        os.system('/sbin/umount.cifs '+TestConfig.cifsmountpoint)

    def testSharedUserHTTPB(self):
        passman = urllib2.HTTPPasswordMgrWithDefaultRealm()
        passman.add_password(None, TestConfig.webdavbaseurl, TestConfig.userBname, TestConfig.userBpass)
        authhandler = urllib2.HTTPBasicAuthHandler(passman)
        opener = urllib2.build_opener(authhandler)
        urllib2.install_opener(opener)

        createstring="Test creation of file\n"
        modifystring="And this is after an update"  
        disallowed = False        
        message = self.do_HTTP_redirect(opener, "PUT",
                TestConfig.webdavbaseurl+'/shared/'+TestConfig.userAname+'/testCreateFileCIFSAspace.tmp', 
                modifystring, 'text/plain')
        if message[0] == 401: 
            disallowed = True 
        assert disallowed, "User B can create file in User A's area by HTTP! " + str(message)
      
        #print "URI: "+TestConfig.webdavbaseurl+'/shared/'+TestConfig.userAname+'/testCreateFileCIFSAsharedspace.tmp'
        authhandler = urllib2.HTTPBasicAuthHandler(passman)
        opener = urllib2.build_opener(authhandler)
        urllib2.install_opener(opener)
        pagehandle = urllib2.urlopen(TestConfig.webdavbaseurl+'/shared/'+TestConfig.userAname+'/testCreateFileCIFSAsharedspace.tmp')
        thepage = pagehandle.read()
        self.assertEqual(thepage, createstring) 

        disallowed = False 
        message  = self.do_HTTP_redirect(opener, "PUT",
                TestConfig.webdavbaseurl+'/shared/'+TestConfig.userAname+'/testCreateFileCIFSAsharedspace.tmp', 
                modifystring, 'text/plain')
        if message[0] == 401: 
            disallowed = True         
        assert disallowed, "User B can update file in User A's shared area by HTTP! " + str(message)
        
        authhandler = urllib2.HTTPBasicAuthHandler(passman)
        opener = urllib2.build_opener(authhandler)
        urllib2.install_opener(opener)
        pagehandle = urllib2.urlopen(TestConfig.webdavbaseurl+'/collab/'+TestConfig.userAname+'/testCreateFileCIFSAcollabspace.tmp')
        thepage = pagehandle.read()
        self.assertEqual(thepage, createstring) 

        disallowed = False 
        message  = self.do_HTTP_redirect(opener, "PUT",
                TestConfig.webdavbaseurl+'/collab/'+TestConfig.userAname+'/testCreateFileCIFSAcollabspace.tmp', 
                modifystring, 'text/plain') 
        if message[0] == 401: 
            disallowed = True         
        assert disallowed, "User B can update file in User A's collab area by HTTP! " + str(message)
        

    def testSharedUserHTTPRGLeader(self):
        passman = urllib2.HTTPPasswordMgrWithDefaultRealm()
        passman.add_password(None, TestConfig.webdavbaseurl, TestConfig.userRGleadername, TestConfig.userRGleaderpass)
        authhandler = urllib2.HTTPBasicAuthHandler(passman)
        opener = urllib2.build_opener(authhandler)
        urllib2.install_opener(opener)
      
        createstring="Test creation of file\n"
        modifystring="And this is after an update"

        authhandler = urllib2.HTTPBasicAuthHandler(passman)
        opener = urllib2.build_opener(authhandler)
        urllib2.install_opener(opener)
        pagehandle = urllib2.urlopen(TestConfig.webdavbaseurl+'/shared/'+TestConfig.userAname+'/testCreateFileCIFSAsharedspace.tmp')
        thepage = pagehandle.read()
        self.assertEqual(thepage, createstring) 

        disallowed = False 
        try:           
            self.do_HTTP_redirect(opener, "PUT",
                TestConfig.webdavbaseurl+'/shared/'+TestConfig.userAname+'/testCreateFileCIFSAsharedspace.tmp', 
                modifystring, 'text/plain')
            phan=urllib2.urlopen(TestConfig.webdavbaseurl+'/shared/'+TestConfig.userAname+'/testCreateFileCIFSAsharedspace.tmp')
            thepage=phan.read()
            self.assertEqual(thepage,modifystring)
        except urllib2.HTTPError as e:
            self.assertEqual(e.code, 401, "Operation should be 401 (auth failed), was: "+str(e))
            disallowed = True          
        assert disallowed, "Group leader can update file in User A's shared area by HTTP!"
        
        authhandler = urllib2.HTTPBasicAuthHandler(passman)
        opener = urllib2.build_opener(authhandler)
        urllib2.install_opener(opener)
        pagehandle = urllib2.urlopen(TestConfig.webdavbaseurl+'/collab/'+TestConfig.userAname+'/testCreateFileCIFSAcollabspace.tmp')
        thepage = pagehandle.read()
        self.assertEqual(thepage, createstring) 

        disallowed = False 
        message  = self.do_HTTP_redirect(opener, "PUT",
                TestConfig.webdavbaseurl+'/collab/'+TestConfig.userAname+'/testCreateFileCIFSAcollabspace.tmp', 
                modifystring, 'text/plain')
        if message[0] == 401: 
            disallowed = True          
        assert disallowed,"Group leader can update file in User A's collab area by HTTP! " + str(message)
        

    def testSharedUserHTTPCollab(self):
        passman = urllib2.HTTPPasswordMgrWithDefaultRealm()
        passman.add_password(None, TestConfig.webdavbaseurl, TestConfig.collabname, TestConfig.collabpass)
        authhandler = urllib2.HTTPBasicAuthHandler(passman)
        opener = urllib2.build_opener(authhandler)
        urllib2.install_opener(opener)

        createstring="Test creation of file\n"
        modifystring="And this is after an update"
      
        thepage=None
        try:
            pagehandle = urllib2.urlopen(TestConfig.webdavbaseurl+'/shared/'+TestConfig.userAname+'/testCreateFileCIFSAsharedspace.tmp')
            thepage = pagehandle.read()
            self.assertEqual(thepage, createstring) 
        except:
            pass
        assert (thepage==None), "Collaborator can read file in User A's shared area by HTTP!"

        disallowed = False 
        message = self.do_HTTP_redirect(opener, "PUT",
                TestConfig.webdavbaseurl+'/shared/'+TestConfig.userAname+'/testCreateFileCIFSAsharedspace.tmp', 
                modifystring, 'text/plain')
        if message[0] == 401: 
            disallowed = True       
        assert disallowed,"Collaborator can update file in User A's shared area by HTTP! " + str(message)
        
        authhandler = urllib2.HTTPBasicAuthHandler(passman)
        opener = urllib2.build_opener(authhandler)
        urllib2.install_opener(opener)
        pagehandle = urllib2.urlopen(TestConfig.webdavbaseurl+'/collab/'+TestConfig.userAname+'/testCreateFileCIFSAcollabspace.tmp')
        thepage = pagehandle.read()
        self.assertEqual(thepage, createstring) 

        disallowed = False 
        message = self.do_HTTP_redirect(opener, "PUT",
                TestConfig.webdavbaseurl+'/collab/'+TestConfig.userAname+'/testCreateFileCIFSAcollabspace.tmp', 
                modifystring, 'text/plain')           
        if message[0] == 401: 
            disallowed = True         
        assert disallowed, "Collaborator can update file in User A's collab area by HTTP! " + str(message)
        return


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
            ],
        "component":
            [ "testComponents"
            , "testSharedUserCIFS"
            , "testSharedUserHTTPB"
            , "testSharedUserHTTPRGLeader"
            , "testSharedUserHTTPCollab"
            ],
        "integration":
            [ "testIntegration"
            ],
        "pending":
            [ "testPending"
            , "testReadMeSSH"
            , "testReadMeDAVfs"
            , "testCreateFileDAVfs"
            , "testUpdateFileDAVfs"
            , "testDeleteFileDAVfs"
            , "testDeleteFileCIFS"
            , "testDeleteFileHTTP"
            ]
        }
    return TestUtils.getTestSuite(TestFileCIFSwriteHTTPread, testdict, select=select)

# Run unit tests directly from command line
if __name__ == "__main__":
    TestUtils.runTests("TestFileCIFSwriteHTTPread", getTestSuite, sys.argv)

# End.


