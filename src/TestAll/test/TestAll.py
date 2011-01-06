# $Id: TestAll.py 1047 2009-01-15 14:48:58Z graham $
#
# Unit testing for WebBrick library functions (Functions.py)
# See http://pyunit.sourceforge.net/pyunit.html
#

import sys, unittest, logging , commands

# Add main library directory to python path
sys.path.append("../../SubmitDatasetHandler")
from MiscLib import TestUtils
sys.path.append("../../SubmitDatasetHandler/cgi-bin")
sys.path.append("../../SubmitDatasetHandler/tests")
import  TestSubmitDataset, TestSubmitDatasetHandler, TestDirectoryListingHandler, TestMetadataMerging, TestGetDatasetMetadataHandler
import  TestConfig
logger               =  logging.getLogger("TestAll")


# Code to run unit tests from all library test modules
def getTestSuite(select="all"):
    suite = unittest.TestSuite()
    #suite.addTest(TestSubmitDatasetHandler.getTestSuite(select=select))
    #suite.addTest(TestSubmitDataset.getTestSuite(select=select))
    suite.addTest(TestMetadataMerging.getTestSuite(select=select))
    return suite


if __name__ == "__main__":
    print "============================================================"
    print "This test suite needs to run under a Linux operating system"
    print "Edit TestConfig.py to specify hostname and other parameters"
    print "Create test accounts on target system to match TestConfig.py"
    print "============================================================"
    #print repr( commands.getstatusoutput('ls ../../'))
    TestConfig.setDatasetsBaseDir("../../SubmitDatasetHandler/tests")
    TestUtils.runTests("TestAll", getTestSuite, sys.argv)

# End.
