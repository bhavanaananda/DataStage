# $Id: TestAll.py 1047 2009-01-15 14:48:58Z graham $
#
# Unit testing for WebBrick library functions (Functions.py)
# See http://pyunit.sourceforge.net/pyunit.html
#
import sys, unittest, logging, zipfile, re, StringIO, os, logging, cgi
from os.path import normpath
from rdflib import URIRef
sys.path.append("..")
sys.path.append("../cgi-bin")
import SubmitDatasetDetailsHandler
import SubmitDatasetConfirmationHandler
import ManifestRDFUtils
import SubmitDatasetUtils
import HttpSession
from MiscLib import TestUtils
import TestConfig
#from TestConfig import setTestConfig.DatasetsBaseDir
#from TestConfig import TestConfig.SiloName, DirName, TestConfig.DatasetsEmptyDir, TestConfig.DatasetsEmptyDirName, UpdatedTitle, UpdatedDescription, TestConfig.formdata, updatedTestConfig.formdata
#from TestConfig import TestConfig.DatasetId, DatasetDir, Title, Description, User, TestConfig.ElementValueList, TestConfig.ElementValueUpdatedList
#from TestConfig import ElementCreatorUri,ElementIdentifierUri,ElementTitleUri,ElementDescriptionUri,TestConfig.ElementUriList      
#from TestConfig import TestConfig.DatasetsBaseDir, TestConfig.ManifestFilePath 

Logger                   =  logging.getLogger("TestSubmitDatasetHandler")

ExpectedDictionary       =  {
                                 "creator"     : "admiral"
                               , "identifier"  : "SubmissionToolTest"
                               , "title"       : "Submission tool test title"
                               , "description" : "Submission tool test description"                     
                            } 

ExpectedUpdatedDictionary =  {
                                 "creator"     : "admiral"
                              ,  "identifier"  : "SubmissionToolTest"
                              ,  "title"       : "Submission tool updated test title"
                              ,  "description" : "Submission tool updated test description"                     
                             }     


class TestSubmitDatasetHandler(unittest.TestCase):

    def setUp(self):
        self.endpointhost = TestConfig.HostName
        self.basepath = "/"+TestConfig.SiloName+"/"
        self.session  = HttpSession.makeHttpSession(self.endpointhost, self.basepath, TestConfig.Username, TestConfig.Password)
 
        return
       
    def tearDown(self):
        try:
            SubmitDatasetUtils.deleteDataset(self.session,  SubmitDatasetUtils.getFormParam('datId', TestConfig.formdata))
            SubmitDatasetUtils.deleteDataset(self.session,  SubmitDatasetUtils.getFormParam('datId', TestConfig.formdata) +"-packed");
        except:
            pass
        return
    
    # Tests  
        # Test that the Dataset handler returned a HTML page back to the client that requested it:      
    def testSubmitDatasetHandlerHTMLResponse(self):    
        outputStr =  StringIO.StringIO()

        # Invoke dataset submission program, passing faked form submission parameters
        SubmitDatasetConfirmationHandler.processDatasetSubmissionForm(TestConfig.formdata, outputStr)

        #Logger.debug("Output String from output stream: "+outputStr.getvalue())
        # print "Output String from output stream: "+outputStr.getvalue()
        outputStr.seek(0, os.SEEK_SET)
        firstLine = outputStr.readline()
        Logger.debug("FirstLine = " + firstLine);
        #self.assertEqual( firstLine, "Content-type: text/html\n", "Submission Handler could not action the client request!")
        self.assertEqual( firstLine.strip(), "Status: 303 Dataset submission successful","Submission Handler could not action the client request!")
           
        SubmitDatasetUtils.deleteDataset(self.session, TestConfig.DatasetId +"-packed");
        #SubmitDatasetUtils.deleteDataset(TestConfig.SiloName, datasetId);
        return

        # Test that the named dataset has been created in the databank
    def testSubmitDatasetHandlerDatasetCreation(self):    
        outputStr =  StringIO.StringIO()
        
        # Invoke dataset submission program, passing faked form submission parameters
        SubmitDatasetConfirmationHandler.processDatasetSubmissionForm(TestConfig.formdata, outputStr)

        # Check that the dataset is created
        found = SubmitDatasetUtils.ifDatasetExists(self.session, TestConfig.DatasetId)
          
        self.assertEquals(found, True, "Dataset Creation Failed!" )
        
        # Check that the new dataset can be dereferenced in the databank 
        self.session.doHTTP_GET(resource="/" + TestConfig.SiloName +"/datasets/"+ TestConfig.DatasetId+"-packed", 
            expect_status=200, expect_reason="OK", accept_type="application/json")
        
        # Check that a HTML Response page is returned
        outputStr.seek(0, os.SEEK_SET)
        firstLine = outputStr.readline()

        # self.assertEqual( firstLine, "Content-type: text/html\n", "Submission Handler could not action the client request!")
        self.assertEqual( firstLine.strip(), "Status: 303 Dataset submission successful","Submission Handler could not action the client request!")
         
        SubmitDatasetUtils.deleteDataset(self.session, TestConfig.DatasetId+"-packed")
        return
        
        # Test that the named dataset has been created in the databank
    def testSubmitDatasetHandlerDatasetDeletion(self):    
        outputStr =  StringIO.StringIO()
         
        # Invoke dataset submission program, passing faked form submission parameters
        SubmitDatasetConfirmationHandler.processDatasetSubmissionForm(TestConfig.formdata, outputStr)
        SubmitDatasetUtils.deleteDataset(self.session, TestConfig.DatasetId)

        # Check that the dataset is deleted
        found = SubmitDatasetUtils.ifDatasetExists(self.session, TestConfig.DatasetId)
            
        self.assertEquals(found, False, "Dataset Deletion Failed!" )     
        
        # Check that the dataset deleted cannot be dereferenced in the databank 
        self.session.doHTTP_GET(resource="/" + TestConfig.SiloName +"/datasets/"+ TestConfig.DatasetId, 
            expect_status=404, expect_reason="Not Found", accept_type="application/json")
        
        # Check that a HTML Response page is returned   
        outputStr.seek(0, os.SEEK_SET)
        firstLine = outputStr.readline()
        # self.assertEqual( firstLine, "Content-type: text/html\n", "Submission Handler could not action the client request!")
        self.assertEqual( firstLine.strip(), "Status: 303 Dataset submission successful","Submission Handler could not action the client request!")
 
        SubmitDatasetUtils.deleteDataset(self.session, TestConfig.DatasetId+"-packed")
        return
    
    def testSubmitDatasetHandlerDirectorySubmission(self):
        outputStr  =  StringIO.StringIO()
         
        # Invoke dataset submission program, passing faked form submission parameters
        SubmitDatasetConfirmationHandler.processDatasetSubmissionForm(TestConfig.formdata, outputStr)
        
        # Check that the dataset created for unzipped data can be dereferenced in the databank 
        datasetId  =  SubmitDatasetUtils.getFormParam('datId', TestConfig.formdata)
        datasetDir =  SubmitDatasetUtils.getFormParam('datDir', TestConfig.formdata)
        self.session.doHTTP_GET(resource="/" + TestConfig.SiloName +"/datasets/"+datasetId+"-packed",
            expect_status=200, expect_reason="OK", accept_type="application/json")
        
        # Invoke dataset submission program yet again. 
        # This time, bypassing the dataset creation but  continuing submittion of data to the already exiting dataset
        SubmitDatasetConfirmationHandler.processDatasetSubmissionForm(TestConfig.formdata, outputStr)
         # Check that the dataset created for unzipped data can be dereferenced in the databank 
         
        self.session.doHTTP_GET(resource="/" + TestConfig.SiloName +"/datasets/"+TestConfig.DatasetId+"-packed", 
            expect_status=200, expect_reason="OK", accept_type="application/json")
            
        SubmitDatasetUtils.deleteDataset(self.session, TestConfig.DatasetId+"-packed")
        return
    
    
    def testSubmitDatasetHandlerEmptyDirectorySubmission(self):
        outputStr =  StringIO.StringIO() 
        
        # reset the Dataset Directory to point to an empty directory
        formdata = TestConfig.formdata.copy()
        formdata['datDir'] = cgi.MiniFieldStorage('datDir', TestConfig.DatasetsEmptyDirPath)

        # Invoke dataset submission program, passing faked form submission parameters
        SubmitDatasetConfirmationHandler.processDatasetSubmissionForm(formdata, outputStr)
        
        # Check that the dataset created for unzipped data can be dereferenced in the databank 
        self.session.doHTTP_GET(resource="/" + TestConfig.SiloName +"/datasets/"+TestConfig.DatasetId+"-packed", 
            expect_status=200, expect_reason="OK", accept_type="application/json")
        
        # Invoke dataset submission program yet again. 
        # This time, bypassing the dataset creation but  continuing submittion of data to the already exiting dataset
        SubmitDatasetConfirmationHandler.processDatasetSubmissionForm(formdata, outputStr)
         # Check that the dataset created for unzipped data can be dereferenced in the databank 
         
        self.session.doHTTP_GET(resource="/" + TestConfig.SiloName +"/datasets/"+TestConfig.DatasetId+"-packed", expect_status=200, expect_reason="OK", accept_type="application/json")
        
        SubmitDatasetUtils.deleteDataset(self.session, TestConfig.DatasetId+"-packed")
        return
    
    def testSubmitDatasetHandlerUpdateMetadataBeforeSubmission(self):
        # the initial manifest file 
        SubmitDatasetDetailsHandler.updateMetadataInDirectoryBeforeSubmission(TestConfig.ManifestFilePath, TestConfig.ElementUriList, TestConfig.ElementValueList)
        # Assert that the manifets has been created
        self.assertEqual(True,ManifestRDFUtils.ifFileExists(TestConfig.ManifestFilePath),"Manifest file was not successfully created!")
        # Update the manifets contents 
        SubmitDatasetDetailsHandler.updateMetadataInDirectoryBeforeSubmission(TestConfig.ManifestFilePath, TestConfig.ElementUriList, TestConfig.ElementValueUpdatedList)   
        
        # Read the manifest again
        rdfGraph = ManifestRDFUtils. readManifestFile(TestConfig.ManifestFilePath)
        # Assert that the Updated Value list from metadata == "TestConfig.ElementValueUpdatedList"
        self.assertEqual(ManifestRDFUtils.getElementValuesFromManifest(rdfGraph,TestConfig.ElementUriList),TestConfig.ElementValueUpdatedList,"Error updating the metadata!")       
        return
    
    def testUpdateLocalManifestAndDatasetSubmission(self):
        outputStr =  StringIO.StringIO()

        # Invoke dataset submission program, passing faked form submission parameters

        SubmitDatasetConfirmationHandler.processDatasetSubmissionForm(TestConfig.formdata, outputStr)
        # Read the dictionary from the manifest
        actualDictionary   = ManifestRDFUtils.getDictionaryFromManifest(TestConfig.ManifestFilePath, TestConfig.ElementUriList)
        Logger.debug("\n Expected Dictionary after form submission= " + repr(ExpectedDictionary))
        Logger.debug("\n Actual Dictionary after form submission =  " + repr(actualDictionary))
        ###print "\n---- actualDictionary ---- \n"+repr(actualDictionary)
        
        # Assert that the ExpectedDictionary == actualDictionary
        self.assertEqual(ExpectedDictionary,actualDictionary, "The submit Utils Tool is unable to fetch metadata information!")
        
        # Invoke dataset submission program with updated information, passing faked updated form submission parameters
        SubmitDatasetConfirmationHandler.processDatasetSubmissionForm(TestConfig.updatedformdata, outputStr)
        # Read the dictionary from the manifest after processing the form submission with the updated faked  form  data
        actualUpdatedDictionary   = ManifestRDFUtils.getDictionaryFromManifest(TestConfig.ManifestFilePath, TestConfig.ElementUriList)
        Logger.debug("\n Expected Updated Dictionary after form resubmission = " + repr(ExpectedUpdatedDictionary))
        Logger.debug("\n Actual Updated Dictionary after form resubmission =  " + repr(actualUpdatedDictionary))
        
        # Assert that the  ExpectedUpdatedDictionary == actualUpdatedDictionary
        self.assertEqual(ExpectedUpdatedDictionary,actualUpdatedDictionary, "The submit Utils Tool was unable to update form data information in the metadata file!")
        
        return

def getTestSuite(select="unit"):
    """
    Get test suite

    select  is one of the following:
            "unit"      return suite of unit tests only
            "component" return suite of unit and component tests
            "all"       return suite of udirName, baseDir,nit, component and integration tests
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
             ,"testSubmitDatasetHandlerUpdateMetadataBeforeSubmission"
             ,"testUpdateLocalManifestAndDatasetSubmission"
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
    return TestUtils.getTestSuite(TestSubmitDatasetHandler, testdict, select=select)

if __name__ == "__main__":
    TestConfig.setDatasetsBaseDir(".")
    TestUtils.runTests("TestSubmitDatasetHandler.log", getTestSuite, sys.argv)
