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

import SubmitDatasetHandler
import ManifestRDFUtils
import SubmitDatasetUtils
import HttpUtils
from MiscLib import TestUtils
Logger                   =  logging.getLogger("TestSubmitDatasethandler")
SiloName                 =  "admiral-test"
DirName                  =  "DatasetsTopDir"
DatasetsEmptyDir         =  "DatasetsTopDir/DatasetsEmptySubDir"
DatasetsEmptyDirName     =  "DatasetsEmptySubDir"
formdata                 =  \
                            {  'datDir'      :  cgi.MiniFieldStorage('datDir'      ,  "./DatasetsTopDir")
                             , 'datId'       :  cgi.MiniFieldStorage('datId'       ,  "SubmissionHandlerTest")
                             , 'title'       :  cgi.MiniFieldStorage('title'       ,  "Submission handler test title")
                             , 'description' :  cgi.MiniFieldStorage('description' ,  "Submission handler test description")
                             , 'user'        :  cgi.MiniFieldStorage('user'        ,  "admiral")
                             , 'pass'        :  cgi.MiniFieldStorage('pass'        ,  "admiral")
                             , 'submit'      :  cgi.MiniFieldStorage('submit'      ,  "Submit")
                            }
updatedformdata          =   \
                            {  'datDir'      :  cgi.MiniFieldStorage('datDir'      ,  "./DatasetsTopDir")
                             , 'datId'       :  cgi.MiniFieldStorage('datId'       ,  "SubmissionHandlerTest")
                             , 'title'       :  cgi.MiniFieldStorage('title'       ,  "Submission handler updated test title")
                             , 'description' :  cgi.MiniFieldStorage('description' ,  "Submission handler updated test description")
                             , 'user'        :  cgi.MiniFieldStorage('user'        ,  "admiral")
                             , 'pass'        :  cgi.MiniFieldStorage('pass'        ,  "admiral")
                             , 'submit'      :  cgi.MiniFieldStorage('submit'      ,  "Submit")      
                            }                      

DatasetId                 =  SubmitDatasetUtils.getFormParam('datId', formdata)
DatasetDir                =  SubmitDatasetUtils.getFormParam('datDir', formdata)
Title                     =  SubmitDatasetUtils.getFormParam('title', formdata)
Description               =  SubmitDatasetUtils.getFormParam('description', formdata)
User                      =  SubmitDatasetUtils.getFormParam('user', formdata)
ElementValueList          =  [User, DatasetId, Title, Description]

UpdatedTitle              =  "Updated Title"
UpdatedDescription        =  "Updated Description"
ElementValueUpdatedList   =  [User, DatasetId, UpdatedTitle, UpdatedDescription]

dcterms                   =  URIRef("http://purl.org/dc/terms/")
oxds                      =  URIRef("http://vocab.ox.ac.uk/dataset/schema#") 
NamespaceDictionary       =  {
                               "dcterms"   : dcterms ,
                               "oxds"      : oxds                    
                             }
ElementCreatorUri         =  URIRef(dcterms + "creator")
ElementIdentifierUri      =  URIRef(dcterms + "identifier")
ElementTitleUri           =  URIRef(dcterms + "title")
ElementDescriptionUri     =  URIRef(dcterms + "description")
ElementUriList            =  [ElementCreatorUri, ElementIdentifierUri, ElementTitleUri, ElementDescriptionUri]

ExpectedDictionary        =  {
                                 "creator"     : "admiral"
                               , "identifier"  : "SubmissionHandlerTest"
                               , "title"       : "Submission handler test title"
                               , "description" : "Submission handler test description"                     
                             } 

ExpectedUpdatedDictionary = {
                                 "creator"     : "admiral"
                              ,  "identifier"  : "SubmissionHandlerTest"
                              ,  "title"       : "Submission handler updated test title"
                              ,  "description" : "Submission handler updated test description"                     
                            }     
                 

BaseDir                   =  "."
ManifestFilePath          =  BaseDir + os.path.sep + DirName + "/TestMetadataMergingManifest.rdf"

class TestSubmitDatasethandler(unittest.TestCase):

    def setUp(self):
        return
       
    def tearDown(self):
        try:
            SubmitDatasetUtils.deleteDataset(SiloName,  SubmitDatasetUtils.getFormParam('datId', formdata))
        except:
            pass
        return
    
    # Tests  
        # Test that the Dataset handler returned a HTML page back to the client that requested it:      
    def testSubmitDatasetHandlerHTMLResponse(self):    
        outputStr =  StringIO.StringIO()
        datasetId  =  SubmitDatasetUtils.getFormParam('datId', formdata)
        datasetDir =  SubmitDatasetUtils.getFormParam('datDir', formdata)
        # Invoke dataset submission program, passing faked form submission parameters
        SubmitDatasetHandler.processDatasetSubmissionForm(formdata, outputStr)

        #Logger.debug("Output String from output stream: "+outputStr.getvalue())
        # print "Output String from output stream: "+outputStr.getvalue()
        outputStr.seek(0, os.SEEK_SET)
        firstLine = outputStr.readline()
        Logger.debug("FirstLine = " + firstLine);
        #self.assertEqual( firstLine, "Content-type: text/html\n", "Submission Handler could not action the client request!")
        self.assertEqual( firstLine.strip(), "Status: 303 Dataset submission successful","Submission Handler could not action the client request!")
           
        SubmitDatasetUtils.deleteDataset(SiloName, datasetId+"-"+DirName)
        return

        # Test that the named dataset has been created in the databank
    def testSubmitDatasetHandlerDatasetCreation(self):    
        outputStr =  StringIO.StringIO()
        datasetId  =  SubmitDatasetUtils.getFormParam('datId', formdata)

        # Invoke dataset submission program, passing faked form submission parameters
        SubmitDatasetHandler.processDatasetSubmissionForm(formdata, outputStr)

        # Check that the dataset is created
        found = SubmitDatasetUtils.ifDatasetExists(SiloName, datasetId)
          
        self.assertEquals(found, True, "Dataset Creation Failed!" )
        
        # Check that the new dataset can be dereferenced in the databank 
        HttpUtils.doHTTP_GET(resource="/" + SiloName +"/datasets/"+ datasetId, 
            expect_status=200, expect_reason="OK", accept_type="application/json")
        
        # Check that a HTML Response page is returned
        outputStr.seek(0, os.SEEK_SET)
        firstLine = outputStr.readline()

        # self.assertEqual( firstLine, "Content-type: text/html\n", "Submission Handler could not action the client request!")
        self.assertEqual( firstLine.strip(), "Status: 303 Dataset submission successful","Submission Handler could not action the client request!")
         
        datasetId  =  SubmitDatasetUtils.getFormParam('datId', formdata)
        datasetDir =  SubmitDatasetUtils.getFormParam('datDir', formdata)
        SubmitDatasetUtils.deleteDataset(SiloName, datasetId+"-"+DirName)
        return
        
        # Test that the named dataset has been created in the databank
    def testSubmitDatasetHandlerDatasetDeletion(self):    
        outputStr =  StringIO.StringIO()
        datasetId  =  SubmitDatasetUtils.getFormParam('datId', formdata)
        datasetDir =  SubmitDatasetUtils.getFormParam('datDir', formdata)
        
        # Invoke dataset submission program, passing faked form submission parameters
        SubmitDatasetHandler.processDatasetSubmissionForm(formdata, outputStr)
        SubmitDatasetUtils.deleteDataset(SiloName, datasetId)

        # Check that the dataset is deleted
        found = SubmitDatasetUtils.ifDatasetExists(SiloName, datasetId)
            
        self.assertEquals(found, False, "Dataset Deletion Failed!" )     
        
        # Check that the dataset deleted cannot be dereferenced in the databank 
        HttpUtils.doHTTP_GET(resource="/" + SiloName +"/datasets/"+ datasetId, 
            expect_status=404, expect_reason="Not Found", accept_type="application/json")
        
        # Check that a HTML Response page is returned   
        outputStr.seek(0, os.SEEK_SET)
        firstLine = outputStr.readline()
        # self.assertEqual( firstLine, "Content-type: text/html\n", "Submission Handler could not action the client request!")
        self.assertEqual( firstLine.strip(), "Status: 303 Dataset submission successful","Submission Handler could not action the client request!")
 
        SubmitDatasetUtils.deleteDataset(SiloName, datasetId+"-"+DirName)
        return
    
    def testSubmitDatasetHandlerDirectorySubmission(self):
        outputStr  =  StringIO.StringIO()
         
        # Invoke dataset submission program, passing faked form submission parameters
        SubmitDatasetHandler.processDatasetSubmissionForm(formdata, outputStr)
        
        # Check that the dataset created for unzipped data can be dereferenced in the databank 
        datasetId  =  SubmitDatasetUtils.getFormParam('datId', formdata)
        datasetDir =  SubmitDatasetUtils.getFormParam('datDir', formdata)
        HttpUtils.doHTTP_GET(resource="/" + SiloName +"/datasets/"+datasetId+"-"+DirName,
            expect_status=200, expect_reason="OK", accept_type="application/json")
        
        # Invoke dataset submission program yet again. 
        # This time, bypassing the dataset creation but  continuing submittion of data to the already exiting dataset
        SubmitDatasetHandler.processDatasetSubmissionForm(formdata, outputStr)
         # Check that the dataset created for unzipped data can be dereferenced in the databank 
         
        datasetId  =  SubmitDatasetUtils.getFormParam('datId', formdata)
        datasetDir =  SubmitDatasetUtils.getFormParam('datDir', formdata)
        HttpUtils.doHTTP_GET(resource="/" + SiloName +"/datasets/"+datasetId+"-"+DatasetsEmptyDir, 
            expect_status=200, expect_reason="OK", accept_type="application/json")
            
        SubmitDatasetUtils.deleteDataset(SiloName, datasetId+"-"+DirName)
        return
    
    
    def testSubmitDatasetHandlerEmptyDirectorySubmission(self):
        outputStr =  StringIO.StringIO() 
        
        # reset the Dataset Directory to point to an empty directory
        formdata['datDir'] = cgi.MiniFieldStorage('datDir', DatasetsEmptyDir)

        # Invoke dataset submission program, passing faked form submission parameters
        SubmitDatasetHandler.processDatasetSubmissionForm(formdata, outputStr)
        
        # Check that the dataset created for unzipped data can be dereferenced in the databank 
        datasetId  =  SubmitDatasetUtils.getFormParam('datId', formdata)
        datasetDir =  SubmitDatasetUtils.getFormParam('datDir', formdata)
        HttpUtils.doHTTP_GET(resource="/" + SiloName +"/datasets/"+datasetId+"-"+DatasetsEmptyDirName, 
            expect_status=200, expect_reason="OK", accept_type="application/json")
        
        # Invoke dataset submission program yet again. 
        # This time, bypassing the dataset creation but  continuing submittion of data to the already exiting dataset
        SubmitDatasetHandler.processDatasetSubmissionForm(formdata, outputStr)
         # Check that the dataset created for unzipped data can be dereferenced in the databank 
         
        datasetId  =  SubmitDatasetUtils.getFormParam('datId', formdata)
        datasetDir =  SubmitDatasetUtils.getFormParam('datDir', formdata)
        HttpUtils.doHTTP_GET(resource="/" + SiloName +"/datasets/"+datasetId+"-"+DatasetsEmptyDirName, expect_status=200, expect_reason="OK", accept_type="application/json")
        
        SubmitDatasetUtils.deleteDataset(SiloName, datasetId+"-"+DatasetsEmptyDirName)
        return
    
    def testSubmitDatasetHandlerUpdateMetadataBeforeSubmission(self):
        # the initial manifest file 
        SubmitDatasetHandler.updateMetadataInDirectoryBeforeSubmission(ManifestFilePath, ElementUriList, ElementValueList)
        # Assert that the manifets has been created
        self.assertEqual(True,ManifestRDFUtils.ifFileExists(ManifestFilePath),"Manifest file was not successfully created!")
        # Update the manifets contents 
        SubmitDatasetHandler.updateMetadataInDirectoryBeforeSubmission(ManifestFilePath, ElementUriList, ElementValueUpdatedList)   
        
        # Read the manifest again
        rdfGraph = ManifestRDFUtils. readManifestFile(ManifestFilePath)
        # Assert that the Updated Value list from metadata == "ElementValueUpdatedList"
        self.assertEqual(ManifestRDFUtils.getElementValuesFromManifest(rdfGraph,ElementUriList),ElementValueUpdatedList,"Error updating the metadata!")       
        return
    
    def testUpdateLocalManifestAndDatasetSubmission(self):
        outputStr =  StringIO.StringIO()
        # Manifest file prodiuced by the form ha the name=manifest.rdf as default
        manifestFilePath  =   DirName + "/manifest.rdf"
        # Invoke dataset submission program, passing faked form submission parameters

        SubmitDatasetHandler.processDatasetSubmissionForm(formdata, outputStr)
        # Read the dictionary from the manifest
        actualDictionary   = ManifestRDFUtils.getDictionaryFromManifest(manifestFilePath, ElementUriList)
        Logger.debug("\n Expected Dictionary after form submission= " + repr(ExpectedDictionary))
        Logger.debug("\n Actual Dictionary after form submission =  " + repr(actualDictionary))
        
        # Assert that the ExpectedDictionary == actualDictionary
        self.assertEqual(ExpectedDictionary,actualDictionary, "The submit Utils Tool is unable to fetch metadata information!")
        
        # Invoke dataset submission program with updated information, passing faked updated form submission parameters
        SubmitDatasetHandler.processDatasetSubmissionForm(updatedformdata, outputStr)
        # Read the dictionary from the manifest after processing the form submission with the updated faked  form  data
        actualUpdatedDictionary   = ManifestRDFUtils.getDictionaryFromManifest(manifestFilePath, ElementUriList)
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
    return TestUtils.getTestSuite(TestSubmitDatasethandler, testdict, select=select)

if __name__ == "__main__":
    TestUtils.runTests("TestSubmitDatasethandler.log", getTestSuite, sys.argv)
    #runner = unittest.TextTestRunner()
    #runner.run(getTestSuite())