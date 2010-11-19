# $Id: TestMetadataMerging.py 1047 2009-01-15 14:48:58Z graham $
#
# Unit testing for WebBrick library functions (Functions.py)
# See http://pyunit.sourceforge.net/pyunit.html
#
import sys, unittest, logging, re, StringIO, os, cgi, rdflib
from rdflib.namespace import RDF
from rdflib.graph import Graph
from rdflib.plugins.memory import Memory
from os.path import normpath

sys.path.append("..")
sys.path.append("../cgi-bin")

import SubmitDatasetHandler
import SubmitDatasetUtils
import HttpUtils
from MiscLib import TestUtils
logger           =  logging.getLogger("TestMetadataMerging")
SiloName         =  "admiral-test"
DirName          =  "DatasetsTopDir"
DatasetsEmptyDir =  "DatasetsEmptyDir"
dict1            =  \
                    { 'datDir'      :  cgi.MiniFieldStorage('datDir'      ,  "./DatasetsTopDir")
                    , 'datId'       :  cgi.MiniFieldStorage('datId'       ,  "SubmissionHandlerTest")
                    , 'title'       :  cgi.MiniFieldStorage('title'       ,  "Submission handler test")
                    , 'description' :  cgi.MiniFieldStorage('description' ,  "Submission handler test description")
                    , 'user'        :  cgi.MiniFieldStorage('user'        ,  "admiral")
                    , 'pass'        :  cgi.MiniFieldStorage('pass'        ,  "admiral")
                    , 'submit'      :  cgi.MiniFieldStorage('submit'      ,  "Submit")
                    }
    
class TestMetadataMerging(unittest.TestCase):

    def setUp(self):
        return
       
    def tearDown(self):
        try:
            SubmitDatasetUtils.deleteDataset(SiloName,  SubmitDatasetUtils.getFormParam('datId', formdata))
        except:
            pass
        return
    
    # Tests  
 
    def testSaveToEmptyMetadataRDF(self):    
        outputStr   =  StringIO.StringIO()
        datasetId   =  SubmitDatasetUtils.getFormParam('datId', dict1)
        datasetDir  =  SubmitDatasetUtils.getFormParam('datDir', dict1)
        title       =  SubmitDatasetUtils.getFormParam('title', dict1)
        description =  SubmitDatasetUtils.getFormParam('description', dict1)
        
        # Create empty metadata RDF
        
        # Write to the created metadata RDF
        
        # Read from the metadata RDF into a dictionary      
        
        # Compare the values from the dictionary obtained with the original dictionary of values used for metadata creation
        
        # Assert that both theare same

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
            [
              "testSaveToEmptyMetadataRDF"
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
    return TestUtils.getTestSuite(TestMetadataMerging, testdict, select=select)

if __name__ == "__main__":
    TestUtils.runTests("TestMetadataMerging.log", getTestSuite, sys.argv)
