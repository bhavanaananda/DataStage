# $Id: TestFileSharedArea.py 1047 2009-01-15 14:48:58Z graham $
#
# Unit testing for FileUserSharedArea module
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

class TestFileSharedArea(unittest.TestCase):
    def do_HTTP_redirect(self, opener, method, uri, data, content_type):
        TestHttpUtils.do_HTTP_redirect(opener, method, uri, data, content_type)
        return

    def setUp(self):
        return

    def tearDown(self):
        return

    # Test cases
    def testNull(self):
        assert (True), "True expected"
        return

    def testSharedUserCIFS(self):
        mountcommand = ( 'mount.cifs //%(host)s/%(share)s/shared/%(userA)s %(mountpt)s -o rw,user=%(user)s,password=%(pass)s,nounix,forcedirectio' %
                         { 'host': TestConfig.hostname
                         , 'share': TestConfig.cifssharename
                         , 'userA': TestConfig.userAname
                         , 'user': TestConfig.userAname
                         , 'mountpt': TestConfig.cifsmountpoint
                         , 'pass': TestConfig.userApass
                         } )
        status=os.system(mountcommand)

        self.assertEqual(status, 0, 'CIFS Mount failure')
        f = open(TestConfig.cifsmountpoint+'/testCreateFileCIFS.tmp','w+')
        assert (f), "File creation failed"
        f.write('Test creation of file\n')
        f.close()
        f = open(TestConfig.cifsmountpoint+'/testCreateFileCIFS.tmp','r')
        l = f.readline()
        f.close()
        self.assertEqual(l, 'Test creation of file\n', 'Unexpected file content by user A') 
        os.system('umount.cifs '+TestConfig.cifsmountpoint)
        mountcommand = ( 'mount.cifs //%(host)s/%(share)s/shared/%(userA)s %(mountpt)s -o rw,user=%(user)s,password=%(pass)s,nounix,forcedirectio' %
                         { 'host': TestConfig.hostname
                         , 'share': TestConfig.cifssharename
                         , 'userA': TestConfig.userAname
                         , 'user': TestConfig.userBname
                         , 'mountpt': TestConfig.cifsmountpoint
                         , 'pass': TestConfig.userBpass
                         } )
        status=os.system(mountcommand)
        self.assertEqual(status, 0, 'CIFS Mount failure')
        f = open(TestConfig.cifsmountpoint+'/testCreateFileCIFS.tmp','r')
        assert (f), "User B cannot read User A's file in shared area"
        l = f.readline()
        f.close()
        self.assertEqual(l, 'Test creation of file\n', 'Unexpected file content by user B') 
        os.system('umount.cifs '+TestConfig.cifsmountpoint)
        status=os.system(mountcommand)
        self.assertEqual(status, 0, 'CIFS Mount failure')
        f=None
        try: 
            f = open(TestConfig.cifsmountpoint+'/testCreateFileCIFS.tmp','w+')
        except:
            pass
        assert (f==None), "User B can open User A's files for writing!"
        os.system('umount.cifs '+TestConfig.cifsmountpoint)
        mountcommand = ( 'mount.cifs //%(host)s/%(share)s/shared/%(userA)s %(mountpt)s -o rw,user=%(user)s,password=%(pass)s,nounix,forcedirectio' %
                         { 'host': TestConfig.hostname
                         , 'share': TestConfig.cifssharename
                         , 'userA': TestConfig.userAname
                         , 'user': TestConfig.userRGleadername
                         , 'mountpt': TestConfig.cifsmountpoint
                         , 'pass': TestConfig.userRGleaderpass
                         } )
        status=os.system(mountcommand)
        self.assertEqual(status, 0, 'CIFS Mount failure')
        f = open(TestConfig.cifsmountpoint+'/testCreateFileCIFS.tmp','r')
        assert (f), "Group leader cannot read User A's file in shared area"
        l = f.readline()
        f.close()
        self.assertEqual(l, 'Test creation of file\n', 'Unexpected file content by user B') 
        os.system('umount.cifs '+TestConfig.cifsmountpoint)
        status=os.system(mountcommand)
        self.assertEqual(status, 0, 'CIFS Mount failure')
        f=None
        try: 
            f = open(TestConfig.cifsmountpoint+'/testCreateFileCIFS.tmp','w+')
        except:
            pass
        assert (f==None), "Group Leader can open User A's files for writing!"
        os.system('umount.cifs '+TestConfig.cifsmountpoint)
        return

    def testSharedUserHTTP(self):
        passman = urllib2.HTTPPasswordMgrWithDefaultRealm()
        passman.add_password(None, TestConfig.webdavbaseurl, TestConfig.userAname, TestConfig.userApass)
        authhandler = urllib2.HTTPBasicAuthHandler(passman)
        opener = urllib2.build_opener(authhandler)
        urllib2.install_opener(opener)
        createstring="Testing file creation with HTTP"
        # Write data to server
        self.do_HTTP_redirect(opener, "PUT",
            TestConfig.webdavbaseurl+'/shared/'+TestConfig.userAname+'/TestCreateFileHTTP.tmp', 
            createstring, 'text/plain')
        # Read back value and check result
        phan=urllib2.urlopen(TestConfig.webdavbaseurl+'/shared/'+TestConfig.userAname+'/TestCreateFileHTTP.tmp')
        thepage=phan.read()
        self.assertEqual(thepage,createstring)
        return

    def testSharedUserHTTPB(self):
        passman = urllib2.HTTPPasswordMgrWithDefaultRealm()
        passman.add_password(None, TestConfig.webdavbaseurl, TestConfig.userBname, TestConfig.userBpass)
        authhandler = urllib2.HTTPBasicAuthHandler(passman)
        opener = urllib2.build_opener(authhandler)
        urllib2.install_opener(opener)
        # Read from User A's shared Area    
        pagehandle = urllib2.urlopen(TestConfig.webdavbaseurl+'/shared/'+TestConfig.userAname+'/TestCreateFileHTTP.tmp')
        thepage = pagehandle.read()
        createstring="Testing file creation with HTTP"
        self.assertEqual(thepage, createstring) 
        # Write updated data to server
        modifystring="And this is after an update"
        disallowed = False  
        try:    
            self.do_HTTP_redirect(opener, "PUT",
                TestConfig.webdavbaseurl+'/shared/'+TestConfig.userAname+'/TestCreateFileHTTP.tmp', 
                modifystring, 'text/plain')
        except urllib2.HTTPError as e:
            self.assertEqual(e.code, 401, "Operation should be 401 (auth failed), was: "+str(e))
            disallowed = True
        assert disallowed, "User B can modify a file in User A's filespace by HTTP!"
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
            , "testSharedUserHTTP"
            , "testSharedUserHTTPB"
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
    return TestUtils.getTestSuite(TestFileSharedArea, testdict, select=select)

# Run unit tests directly from command line
if __name__ == "__main__":
    TestUtils.runTests("TestFileSharedArea", getTestSuite, sys.argv)

# End.


