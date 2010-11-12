# $Id: TestScanDirectories.py 1058 2009-01-26 10:39:19Z graham $
#
# Unit testing for ScanDirectory functions
# See http://pyunit.sourceforge.net/pyunit.html
#

import sys
import unittest
import re
import logging
from os.path import normpath, abspath

sys.path.append("../..")
from MiscLib.ScanDirectories import CollectDirectories
from MiscLib.Functions import compareLists

class TestScanDirectories (unittest.TestCase):
    def setUp(self):
        self.srcPath = abspath("./resources/")
        self.basePath = abspath(".")
        return

    def tearDown(self):
        return

    # Actual tests follow

    def testCollectShallow(self):
        dirs     = CollectDirectories(self.srcPath,self.basePath,recursive=False)
        expected = [ "resources/TestScanDir1"
                   , "resources/TestScanDir2"
                   , "resources/TestScanFilesSubDir"
                   ]
        c = compareLists(dirs, expected)
        assert c == None, "Wrong directory list: "+repr(c)

    def testCollectRecursive(self):
        dirs     = CollectDirectories(self.srcPath,self.basePath)
        expected = [ "resources/TestScanDir1"
                   , "resources/TestScanDir1/SubDir1a"
                   , "resources/TestScanDir1/SubDir1b"
                   , "resources/TestScanDir2"
                   , "resources/TestScanDir2/SubDir2"
                   , "resources/TestScanFilesSubDir"
                   ]
        c = compareLists(dirs, expected)
        assert c == None, "Wrong directory list: "+repr(c)

# Code to run unit tests directly from command line.
# Constructing the suite manually allows control over the order of tests.
def getTestSuite():
    suite = unittest.TestSuite()
    suite.addTest(TestScanDirectories("testCollectShallow"))
    suite.addTest(TestScanDirectories("testCollectRecursive"))
    return suite

if __name__ == "__main__":
    #logging.basicConfig(level=logging.DEBUG)
    runner = unittest.TextTestRunner()
    runner.run(getTestSuite())
    