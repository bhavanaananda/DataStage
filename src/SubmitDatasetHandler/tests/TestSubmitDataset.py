# $Id: TestAll.py 1047 2009-01-15 14:48:58Z graham $
#
# Unit testing for WebBrick library functions (Functions.py)
# See http://pyunit.sourceforge.net/pyunit.html
#

import sys, unittest, logging, zipfile, os, re
from os.path import normpath

#Add main library directory to python path
###sys.path.append("../../../test")
sys.path.append("..")

from MiscLib import TestUtils
import HttpSession, SubmitDatasetUtils, TestConfig

TestDatasetName      = "TestSubmitDataset"
EmptyTestDatasetName = "EmptyTestSubmitDataset"
logger               = logging.getLogger(TestDatasetName)

class TestDatasetSubmission(unittest.TestCase):
  
    def setUp(self):
        self.endpointhost = "localhost"
        self.basepath = "/admiral-test/"
        self.session  = HttpSession.makeHttpSession(self.endpointhost, self.basepath, TestConfig.Username, TestConfig.Password)
        return
        
    # Tests
     
        # Test the Dataset Creation: <TestSubmission>       
    def testDatasetCreation(self):        
        # Read original Dataset List from Silo
        initialDatasetsFromSilo = SubmitDatasetUtils.getDatasetsListFromSilo(self.session)
        
        # Formulate the initial datasets received form Databank Silo into a List: <initialDatasetsListFromSilo>
        initialDatasetsListFromSilo = []
        for initialDataset in initialDatasetsFromSilo:
            initialDatasetsListFromSilo.append(initialDataset)
            
        # Create a new Test Dataset
        SubmitDatasetUtils.createDataset(self.session,TestDatasetName)
        
        # Read updated Dataset List from Silo
        updatedDatasetsFromSilo = SubmitDatasetUtils.getDatasetsListFromSilo(self.session)
        
        # Formulate the updated datasets received from Databank Silo into a List: <updatedDatasetListFromSilo>
        updatedDatasetsListFromSilo = []
        for updatedDataset in updatedDatasetsFromSilo:
            updatedDatasetsListFromSilo.append(updatedDataset)

        logger.debug("Updated no. of Datasets in Silo "+str(len(updatedDatasetsListFromSilo))+", Initial no. of Datasets in Silo  "+str(len(initialDatasetsListFromSilo)))
       
        # Test that the length <updatedDatasetListFromSilo> = length<initialDatasetsListFromSilo> + 1
        self.assertEquals(len(updatedDatasetsListFromSilo), len(initialDatasetsListFromSilo)+1, "Dataset was not Created Successfully")
        SubmitDatasetUtils.deleteDataset( self.session,TestDatasetName+"-packed") 
        return
 
        # Test the Dataset Deletion :<TestSubmission>  
    def testDatasetDeletion(self):  
        SubmitDatasetUtils.createDataset( self.session,TestDatasetName)
        # Check dataset exists
        response = self.session.doHTTP_GET(
            resource = "/" + TestConfig.SiloName + "/datasets/" + TestDatasetName+"-packed", 
            expect_status=200, expect_reason="OK", accept_type="application/json")
        # Test the dataset deletion      
        SubmitDatasetUtils.deleteDataset( self.session,TestDatasetName+"-packed") 
        # Test dataset no longer exists
        response = self.session.doHTTP_GET(
            resource = "/" + TestConfig.SiloName + "/datasets/" + TestDatasetName+"-packed", 
            expect_status=404, expect_reason="Not Found")
        return
    
        # Test the File Submission into the Dataset: <TestSubmission>  
    def testSingleFileSubmission(self):     
        SubmitDatasetUtils.createDataset(self.session,TestDatasetName)  
        # Submit a file to the Dataset
        localMimeType = TestConfig.FileMimeType 
        localFileContent  = SubmitDatasetUtils.getLocalFileContents(TestConfig.FilePath)
        SubmitDatasetUtils.submitFileToDataset(self.session, TestDatasetName, TestConfig.FileName, TestConfig.FilePath,localMimeType, TestConfig.FileName)
        
        # Read from the  updated Dataset
        (remoteMimeType,remoteFileContent) = SubmitDatasetUtils.getFileFromDataset(self.session, TestDatasetName+"-packed", TestConfig.FileName)
        
        # Check that the <localFileContent> = <remoteFileContents>
        self.assertEqual(localMimeType, remoteMimeType, "Difference between local and remote MIME types")
        self.assertEqual(localFileContent, remoteFileContent, "Difference between local and remote file contents")
        SubmitDatasetUtils.deleteDataset(self.session,TestDatasetName+"-packed")  
        return
    
    def testDirectorySubmission(self):    
        SubmitDatasetUtils.createDataset(self.session,TestDatasetName)  
        zipFileName = TestDatasetName+".zip"
        zipFilePath = TestConfig.DatasetsBaseDir + os.path.sep + zipFileName
        # Zip the required directory
        SubmitDatasetUtils.zipLocalDirectory(TestConfig.DirPath,TestConfig.TestPat,zipFilePath)
        #zipFilePath = TestConfig.DatasetsBaseDir + os.path.sep + zipFileName
        #logger.debug("ZipFileName: " + zipFileName)
        localZipFileContent  = SubmitDatasetUtils.getLocalFileContents(zipFilePath)
        SubmitDatasetUtils.submitFileToDataset(self.session,TestDatasetName, zipFileName,zipFilePath, TestConfig.ZipMimeType, zipFileName)

        # Read from the  updated Dataset
        (remoteMimeType,remoteZipFileContent) = SubmitDatasetUtils.getFileFromDataset(self.session, TestDatasetName+"-packed", zipFileName)
        
        #logger.debug("LocalZipFileContents: " + localZipFileContent)
        #logger.debug(" RemoteZipFileContents: " + remoteZipFileContent)
        
        # Check that the <localFileContent> = <remoteFileContents>
        self.assertEqual(TestConfig.ZipMimeType, remoteMimeType, "Difference between local and remote zip MIME types") 
        self.assertEqual(localZipFileContent, remoteZipFileContent, "Difference between local and remote zip files contents") 
        
        #unpack the contents
        newDatasetname = SubmitDatasetUtils.unzipRemoteFileToNewDataset(self.session, TestDatasetName, zipFileName)
        SubmitDatasetUtils.deleteDataset(self.session,TestDatasetName+"-packed") 
        SubmitDatasetUtils.deleteDataset(self.session,newDatasetname)
        return
    
    def testSubsequentDatasetSubmission(self):    
        SubmitDatasetUtils.createDataset(self.session,TestDatasetName)  
        zipFileName = TestDatasetName+".zip"
        zipFilePath = TestConfig.DatasetsBaseDir + os.path.sep + zipFileName
        # Zip the required directory
        SubmitDatasetUtils.zipLocalDirectory(TestConfig.DirPath,TestConfig.TestPat,zipFilePath)
        zipFilePath = TestConfig.DatasetsBaseDir + os.path.sep + zipFileName
        #logger.debug("ZipFileName: " + zipFileName)
        localZipFileContent  = SubmitDatasetUtils.getLocalFileContents(zipFilePath)
        SubmitDatasetUtils.submitFileToDataset(self.session, TestDatasetName, zipFileName, zipFilePath, TestConfig.ZipMimeType, zipFileName)

        #Resubmit the File to Dataset skipping dataset creation as the dataset already exists
        SubmitDatasetUtils.submitFileToDataset(self.session,TestDatasetName, zipFileName, zipFilePath, TestConfig.ZipMimeType, zipFileName)
        # Read from the  updated Dataset
        (remoteMimeType,remoteZipFileContent) = SubmitDatasetUtils.getFileFromDataset(self.session, TestDatasetName+"-packed", zipFileName)
        
        #logger.debug("LocalZipFileContents: " + localZipFileContent)
        #logger.debug(" RemoteZipFileContents: " + remoteZipFileContent)

        # Check that the <localFileContent> = <remoteFileContents>
        self.assertEqual(TestConfig.ZipMimeType, remoteMimeType, "Difference between local and remote zip MIME types") 
        self.assertEqual(localZipFileContent, remoteZipFileContent, "Difference between local and remote zip files contents") 

        #unpack the contents
        newDatasetname = SubmitDatasetUtils.unzipRemoteFileToNewDataset(self.session, TestDatasetName, zipFileName)
        SubmitDatasetUtils.deleteDataset(self.session,TestDatasetName+"-packed") 
        SubmitDatasetUtils.deleteDataset(self.session,newDatasetname)
        return

    # To dotestDirectorySubmission
    def testEmptyDirectorySubmission(self):
            
        # Create a new Test Dataset
        SubmitDatasetUtils.createDataset(self.session,EmptyTestDatasetName)

        zipFileName = EmptyTestDatasetName+".zip"
        zipFilePath = TestConfig.DatasetsBaseDir + os.path.sep + zipFileName
        # Zip the Empty directory
        SubmitDatasetUtils.zipLocalDirectory(TestConfig.DatasetsEmptyDirPath,TestConfig.TestPat,zipFilePath)
        zipFilePath = TestConfig.DatasetsBaseDir + os.path.sep + zipFileName
        #logger.debug("ZipFileName: " + zipFileName)
        localZipFileContent  = SubmitDatasetUtils.getLocalFileContents(zipFilePath)
        SubmitDatasetUtils.submitFileToDataset(self.session,EmptyTestDatasetName, zipFileName, zipFilePath, TestConfig.ZipMimeType, zipFileName)

        # Read from the  updated Dataset
        (remoteMimeType, remoteZipFileContent) = SubmitDatasetUtils.getFileFromDataset(self.session, EmptyTestDatasetName+"-packed", zipFileName)
        
        #logger.debug("LocalZipFileContents: " + localZipFileContent)
        #logger.debug(" RemoteZipFileContents: " + remoteZipFileContent)
        
        # Check that the <localFileContent> = <remoteFileContents>
        self.assertEqual(TestConfig.ZipMimeType, remoteMimeType, "Difference between local and remote zip MIME types") 
        self.assertEqual(localZipFileContent, remoteZipFileContent, "Difference between local and remote zip file contents") 
        
        #unpack the contents
        newDatasetName = SubmitDatasetUtils.unzipRemoteFileToNewDataset(self.session, EmptyTestDatasetName, zipFileName)
        SubmitDatasetUtils.deleteDataset(self.session,EmptyTestDatasetName+"-packed")
        SubmitDatasetUtils.deleteDataset(self.session,newDatasetName)
        return

    def tearDown(self):
        
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
              "testDatasetCreation"
            , "testSingleFileSubmission"
            , "testDirectorySubmission"
            , "testSubsequentDatasetSubmission"
            , "testEmptyDirectorySubmission"
            , "testDatasetDeletion"
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
    return TestUtils.getTestSuite(TestDatasetSubmission, testdict, select=select)

if __name__ == "__main__":
    TestConfig.setDatasetsBaseDir(".")
    TestUtils.runTests("TestSubmitDataset.log", getTestSuite, sys.argv)
