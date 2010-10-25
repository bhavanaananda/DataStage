# $Id: TestAll.py 1047 2009-01-15 14:48:58Z graham $
#
# Unit testing for WebBrick library functions (Functions.py)
# See http://pyunit.sourceforge.net/pyunit.html
#

import sys, unittest, logging

# Add main library directory to python path
sys.path.append("../..")

import TestFileUserASharedPublic
import TestFileUserAPublic
import TestFileSharedArea
import TestFileCollabArea
import TestFileCIFSwriteHTTPread
import TestFileHTTPwriteCIFSread
import TestFileDefaultArea

# Code to run unit tests from all library test modules
def getTestSuite(select="all"):
    suite = unittest.TestSuite()
#    suite.addTest(TestFileUserASharedPublic.getTestSuite(select=select))
#    suite.addTest(TestFileUserAPublic.getTestSuite(select=select))
    suite.addTest(TestFileSharedArea.getTestSuite(select=select))
    suite.addTest(TestFileCollabArea.getTestSuite(select=select))
    suite.addTest(TestFileCIFSwriteHTTPread.getTestSuite(select=select))
    suite.addTest(TestFileHTTPwriteCIFSread.getTestSuite(select=select))
    suite.addTest(TestFileDefaultArea.getTestSuite(select=select))
    return suite

from MiscLib import TestUtils

if __name__ == "__main__":
    print "============================================================"
    print "This test suite needs to run under a Linux operating system"
    print "Edit TestConfig.py to specify hostname and other parameters"
    print "Create test accounts on target system to match TestConfig.py"
    print "============================================================"
    TestUtils.runTests("TestAll", getTestSuite, sys.argv)

# End.
