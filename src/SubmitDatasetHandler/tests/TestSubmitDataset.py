# $Id: TestAll.py 1047 2009-01-15 14:48:58Z graham $
#
# Unit testing for WebBrick library functions (Functions.py)
# See http://pyunit.sourceforge.net/pyunit.html
#

import sys, unittest, logging, zipfile, re
from os.path import normpath

#Add main library directory to python path
sys.path.append("../../../test")
sys.path.append("..")

from MiscLib import TestUtils
import HttpUtils
import SubmitDatasetUtils

SiloName         =  "admiral-test"
FileName         =  "file1.txt"
TestDatasetName  =  "TestSubmitDataset"
EmptyTestDatasetName = "Empty"+TestDatasetName
FileMimeType     =  "text/plain"
ZipMimeType      =  "application/zip"
DirName          =  "DatasetsTopDir"
EmptyDirName     =  "DatasetsEmptyDir"
TestPat          =  re.compile("^.*$(?<!\.zip)")
logger           =  logging.getLogger(TestDatasetName)

class TestDatasetSubmission(unittest.TestCase):
  
    def setUp(self):
        return
    
        
    # Tests
     
        # Test the Dataset Creation: <TestSubmission>       
    def testDatasetCreation(self):        
        # Read original Dataset List from Silo
        initialDatasetsFromSilo = SubmitDatasetUtils.getDatasetsListFromSilo(SiloName)
        
        # Formulate the initial datasets received form Databank Silo into a List: <initialDatasetsListFromSilo>
        initialDatasetsListFromSilo = []
        for initialDataset in initialDatasetsFromSilo:
            initialDatasetsListFromSilo.append(initialDataset)
            
        # Create a new Test Dataset
        SubmitDatasetUtils.createDataset(SiloName,TestDatasetName)
        
        # Read updated Dataset List from Silo
        updatedDatasetsFromSilo = SubmitDatasetUtils.getDatasetsListFromSilo(SiloName)
        
        # Formulate the updated datasets received from Databank Silo into a List: <updatedDatasetListFromSilo>
        updatedDatasetsListFromSilo = []
        for updatedDataset in updatedDatasetsFromSilo:
            updatedDatasetsListFromSilo.append(updatedDataset)

        logger.debug("Updated no. of Datasets in Silo "+str(len(updatedDatasetsListFromSilo))+", Initial no. of Datasets in Silo  "+str(len(initialDatasetsListFromSilo)))
       
        # Test that the length <updatedDatasetListFromSilo> = length<initialDatasetsListFromSilo> + 1
        self.assertEquals(len(updatedDatasetsListFromSilo), len(initialDatasetsListFromSilo)+1, "Dataset Created Successfully")
        SubmitDatasetUtils.deleteDataset(SiloName,TestDatasetName) 
        return
 
        # Test the Dataset Deletion :<TestSubmission>  
    def testDatasetDeletion(self):  
        SubmitDatasetUtils.createDataset(SiloName,TestDatasetName)
        # Check dataset exists
        response = HttpUtils.doHTTP_GET(
            resource = "/" + SiloName + "/datasets/" + TestDatasetName, 
            expect_status=200, expect_reason="OK", accept_type="application/json")
        # Test the dataset deletion      
        SubmitDatasetUtils.deleteDataset(SiloName,TestDatasetName) 
        # Test dataset no longer exists
        response = HttpUtils.doHTTP_GET(
            resource = "/" + SiloName + "/datasets/" + TestDatasetName, 
            expect_status=404, expect_reason="Not Found")
        return
    
    
        # Test the File Submission into the Dataset: <TestSubmission>  
    def testSingleFileSubmission(self):     
        SubmitDatasetUtils.createDataset(SiloName,TestDatasetName)  
        # Submit a file to the Dataset
        localMimeType = FileMimeType 
        localFileContent  = SubmitDatasetUtils.getLocalFileContents(FileName)
        SubmitDatasetUtils.submitFileToDataset(SiloName, TestDatasetName, FileName, localMimeType, FileName)
        
        # Read from the  updated Dataset
        (remoteMimeType,remoteFileContent) = SubmitDatasetUtils.getFileFromDataset(SiloName, TestDatasetName, FileName)
        
        # Check that the <localFileContent> = <remoteFileContents>
        self.assertEqual(localMimeType, remoteMimeType, "Difference between local and remote MIME types")
        self.assertEqual(localFileContent, remoteFileContent, "Difference between local and remote file contents")
        SubmitDatasetUtils.deleteDataset(SiloName,TestDatasetName)  
        return
    
    
    def testDirectorySubmission(self):    
        SubmitDatasetUtils.createDataset(SiloName,TestDatasetName)  
        # Zip the required directory
        zipFileName = SubmitDatasetUtils.zipLocalDirectory(DirName,TestPat,TestDatasetName+".zip")
        #logger.debug("ZipFileName: " + zipFileName)
        localZipFileContent  = SubmitDatasetUtils.getLocalFileContents(zipFileName)
        SubmitDatasetUtils.submitFileToDataset(SiloName, TestDatasetName, zipFileName, ZipMimeType, zipFileName)

        # Read from the  updated Dataset
        (remoteMimeType,remoteZipFileContent) = SubmitDatasetUtils.getFileFromDataset(SiloName, TestDatasetName, zipFileName)
        
        #logger.debug("LocalZipFileContents: " + localZipFileContent)
        #logger.debug(" RemoteZipFileContents: " + remoteZipFileContent)
        
        # Check that the <localFileContent> = <remoteFileContents>
        self.assertEqual(ZipMimeType, remoteMimeType, "Difference between local and remote zip MIME types") 
        self.assertEqual(localZipFileContent, remoteZipFileContent, "Difference between local and remote zip files contents") 
        
        #unpack the contents
        newDatasetname = SubmitDatasetUtils.unzipRemoteFileToNewDataset(SiloName, TestDatasetName, zipFileName)
        SubmitDatasetUtils.deleteDataset(SiloName,TestDatasetName)  
        SubmitDatasetUtils.deleteDataset(SiloName,newDatasetname)
        return


    # To dotestDirectorySubmission
    def testEmptyDirectorySubmission(self):
            
        # Create a new Test Dataset
        SubmitDatasetUtils.createDataset(SiloName,EmptyTestDatasetName)

        # Zip the Empty directory
        zipFileName = SubmitDatasetUtils.zipLocalDirectory(EmptyDirName,TestPat,EmptyTestDatasetName+".zip")
        #logger.debug("ZipFileName: " + zipFileName)
        localZipFileContent  = SubmitDatasetUtils.getLocalFileContents(zipFileName)
        SubmitDatasetUtils.submitFileToDataset(SiloName,EmptyTestDatasetName, zipFileName, ZipMimeType, zipFileName)

        # Read from the  updated Dataset
        (remoteMimeType, remoteZipFileContent) = SubmitDatasetUtils.getFileFromDataset(SiloName, EmptyTestDatasetName, zipFileName)
        
        #logger.debug("LocalZipFileContents: " + localZipFileContent)
        #logger.debug(" RemoteZipFileContents: " + remoteZipFileContent)
        
        # Check that the <localFileContent> = <remoteFileContents>
        self.assertEqual(ZipMimeType, remoteMimeType, "Difference between local and remote zip MIME types") 
        self.assertEqual(localZipFileContent, remoteZipFileContent, "Difference between local and remote zip file contents") 
        
        #unpack the contents
        newDatasetName = SubmitDatasetUtils.unzipRemoteFileToNewDataset(SiloName, EmptyTestDatasetName, zipFileName)
        SubmitDatasetUtils.deleteDataset(SiloName,EmptyTestDatasetName)
        SubmitDatasetUtils.deleteDataset(SiloName,newDatasetName)
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
    TestUtils.runTests("TestSubmitDataset.log", getTestSuite, sys.argv)
    #runner = unittest.TextTestRunner()
    #runner.run(getTestSuite())