# $Id: TestFileAccess.py 1047 2009-01-15 14:48:58Z graham $
#
# Unit testing for FileAccess module
#

import os
import sys
import httplib
import unittest

sys.path.append("../..")

readmetext="This directory is the root of the ADMIRAL shared file system.\n"
mountpoint="mountadmiral"
readmefile="ADMIRAL.README"
hostname="zoo-admiral-silk.zoo.ox.ac.uk"

class TestFileAccess(unittest.TestCase):

    def setUp(self):
        #status=os.system('/sbin/mount.cifs //' +hostname+ '/files '+mountpoint+' -o rw,user=test_admiral,password=test_admiral,nounix,forcedirectio')
        status=os.system('/sbin/mount.cifs //' +hostname+ '/files '+mountpoint+' -o rw,user=ChrisHolland,password=Chris-2203,nounix,forcedirectio')
        self.assertEqual(status, 0, 'Mount failure')
        return

    def tearDown(self):
        os.system('/sbin/umount.cifs '+mountpoint)
        return

    # Test cases
    def testNull(self):
        assert (True), "True expected"
        return

    def testReadMe(self):
        # Test assumes ADMIRAL shared file system is mounted at mountpoint
        # Open README file
        f = open(mountpoint+'/'+readmefile)
        assert (f), "README file open failed"
        # Read first line
        l = f.readline()
        # Close file
        f.close()
        # Check first line
        self.assertEqual(l, readmetext, 'Unexpected README content')
        return

    def testCreateFile(self):
        f = open(mountpoint+'/testCreateFile.tmp','w+')
        assert (f), "File creation failed"
        f.write('Test creation of file\n')
        f.close()
        f = open(mountpoint+'/testCreateFile.tmp','r')
        l = f.readline()
        f.close()
        self.assertEqual(l, 'Test creation of file\n', 'Unexpected file content') 
        return

    def testUpdateFile(self):
        filename = mountpoint+'/testUpdateFile.tmp'
        f = open(filename,'w+')
        assert (f), "File creation failed"
        f.write('Test creation of file\n')
        f.close()
        f = open(filename,'a+')
        f.write('Test update of file\n')
        f.close()
        f = open(filename,'r')
        l1 = f.readline()
        l2 = f.readline()
        f.close()
        self.assertEqual(l1, 'Test creation of file\n', 'Unexpected file content: l1') 
        self.assertEqual(l2, 'Test update of file\n', 'Unexpected file content: l2') 
        return

    def testRewriteFile(self):
        filename = mountpoint+'/testRewriteFile.tmp'
        f = open(filename,'w+')
        assert (f), "File creation failed"
        f.write('Test creation of file\n')
        f.close()
        f = open(filename,'w+')
        f.write('Test rewrite of file\n')
        f.close()
        f = open(filename,'r')
        l = f.readline()
        f.close()
        self.assertEqual(l, 'Test rewrite of file\n', 'Unexpected file content') 
        return

    def testDeleteFile(self):
        filename1 = mountpoint+'/testCreateFile.tmp'
        filename2 = mountpoint+'/testRewriteFile.tmp'
        filename3 = mountpoint+'/testUpdateFile.tmp'
        # Test and delete first file
        try:
            s = os.stat(filename1)
        except:
            assert (False), "File "+filename1+" not found or other stat error"
        os.remove(filename1)
        try:
            s = os.stat(filename1)
            assert (False), "File "+filename1+" not deleted"
        except:
            pass
        # Test and delete second file
        try:
            s = os.stat(filename2)
        except:
            assert (False), "File "+filename2+" not found or other stat error"
        os.remove(filename2)
        try:
            s = os.stat(filename2)
            assert (False), "File "+filename2+" not deleted"
        except:
            pass
        # Test and delete third file
        try:
            s = os.stat(filename3)
        except:
            assert (False), "File "+filename3+" not found or other stat error"
        os.remove(filename3)
        try:
            s = os.stat(filename3)
            assert (False), "File "+filename3+" not deleted"
        except:
            pass
        return

    def testWebDAVFile(self):
        h1 = httplib.HTTPConnection('zakynthos.zoo.ox.ac.uk')
        h1.request('GET','/webdav')
        res=h1.getresponse()
        authreq = str(res.status) + ' ' + res.reason
        print authreq
        self.assertEqual(authreq, '401 Authorization Required', 'Unexpected response') 
        
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
            , "testReadMe"
            , "testCreateFile"
            , "testRewriteFile"
            , "testUpdateFile"
            , "testDeleteFile"
            , "testWebDAVFile"
            ],
        "integration":
            [ "testIntegration"
            ],
        "pending":
            [ "testPending"
            ]
        }
    return TestUtils.getTestSuite(TestFileAccess, testdict, select=select)

# Run unit tests directly from command line
if __name__ == "__main__":
    TestUtils.runTests("TestFileAccess", getTestSuite, sys.argv)

# End.


