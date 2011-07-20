# $Id: TestWebDAVAccess.py 1047 2009-01-15 14:48:58Z graham $
#
# Unit testing for FileAccess module
#

import os
# Make sure python-kerberos package is installed
import kerberos
import sys
import httplib
import urllib2
import urllib2_kerberos
import re
import base64
import unittest
from urlparse import urlparse

sys.path.append("../..")

readmetext="This directory is the root of the ADMIRAL shared file system.\n"
mountpoint="mountadmiralwebdav"
readmefile="ADMIRAL.README"
theurl="http://zoo-admiral-ibrg.zoo.ox.ac.uk/webdav/TestUser1"

class TestWebDAVAccess(unittest.TestCase):

    def setUp(self):
    # mount WebDAV share here
        status=os.system('mount '+mountpoint)
        self.assertEqual(status, 0, 'Mount failure')
        return

    def tearDown(self):
        os.system('umount '+mountpoint)
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
        f = open(mountpoint+'/testCreateWebDAVFile.tmp','w+')
        assert (f), "File creation failed"
        f.write('Test creation of file\n')
        f.close()
        f = open(mountpoint+'/testCreateWebDAVFile.tmp','r')
        l = f.readline()
        f.close()
        self.assertEqual(l, 'Test creation of file\n', 'Unexpected file content') 
        return

    def testUpdateFile(self):
        filename = mountpoint+'/testUpdateWebDAVFile.tmp'
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
        filename = mountpoint+'/testRewriteWebDAVFile.tmp'
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
        filename1 = mountpoint+'/testCreateWebDAVFile.tmp'
        filename2 = mountpoint+'/testRewriteWebDAVFile.tmp'
        filename3 = mountpoint+'/testUpdateWebDAVFile.tmp'
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

    def testWebDAVFileUrlLib(self):
        #_ignore = kerberos.GSS_C_DELEG_FLAG
        #from kerberos import GSS_C_DELEG_FLAG,GSS_C_MUTUAL_FLAG,GSS_C_SEQUENCE_FLAG
        #_ignore, ctx = kerberos.authGSSClientInit('krbtgt/OX.AC.UK@OX.AC.UK', gssflags=GSS_C_DELEG_FLAG|GSS_C_MUTUAL_FLAG|GSS_C_SEQUENCE_FLAG)
        _ignore, ctx = kerberos.authGSSClientInit('HTTP@zakynthos.zoo.ox.ac.uk')
        _ignore = kerberos.authGSSClientStep(ctx, '')
        tgt = kerberos.authGSSClientResponse(ctx)
        opener = urllib2.build_opener()
        opener.add_handler(urllib2_kerberos.HTTPKerberosAuthHandler())
        resp = opener.open(theurl)
        print resp

        return

        req = urllib2.Request(theurl)
        try:
           handle = urllib2.urlopen(req)
        except IOError, e:
           pass
        else:
           assert (False), theurl + " isn't protected by authentication."

        if not hasattr(e, 'code') or e.code != 401:
           # we got an error - but not a 401 error
           assert (False), theurl + " Error: " + e

        authline = e.headers['www-authenticate']
        # this gets the www-authenticate line from the headers
        # which has the authentication scheme and realm in it

        authobj = re.compile(
           r'''(?:\s*www-authenticate\s*:)?\s*(\w*)\s+realm=['"]([^'"]+)['"]''',
           re.IGNORECASE)
      # this regular expression is used to extract scheme and realm
        matchobj = authobj.match(authline)

        if not matchobj:
           # if the authline isn't matched by the regular expression
           # then something is wrong
           assert (False), "Malformed authentication header: " + authline

        scheme = matchobj.group(1)
        realm = matchobj.group(2)
       # here we've extracted the scheme
       # and the realm from the header
        print scheme
        print realm

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
            ],
        "integration":
            [ "testIntegration"
            ],
        "pending":
            [ "testPending"
            , "testWebDAVFile"
            , "testWebDAVFileUrlLib"
            ]
        }
    return TestUtils.getTestSuite(TestWebDAVAccess, testdict, select=select)

# Run unit tests directly from command line
if __name__ == "__main__":
    TestUtils.runTests("TestFileAccess", getTestSuite, sys.argv)

# End.


