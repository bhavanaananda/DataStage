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

import GetMetadata
import ManifestRDFUtils
import SubmitDatasetUtils
import HttpUtils
from MiscLib import TestUtils

Logger                    =  logging.getLogger("TestGetMetadata")
BaseDir                   =  "."
SubmitToolDatDirFormField =  "DatasetsTopDir"
ManifestFilePath          =  SubmitToolDatDirFormField+ "/TestGetMetadataManifest.rdf"
ManifestFileName          =  "TestGetMetadataManifest.rdf"
formdata                     =  \
                              {  'datDir'      :  cgi.MiniFieldStorage('datDir'      ,  "./DatasetsTopDir")
                               , 'datId'       :  cgi.MiniFieldStorage('datId'       ,  "SubmissionHandlerTest")
                               , 'title'       :  cgi.MiniFieldStorage('title'       ,  "Submission handler test title")
                               , 'description' :  cgi.MiniFieldStorage('description' ,  "Submission handler test description")
                               , 'user'        :  cgi.MiniFieldStorage('user'        ,  "admiral")
                               , 'pass'        :  cgi.MiniFieldStorage('pass'        ,  "admiral")
                               , 'submit'      :  cgi.MiniFieldStorage('submit'      ,  "Submit")
                               , 'directory'   :  cgi.MiniFieldStorage('directory'   ,  "DatasetsTopDir")
                              }
DatasetId                 =  SubmitDatasetUtils.getFormParam('datId', formdata)
DatasetDir                =  SubmitDatasetUtils.getFormParam('datDir', formdata)
Title                     =  SubmitDatasetUtils.getFormParam('title', formdata)
Description               =  SubmitDatasetUtils.getFormParam('description', formdata)
User                      =  SubmitDatasetUtils.getFormParam('user', formdata)
ElementValueList          =  [User, DatasetId, Title, Description]

ElementCreator            =  "creator"
ElementIdentifier         =  "identifier"
ElementTitle              =  "title"
ElementDescription        =  "description"
ElementList               =  [ElementCreator,ElementIdentifier,ElementTitle,ElementDescription]  
    
class TestGetMetadata(unittest.TestCase):

    def setUp(self):
        return
       
    def tearDown(self):
        return
    
    # Tests  

    # Test that the GetMetResponse      
    def testGetMetadataResponse(self):
        SubmitToolDatDirFormField = "DatasetsTopDir" 
        srcDir                    = SubmitToolDatDirFormField
        baseDir                   = "."     
        outputStr                 = StringIO.StringIO()
        
        # Create a manifest file from mocked up form data
        ManifestRDFUtils.writeToManifestFile(ManifestFilePath, ElementList, ElementValueList)

        # Invoke get mtatadata submission program, passing faked dataset directory
        GetMetadata.getMetadata(formdata, baseDir, outputStr, ManifestFileName)
    
        outputStr.seek(0, os.SEEK_SET)
        firstLine = outputStr.readline()
        self.assertEqual( firstLine, "Content-type: application/JSON\n", "Expected Metadata as application/JSON")
        
        Logger.debug("Output String from output stream: "+outputStr.getvalue())

        # Check retrieving metadata
        metadata = json.load(outputStr)

        Logger.debug("Metadata Length = "+ repr(len(metadata)))
        self.assertEquals(len(metadata), 4, "Expected 4 pairs of field-values to be returned")

#        for key-value in metadata:
#            self.failUnless(key-value in metadata, 
#                "Expected directory %s in result (received %s)"%(d,repr(directoryCollection)))
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
              "testGetMetadataResponse"
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
    return TestUtils.getTestSuite(TestGetMetadata, testdict, select=select)

if __name__ == "__main__":
    #logging.basicConfig(level=logging.DEBUG)
    TestUtils.runTests("TestGetMetadata.log", getTestSuite, sys.argv)
    #runner = unittest.TextTestRunner()
    #runner.run(getTestSuite())