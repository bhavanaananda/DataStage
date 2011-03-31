# $Id: TestAll.py 1047 2009-01-15 14:48:58Z graham $
#
# Unit testing for WebBrick library functions (Functions.py)
# See http://pyunit.sourceforge.net/pyunit.html
#

import sys, unittest, logging

# Add main library directory to python path
sys.path.append("../..")
sys.path.append("..")

import TestConfig
import TestSubmitDataset
import TestSubmitDatasetHandler
import TestDirectoryListingHandler
import TestMetadataMerging
import TestGetDatasetMetadataHandler
import TestHttpSession

# Code to run unit tests from all library test modules
def getTestSuite(select="all"):
    suite = unittest.TestSuite()

    suite.addTest(TestSubmitDataset.getTestSuite(select=select))
    suite.addTest(TestSubmitDatasetHandler.getTestSuite(select=select))
    suite.addTest(TestDirectoryListingHandler.getTestSuite(select=select))
    suite.addTest(TestMetadataMerging.getTestSuite(select=select))
    suite.addTest(TestGetDatasetMetadataHandler.getTestSuite(select=select))
    suite.addTest(TestHttpSession.getTestSuite(select=select))
    return suite

from MiscLib import TestUtils

if __name__ == "__main__":
    print "============================================================"
    print "This test suite needs to run under a Linux operating system"
    print "Edit TestConfig.py to specify hostname and other parameters"
    print "Create test accounts on target system to match TestConfig.py"
    print "============================================================"
    TestConfig.setDatasetsBaseDir(".")
    TestUtils.runTests("TestAll", getTestSuite, sys.argv)

# End.
