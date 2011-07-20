# $Id: TestAll.py 1047 2009-01-15 14:48:58Z graham $
#
# Unit testing for WebBrick library functions (Functions.py)
# See http://pyunit.sourceforge.net/pyunit.html
#

import sys, unittest, logging

# Add main library directory to python path
sys.path.append("../..")

import TestFilePrivateArea
import TestFileSharedArea
import TestFileCollabArea
import TestDeletedUserCheckFileAccess
import TestFileDefaultArea
import TestWebDAVAccess
import TestWebDAVbyHTTP

# Code to run unit tests from all library test modules
def getTestSuite(select="all"):
    suite = unittest.TestSuite()
    suite.addTest(TestFilePrivateArea.getTestSuite(select=select))
    suite.addTest(TestFileSharedArea.getTestSuite(select=select))
    suite.addTest(TestFileCollabArea.getTestSuite(select=select))
    suite.addTest(TestDeletedUserCheckFileAccess.getTestSuite(select=select))
    suite.addTest(TestFileDefaultArea.getTestSuite(select=select))
    suite.addTest(TestWebDAVAccess.getTestSuite(select=select))
    suite.addTest(TestWebDAVbyHTTP.getTestSuite(select=select))
    return suite

from MiscLib import TestUtils
import junitxml

if __name__ == "__main__":
    print "============================================================"
    print "This test suite needs to run under a Linux operating system"
    print "Edit TestConfig.py to specify hostname and other parameters"
    print "Create test accounts on target system to match TestConfig.py"
    print "============================================================"
    
    if len(sys.argv) >= 2 and sys.argv[1] == "xml":
        with open('xmlresults.xml', 'w') as report:
            result = junitxml.JUnitXmlResult(report)
            result.startTestRun()
            getTestSuite().run(result)
            result.stopTestRun()
    else:
        TestUtils.runTests("TestAll", getTestSuite, sys.argv)

# End.
