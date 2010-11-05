# $Id: TestAll.py 1047 2009-01-15 14:48:58Z graham $
#
# Unit testing for WebBrick library functions (Functions.py)
# See http://pyunit.sourceforge.net/pyunit.html
#
import sys, unittest, logging, zipfile, re, StringIO, os, logging
from os.path import normpath
sys.path.append("..")
sys.path.append("../cgi-bin")

import SubmitDatasetHandler
import SubmitDatasetUtils
import HttpUtils
from MiscLib import TestUtils

logger           =  logging.getLogger("TestSubmitDatasethandler")
siloName         =  "admiral-test"
DirName          =  "DatasetsTopDir"
formdata         =  \
                    { 'datDir'     :  "./DatasetsTopDir"
                    , 'datId'      :  "SubmissionHandlerTest"
                    , 'title'      :  "Submission handler test"
                    , 'decription' :  "Submission handler test decription"
                    , 'username'   :  "admiral"
                    , 'password'   :  "admiral"
                    , 'submit'     :  "Submit" 
                    }
    
class TestSubmitDatasethandler(unittest.TestCase):

    def setUp(self):
        return
       
    def tearDown(self):
        try:
            SubmitDatasetUtils.deleteDataset(siloName, formdata["datId"])
        except:
            pass
        return
    
    # Tests  
        # Test that the Dataset handler returned a HTML page back to the client that requested it:      
    def testSubmitDatasetHandlerHTMLResponse(self):    
        outputStr =  StringIO.StringIO()

        # Invoke dataset submission program, passing faked form submission parameters
        SubmitDatasetHandler.processDatasetSubmissionForm(formdata, outputStr)

        #logger.debug("Output String from output stream: "+outputStr.getvalue())
        # print "Output String from output stream: "+outputStr.getvalue()
        outputStr.seek(0, os.SEEK_SET)
        firstLine = outputStr.readline()

        self.assertEqual( firstLine, "Content-type: text/html\n", "Submission Handler could not action the client request!")
        return

        # Test that the named dataset has been created in the databank
    def testSubmitDatasetHandlerDatasetCreation(self):    
        outputStr =  StringIO.StringIO()

        # Invoke dataset submission program, passing faked form submission parameters
        SubmitDatasetHandler.processDatasetSubmissionForm(formdata, outputStr)

        # Check that the dataset is created
        datasetsFromSilo = SubmitDatasetUtils.getDatasetsListFromSilo(siloName)
        found = False
        for dataset in datasetsFromSilo:
            if dataset == formdata["datId"] :
                found = True
            
        self.assertEquals(found, True, "Dataset Creation Failed!" )
        
        # Check that the new dataset can be dereferenced in the databank 
        HttpUtils.doHTTP_GET(resource="/" + siloName +"/datasets/"+ formdata["datId"], 
            expect_status=200, expect_reason="OK", accept_type="application/json")
        
        # Check that a HTML Response page is returned
        outputStr.seek(0, os.SEEK_SET)
        firstLine = outputStr.readline()

        self.assertEqual( firstLine, "Content-type: text/html\n", "Submission Handler could not action the client request!")
        return
        
        # Test that the named dataset has been created in the databank
    def testSubmitDatasetHandlerDatasetDeletion(self):    
        outputStr =  StringIO.StringIO()

        # Invoke dataset submission program, passing faked form submission parameters
        SubmitDatasetHandler.processDatasetSubmissionForm(formdata, outputStr)
        SubmitDatasetUtils.deleteDataset(siloName, formdata["datId"])

        # Check that the dataset is delete
        datasetsFromSilo = SubmitDatasetUtils.getDatasetsListFromSilo(siloName)
        found = False
        for dataset in datasetsFromSilo:
            if dataset == formdata["datId"] :
                found = True
            
        self.assertEquals(found, False, "Dataset Deletion Failed!" )     
        
        # Check that the dataset deleted cannot be dereferenced in the databank 
        HttpUtils.doHTTP_GET(resource="/" + siloName +"/datasets/"+ formdata["datId"], 
            expect_status=404, expect_reason="Not Found", accept_type="application/json")
        
        # Check that a HTML Response page is returned   
        outputStr.seek(0, os.SEEK_SET)
        firstLine = outputStr.readline()
        self.assertEqual( firstLine, "Content-type: text/html\n", "Submission Handler could not action the client request!")
        return
    
    def testSubmitDatasetHandlerDirectorySubmission(self):
        outputStr =  StringIO.StringIO() 
         
        # Invoke dataset submission program, passing faked form submission parameters
        SubmitDatasetHandler.processDatasetSubmissionForm(formdata, outputStr)
        
        # Check that the dataset created for unzipped data can be dereferenced in the databank 
        HttpUtils.doHTTP_GET(resource="/" + siloName +"/datasets/"+ formdata["datId"]+"-"+"DatasetsTopDir", 
            expect_status=200, expect_reason="OK", accept_type="application/json")
        
        SubmitDatasetUtils.deleteDataset(siloName, formdata["datId"]+"-"+"DatasetsTopDir")
        return
    
    def testSubmitDatasetHandlerEmptyDirectorySubmission(self):
        outputStr =  StringIO.StringIO() 
         
        # Invoke dataset submission program, passing faked form submission parameters
        SubmitDatasetHandler.processDatasetSubmissionForm(formdata, outputStr)
        
        # Check that the dataset created for unzipped data can be dereferenced in the databank 
        HttpUtils.doHTTP_GET(resource="/" + siloName +"/datasets/"+ formdata["datId"]+"-"+"DatasetsTopDir", 
            expect_status=200, expect_reason="OK", accept_type="application/json")
        
        SubmitDatasetUtils.deleteDataset(siloName, formdata["datId"]+"-"+"DatasetsTopDir")
        return
    
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
              "testSubmitDatasetHandlerHTMLResponse"
             ,"testSubmitDatasetHandlerDatasetCreation"
             ,"testSubmitDatasetHandlerDatasetDeletion"
             ,"testSubmitDatasetHandlerDirectorySubmission"
             ,"testSubmitDatasetHandlerEmptyDirectorySubmission"
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
    return TestUtils.getTestSuite(TestSubmitDatasethandler, testdict, select=select)

if __name__ == "__main__":
    TestUtils.runTests("TestSubmitDatasethandler.log", getTestSuite, sys.argv)
    #runner = unittest.TextTestRunner()
    #runner.run(getTestSuite())