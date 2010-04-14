# $Id: TestFileCollabArea.py 1047 2009-01-15 14:48:58Z graham $
#
# Unit testing for TestFileCollabArea module
#

import os
import sys
import httplib
import urllib2
import unittest
import subprocess

sys.path.append("../..")

from TestConfig import TestConfig


class TestFileCollabArea(unittest.TestCase):

    def setUp(self):
        return

    def tearDown(self):
        return

    # Test cases
    def testNull(self):
        assert (True), "True expected"
        return

    def testSharedUserCIFS(self):
        mountcommand = ( 'mount.cifs //%(host)s/files/collab/%(userA)s %(mountpt)s -o rw,user=%(user)s,password=%(pass)s,nounix,forcedirectio' %
                         { 'host': TestConfig.hostname
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
        mountcommand = ( 'mount.cifs //%(host)s/files/collab/%(userA)s %(mountpt)s -o rw,user=%(user)s,password=%(pass)s,nounix,forcedirectio' %
                         { 'host': TestConfig.hostname
                         , 'userA': TestConfig.userAname
                         , 'user': TestConfig.userBname
                         , 'mountpt': TestConfig.cifsmountpoint
                         , 'pass': TestConfig.userBpass
                         } )
        status=os.system(mountcommand)
        self.assertEqual(status, 0, 'CIFS Mount failure')
        f = open(TestConfig.cifsmountpoint+'/testCreateFileCIFS.tmp','r')
        assert (f), "User B cannot read User A's file in collab area"
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
        assert (f==None), "User B can open User A's files in collab area for writing!"
        os.system('umount.cifs '+TestConfig.cifsmountpoint)
        mountcommand = ( 'mount.cifs //%(host)s/files/collab/%(userA)s %(mountpt)s -o rw,user=%(user)s,password=%(pass)s,nounix,forcedirectio' %
                         { 'host': TestConfig.hostname
                         , 'userA': TestConfig.userAname
                         , 'user': TestConfig.userRGleadername
                         , 'mountpt': TestConfig.cifsmountpoint
                         , 'pass': TestConfig.userRGleaderpass
                         } )
        status=os.system(mountcommand)
        self.assertEqual(status, 0, 'CIFS Mount failure')
        f = open(TestConfig.cifsmountpoint+'/testCreateFileCIFS.tmp','r')
        assert (f), "Group leader cannot read User A's file in collab area"
        l = f.readline()
        f.close()
        self.assertEqual(l, 'Test creation of file\n', 'Unexpected file content by group leader') 
        os.system('umount.cifs '+TestConfig.cifsmountpoint)
        status=os.system(mountcommand)
        self.assertEqual(status, 0, 'CIFS Mount failure')
        f=None
        try: 
            f = open(TestConfig.cifsmountpoint+'/testCreateFileCIFS.tmp','w+')
        except:
            pass
        assert (f==None), "Group Leader can open User A's files in collab area for writing!"
        os.system('umount.cifs '+TestConfig.cifsmountpoint)
        mountcommand = ( 'mount.cifs //%(host)s/files/collab/%(userA)s %(mountpt)s -o rw,user=%(user)s,password=%(pass)s,nounix,forcedirectio' %
                         { 'host': TestConfig.hostname
                         , 'userA': TestConfig.userAname
                         , 'user': TestConfig.collabname
                         , 'mountpt': TestConfig.cifsmountpoint
                         , 'pass': TestConfig.collabpass
                         } )
        try:
            status=os.system(mountcommand)
        except:
            pass
        assert (status!=0), "Collaborator can mount CIFS filesystem!"
        return

    def testSharedUserHTTP(self):
        passman = urllib2.HTTPPasswordMgrWithDefaultRealm()
        passman.add_password(None, TestConfig.webdavbaseurl, TestConfig.userAname, TestConfig.userApass)
        authhandler = urllib2.HTTPBasicAuthHandler(passman)
        opener = urllib2.build_opener(authhandler)
        urllib2.install_opener(opener)

        createstring="Testing file creation with WebDAV"
        req=urllib2.Request(TestConfig.webdavbaseurl+'/collab/'+TestConfig.userAname+'/TestCreateFileHTTP.tmp', data=createstring)
        req.add_header('Content-Type', 'text/plain')
        req.get_method = lambda: 'PUT'
        url=opener.open(req)
        phan=urllib2.urlopen(TestConfig.webdavbaseurl+'/collab/'+TestConfig.userAname+'/TestCreateFileHTTP.tmp')
        thepage=phan.read()
        self.assertEqual(thepage,createstring)
        return

    def testSharedUserHTTPB(self):
        passman = urllib2.HTTPPasswordMgrWithDefaultRealm()
        passman.add_password(None, TestConfig.webdavbaseurl, TestConfig.userBname, TestConfig.userBpass)
        authhandler = urllib2.HTTPBasicAuthHandler(passman)
        opener = urllib2.build_opener(authhandler)
        urllib2.install_opener(opener)
        pagehandle = urllib2.urlopen(TestConfig.webdavbaseurl+'/collab/'+TestConfig.userAname+'/TestCreateFileHTTP.tmp')
        thepage = pagehandle.read()
        createstring="Testing file creation with WebDAV"
        self.assertEqual(thepage, createstring) 
        modifystring="And this is after an update"
        thepage=None
        try:
            req=urllib2.Request(TestConfig.webdavbaseurl+'/collab/'+TestConfig.userAname+'/TestCreateFileHTTPB.tmp', data=createstring)
            req.add_header('Content-Type', 'text/plain')
            req.get_method = lambda: 'PUT'
            url=opener.open(req)
            phan=urllib2.urlopen(TestConfig.webdavbaseurl+'/collab/'+TestConfig.userAname+'/TestCreateFileHTTPB.tmp')
            thepage=phan.read()
            self.assertEqual(thepage,createstring)
        except:
            pass
        assert (thepage==None), "User B can create file in User A's collab area by HTTP!"

    def testSharedUserHTTPRGLeader(self):
        passman = urllib2.HTTPPasswordMgrWithDefaultRealm()
        passman.add_password(None, TestConfig.webdavbaseurl, TestConfig.userRGleadername, TestConfig.userRGleaderpass)
        authhandler = urllib2.HTTPBasicAuthHandler(passman)
        opener = urllib2.build_opener(authhandler)
        urllib2.install_opener(opener)
        pagehandle = urllib2.urlopen(TestConfig.webdavbaseurl+'/collab/'+TestConfig.userAname+'/TestCreateFileHTTP.tmp')
        thepage = pagehandle.read()
        createstring="Testing file creation with WebDAV"
        self.assertEqual(thepage, createstring) 
        modifystring="And this is after an update"
        thepage=None
        try:
            req=urllib2.Request(TestConfig.webdavbaseurl+'/collab/'+TestConfig.userAname+'/TestCreateFileHTTPRGL.tmp', data=createstring)
            req.add_header('Content-Type', 'text/plain')
            req.get_method = lambda: 'PUT'
            url=opener.open(req)
            phan=urllib2.urlopen(TestConfig.webdavbaseurl+'/collab/'+TestConfig.userAname+'/TestCreateFileHTTPRGL.tmp')
            thepage=phan.read()
            self.assertEqual(thepage,createstring)
        except:
            pass
        assert (thepage==None), "Group Leader can create file in User A's collab area by HTTP!"

        return

    def testSharedUserHTTPCollab(self):
        passman = urllib2.HTTPPasswordMgrWithDefaultRealm()
        passman.add_password(None, TestConfig.webdavbaseurl, TestConfig.collabname, TestConfig.collabpass)
        authhandler = urllib2.HTTPBasicAuthHandler(passman)
        opener = urllib2.build_opener(authhandler)
        urllib2.install_opener(opener)
        pagehandle = urllib2.urlopen(TestConfig.webdavbaseurl+'/collab/'+TestConfig.userAname+'/TestCreateFileHTTP.tmp')
        thepage = pagehandle.read()
        createstring="Testing file creation with WebDAV"
        self.assertEqual(thepage, createstring) 
        modifystring="And this is after an update"
        thepage=None
        try:
            req=urllib2.Request(TestConfig.webdavbaseurl+'/collab/'+TestConfig.userAname+'/TestCreateFileHTTPRGL.tmp', data=createstring)
            req.add_header('Content-Type', 'text/plain')
            req.get_method = lambda: 'PUT'
            url=opener.open(req)
            phan=urllib2.urlopen(TestConfig.webdavbaseurl+'/collab/'+TestConfig.userAname+'/TestCreateFileHTTPRGL.tmp')
            thepage=phan.read()
            self.assertEqual(thepage,createstring)
        except:
            pass
        assert (thepage==None), "Collaborator can create file in User A's collab area by HTTP!"

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
    return TestUtils.getTestSuite(TestFileCollabArea, testdict, select=select)

# Run unit tests directly from command line
if __name__ == "__main__":
    TestUtils.runTests("TestFileCollabArea", getTestSuite, sys.argv)

# End.


