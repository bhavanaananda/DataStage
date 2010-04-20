# $Id: TestFileDefaultArea.py 1047 2009-01-15 14:48:58Z graham $
#
# Unit testing for TestFileDefaultArea module
#

import os
import sys
import httplib
import urllib2
import unittest
import subprocess

sys.path.append("../..")

from TestConfig import TestConfig


class TestFileDefaultArea(unittest.TestCase):

    def setUp(self):
        return

    def tearDown(self):
        return

    # Test cases
    def testNull(self):
        assert (True), "True expected"
        return

    def testUnauthUserHTTP(self):
        passman = urllib2.HTTPPasswordMgrWithDefaultRealm()
#        passman.add_password(None, TestConfig.webdavbaseurl, TestConfig.userAname, TestConfig.userApass)
        authhandler = urllib2.HTTPBasicAuthHandler(passman)
        opener = urllib2.build_opener(authhandler)
        urllib2.install_opener(opener)

        thepage=None
        try:
            pagehandle = urllib2.urlopen(TestConfig.webdavbaseurl+'/ADMIRAL.README')
            thepage = pagehandle.read()
        except urllib2.HTTPError,e:
            if e.code!=403:
                raise e
            pass
        assert (thepage==None), "Unauthenticated user can access filesystem!"

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
            , "testUnauthUserHTTP"
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
    return TestUtils.getTestSuite(TestFileDefaultArea, testdict, select=select)

# Run unit tests directly from command line
if __name__ == "__main__":
    TestUtils.runTests("TestFileDefaultArea", getTestSuite, sys.argv)

# End.


