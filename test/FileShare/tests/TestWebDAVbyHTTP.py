# $Id: TestWebDAVbyHTTP.py 1047 2009-01-15 14:48:58Z graham $
#
# Unit testing for FileAccess module
#

import os
import sys
import httplib
import urllib2
import re
import base64
import unittest
from urlparse import urlparse

sys.path.append("../..")

readmetext="This directory is the root of the ADMIRAL shared file system.\n"
readmefile="ADMIRAL.README"
hostname="zoo-admiral-ibrg.zoo.ox.ac.uk"
theurl="http://" +hostname+ "/data/private/TestUser1"
username="TestUser1"
password="user1"
passman = urllib2.HTTPPasswordMgrWithDefaultRealm()
passman.add_password(None, theurl, username, password)
authhandler = urllib2.HTTPBasicAuthHandler(passman)
opener = urllib2.build_opener(authhandler)
urllib2.install_opener(opener)

class TestWebDAVbyHTTP(unittest.TestCase):

    def setUp(self):
        return

    def tearDown(self):
        return

    # Test cases
    def testNull(self):
        assert (True), "True expected"
        return

    def testWebDAVFile(self):
        h1 = httplib.HTTPConnection(hostname)
        h1.request('GET','/data')
        res=h1.getresponse()
        authreq = str(res.status) + ' ' +res.reason
        print authreq
#        self.assertEqual(authreq, '401 Authorization Required', 'Unexpected response') 
        return

    def testWebDAVFileRead(self):
        theurl="http://" +hostname+ "/data"
        pagehandle = urllib2.urlopen(theurl+'/ADMIRAL.README')
        thepage = pagehandle.read()
        self.assertEqual(thepage, readmetext) 

        return

    def testWebDAVFileCreate(self):
        createstring="Testing file creation with WebDAV"
        req=urllib2.Request(theurl+'/TestWebDAVCreate.tmp', data=createstring)
        req.add_header('Content-Type', 'text/plain')
        req.get_method = lambda: 'PUT'
        url=opener.open(req)
        phan=urllib2.urlopen(theurl+'/TestWebDAVCreate.tmp')
        thepage=phan.read()
        self.assertEqual(thepage,createstring)
        return

    def testWebDAVFileUpdate(self):
        createstring="Testing file modification with WebDAV"
        modifystring="And this is after an update" 
        req=urllib2.Request(theurl+'/TestWebDAVModify.tmp', createstring)
        req.add_header('Content-Type', 'text/plain')
        req.get_method = lambda: 'PUT'
        url=opener.open(req)
        req=urllib2.Request(theurl+'/TestWebDAVModify.tmp', modifystring)
        req.get_method = lambda: 'PUT'
        urllib2.urlopen(req)
        phan=urllib2.urlopen(theurl+'/TestWebDAVModify.tmp')
        thepage=phan.read()
        self.assertEqual(thepage,modifystring)
        return

    def testWebDAVFileDelete(self):
        req=urllib2.Request(theurl+'/TestWebDAVCreate.tmp')
        req.get_method = lambda: 'DELETE'
        url=opener.open(req)
        req=urllib2.Request(theurl+'/TestWebDAVModify.tmp')
        req.get_method = lambda: 'DELETE'
        url=opener.open(req)
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
            , "testWebDAVFileRead"
            , "testWebDAVFileCreate"
            , "testWebDAVFileUpdate"
            ],
        "integration":
            [ "testIntegration"
            ],
        "pending":
            [ "testPending"
            , "testWebDAVFile"
            , "testWebDAVFileDelete"
            ]
        }
    return TestUtils.getTestSuite(TestWebDAVbyHTTP, testdict, select=select)

# Run unit tests directly from command line
if __name__ == "__main__":
    TestUtils.runTests("TestWebDAVbyHTTP", getTestSuite, sys.argv)

# End.


