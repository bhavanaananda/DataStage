# $Id: TestAll.py 1047 2009-01-15 14:48:58Z graham $
#
# Unit testing for WebBrick library functions (Functions.py)
# See http://pyunit.sourceforge.net/pyunit.html
#
import sys, unittest, logging, zipfile, re, StringIO, os, logging, cgi
from os.path import normpath, abspath
sys.path.append("..")
sys.path.append("../cgi-bin")

try:
    # Running Python 2.5 with simplejson?
    import simplejson as json
except ImportError:
    import json as json

import DirectoryListingHandler, SubmitDatasetUtils, TestConfig
from MiscLib import TestUtils

logger = logging.getLogger("TestDirectoryListingHandler")
    
class TestDirectoryListingHandler(unittest.TestCase):

    def setUp(self):
        return
       
    def tearDown(self):
        return
    
    # Tests  

    # Test that the Dataset handler returned a HTML page back to the client that requested it:      
    def testDirectoryListingHandlerResponse(self):
        outputStr = StringIO.StringIO()

        # Invoke dataset submission program, passing faked form submission parameters
        DirectoryListingHandler.processDirectoryListingRequest(TestConfig.DirPath, TestConfig.DatasetsBaseDir, outputStr)

        #logger.debug("Output String from output stream: "+outputStr.getvalue())
        # print "Output String from output stream: "+outputStr.getvalue()
        outputStr.seek(0, os.SEEK_SET)
        firstLine = outputStr.readline()
        self.assertEqual( firstLine, "Content-type: application/JSON\n", "Expected directory list as application/JSON")
             
        # Check retrieving sub-directories
        directoryCollection = json.load(outputStr)

        logger.debug("Directory Collection = " + repr(directoryCollection))
        self.assertEquals(len(directoryCollection), 2, "Expected 2 directories to be returned")
        expectdirs = \
            [ "DatasetsTopDir/DatasetsEmptySubDir",
              "DatasetsTopDir/DatasetsSubDir"
            ]
        for d in expectdirs:
            self.failUnless(d in directoryCollection, 
                "Expected directory %s in result (received %s)"%(d,repr(directoryCollection)))
        print repr(directoryCollection)
        return

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
            [ #"testUnits"
              "testDirectoryListingHandlerResponse"
            ],
        "component":
            [ #"testComponents"
            ],
        "integration":
            [ #"testIntegration"
            ],
        "pending":
            [ #"testPending"
            ]
        }
    return TestUtils.getTestSuite(TestDirectoryListingHandler, testdict, select=select)

if __name__ == "__main__":
    #logging.basicConfig(level=logging.DEBUG)
    TestConfig.setDatasetsBaseDir(".")
    TestUtils.runTests("TestDirectoryListingHandler.log", getTestSuite, sys.argv)
    #runner = unittest.TextTestRunner()
    #runner.run(getTestSuite())