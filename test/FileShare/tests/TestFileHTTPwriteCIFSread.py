# $Id: TestFileHTTPwriteCIFSread.py 1047 2009-01-15 14:48:58Z graham $
#
# Unit testing for TestFileHTTPwriteCIFSread module
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

class TestFileHTTPwriteCIFSread(unittest.TestCase):
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

    def testSharedUserHTTP(self):
        passman = urllib2.HTTPPasswordMgrWithDefaultRealm()
        passman.add_password(None, TestConfig.webdavbaseurl, TestConfig.userAname, TestConfig.userApass)
        authhandler = urllib2.HTTPBasicAuthHandler(passman)
        opener = urllib2.build_opener(authhandler)
        urllib2.install_opener(opener)
        createstring="Testing file creation with HTTP\n"
        
        thepage=None
        self.do_HTTP_redirect(opener, "PUT",
            TestConfig.webdavbaseurl+'/shared/'+TestConfig.userAname+'/testCreateFileHTTPAsharedspace.tmp', 
            createstring, 'text/plain')
        phan=urllib2.urlopen(TestConfig.webdavbaseurl+'/shared/'+TestConfig.userAname+'/testCreateFileHTTPAsharedspace.tmp')
        thepage=phan.read()
        self.assertEqual(thepage,createstring)

        thepage=None
        self.do_HTTP_redirect(opener, "PUT",
            TestConfig.webdavbaseurl+'/collab/'+TestConfig.userAname+'/testCreateFileHTTPAcollabspace.tmp', 
            createstring, 'text/plain')
        phan=urllib2.urlopen(TestConfig.webdavbaseurl+'/collab/'+TestConfig.userAname+'/testCreateFileHTTPAcollabspace.tmp')
        thepage=phan.read()
        self.assertEqual(thepage,createstring)

        return

    def testSharedUserCIFSB(self):
        mountcommand = ( '/sbin/mount.cifs //%(host)s/%(share)s/ %(mountpt)s -o rw,user=%(user)s,password=%(pass)s,nounix,forcedirectio' %
                         { 'host': TestConfig.hostname
                         , 'share': TestConfig.cifssharename
                         , 'userA': TestConfig.userAname
                         , 'user': TestConfig.userBname
                         , 'mountpt': TestConfig.cifsmountpoint
                         , 'pass': TestConfig.userBpass
                         } )
        status=os.system(mountcommand)

        l=None
        f = open(TestConfig.cifsmountpoint+'/shared/'+TestConfig.userAname+'/testCreateFileHTTPAsharedspace.tmp','r')
        l = f.readline()
        f.close()
        self.assertEqual(l, 'Testing file creation with HTTP\n', 'Unexpected file content in user A\'s shared space for User B') 

        f=None
        try: 
            f = open(TestConfig.cifsmountpoint+'/shared/'+TestConfig.userAname+'/testCreateFileHTTPAsharedspace.tmp','w+')
        except:
            pass
        assert (f==None), "User B can open User A's shared files for writing!"

        l=None
        f = open(TestConfig.cifsmountpoint+'/collab/'+TestConfig.userAname+'/testCreateFileHTTPAcollabspace.tmp','r')
        l = f.readline()
        f.close()
        self.assertEqual(l, 'Testing file creation with HTTP\n', 'Unexpected file content in user A\'s collab space for User B') 

        f=None
        try: 
            f = open(TestConfig.cifsmountpoint+'/collab/'+TestConfig.userAname+'/testCreateFileHTTPAcollabspace.tmp','w+')
        except:
            pass
        assert (f!=None), "User B cannot open User A's collab files for writing!"
        os.system('/sbin/umount.cifs '+TestConfig.cifsmountpoint)

    def testSharedUserCIFSRGLeader(self):
        mountcommand = ( '/sbin/mount.cifs //%(host)s/%(share)s/ %(mountpt)s -o rw,user=%(user)s,password=%(pass)s,nounix,forcedirectio' %
                         { 'host': TestConfig.hostname
                         , 'share': TestConfig.cifssharename
                         , 'userA': TestConfig.userAname
                         , 'user': TestConfig.userRGleadername
                         , 'mountpt': TestConfig.cifsmountpoint
                         , 'pass': TestConfig.userRGleaderpass
                         } )
        status=os.system(mountcommand)

        l=None
        f = open(TestConfig.cifsmountpoint+'/shared/'+TestConfig.userAname+'/testCreateFileHTTPAsharedspace.tmp','r')
        l = f.readline()
        f.close()
        self.assertEqual(l, 'Testing file creation with HTTP\n', 'Unexpected file content in user A\'s shared space for RGLeader') 

        f=None
        try: 
            f = open(TestConfig.cifsmountpoint+'/shared/'+TestConfig.userAname+'/testCreateFileHTTPAsharedspace.tmp','w+')
        except:
            pass
        assert (f==None), "Research group leader can open User A's shared files for writing!"

        l=None
        f = open(TestConfig.cifsmountpoint+'/collab/'+TestConfig.userAname+'/testCreateFileHTTPAcollabspace.tmp','r')
        l = f.readline()
        print "read file content: " + repr(l)
        f.close()
        self.assertEqual(l, 'Testing file creation with HTTP\n', 'Unexpected file content in user A\'s collab space for RGLeader') 

        f=None
        try: 
            f = open(TestConfig.cifsmountpoint+'/collab/'+TestConfig.userAname+'/testCreateFileHTTPAcollabspace.tmp','w+')
        except:
            pass
        assert (f!=None), "Research group leader cannot open User A's collab files for writing!"
        os.system('/sbin/umount.cifs '+TestConfig.cifsmountpoint)

    def testSharedUserCIFSCollab(self):
        mountcommand = ( '/sbin/mount.cifs //%(host)s/%(share)s/ %(mountpt)s -o rw,user=%(user)s,password=%(pass)s,nounix,forcedirectio' %
                         { 'host': TestConfig.hostname
                         , 'share': TestConfig.cifssharename
                         , 'user': TestConfig.collabname
                         , 'mountpt': TestConfig.cifsmountpoint
                         , 'pass': TestConfig.collabpass
                         } )

        status=os.system(mountcommand)
        assert (status!=0), "Collaborator can mount CIFS filesystem!"

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
            , "testSharedUserHTTP"
            , "testSharedUserCIFSRGLeader"
            , "testSharedUserCIFSCollab"
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
    return TestUtils.getTestSuite(TestFileHTTPwriteCIFSread, testdict, select=select)

# Run unit tests directly from command line
if __name__ == "__main__":
    TestUtils.runTests("TestFileHTTPwriteCIFSread", getTestSuite, sys.argv)

# End.


