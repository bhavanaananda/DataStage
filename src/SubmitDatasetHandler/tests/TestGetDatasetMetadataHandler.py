# $Id: TestAll.py 1047 2009-01-15 14:48:58Z graham $
#
# Unit testing for WebBrick library functions (Functions.py)
# See http://pyunit.sourceforge.net/pyunit.html
#
import sys, unittest, logging, zipfile, re, StringIO, os, logging, cgi
from os.path import normpath, abspath
from rdflib import URIRef
sys.path.append("..")
sys.path.append("../cgi-bin")

try:
    # Running Python 2.5 with simplejson?
    import simplejson as json
except ImportError:
    import json as json

import GetDatasetMetadataHandler, ManifestRDFUtils, SubmitDatasetUtils, TestConfig
from MiscLib import TestUtils

Logger =  logging.getLogger("TestGetDatasetMetadataHandler")
    
class TestGetDatasetMetadataHandler(unittest.TestCase):

    def setUp(self):
        return
       
    def tearDown(self):
        return
    
    # Tests  

    # Test that the GetMetResponse      
    def testGetDatasetMetadataResponse(self):
        outputStr = StringIO.StringIO()
        
        # Create a manifest file from mocked up form data
        ManifestRDFUtils.writeToManifestFile(TestConfig.ManifestFilePath, TestConfig.NamespaceDictionary,TestConfig.ElementUriList, TestConfig.ElementValueList)

        # Invoke get metatadata submission program, passing faked dataset directory
        GetDatasetMetadataHandler.getDatasetMetadata(TestConfig.formdata, TestConfig.ManifestName, outputStr)
    
        outputStr.seek(0, os.SEEK_SET)
        firstLine = outputStr.readline()
        self.assertEqual( firstLine, "Content-type: application/JSON\n", "Expected Metadata as application/JSON")
        
        Logger.debug("Output String from output stream: " + outputStr.getvalue())

        # Check retrieving metadata
        metadata = json.load(outputStr)

        Logger.debug("Metadata Length = "+ repr(len(metadata)))
        self.assertEquals(len(metadata), 4, "Expected 4 pairs of field-values to be returned")


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
              "testGetDatasetMetadataResponse"
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
    return TestUtils.getTestSuite(TestGetDatasetMetadataHandler, testdict, select=select)

if __name__ == "__main__":
    #logging.basicConfig(level=logging.DEBUG)
    TestConfig.setDatasetsBaseDir(".")
    TestUtils.runTests("TestGetDatasetMetadataHandler.log", getTestSuite, sys.argv)