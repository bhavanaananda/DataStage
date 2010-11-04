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
#from TestLib import SparqlQueryTestCase

from SubmitDatasetUtils import *

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
        initialDatasetsFromSilo = UTIL_getDatasetsListFromSilo(SiloName)
        
        # Formulate the initial datasets received form Databank Silo into a List: <initialDatasetsListFromSilo>
        initialDatasetsListFromSilo = []
        for initialDataset in initialDatasetsFromSilo:
            initialDatasetsListFromSilo.append(initialDataset)
            
        # Create a new Test Dataset
        UTIL_createDataset(SiloName,TestDatasetName)
        
        # Read updated Dataset List from Silo
        updatedDatasetsFromSilo = UTIL_getDatasetsListFromSilo(SiloName)
        
        # Formulate the updated datasets received from Databank Silo into a List: <updatedDatasetListFromSilo>
        updatedDatasetsListFromSilo = []
        for updatedDataset in updatedDatasetsFromSilo:
            updatedDatasetsListFromSilo.append(updatedDataset)

        logger.debug("Updated no. of Datasets in Silo "+str(len(updatedDatasetsListFromSilo))+", Initial no. of Datasets in Silo  "+str(len(initialDatasetsListFromSilo)))
       
        # Test that the length <updatedDatasetListFromSilo> = length<initialDatasetsListFromSilo> + 1
        self.assertEquals(len(updatedDatasetsListFromSilo), len(initialDatasetsListFromSilo)+1, "Dataset Created Successfully")
        
        UTIL_deleteDataset(SiloName,TestDatasetName) 
        return
 
 
        # Test the Dataset Deletion :<TestSubmission>  
    def testDatasetDeletion(self):  
        UTIL_createDataset(SiloName,TestDatasetName)
        # Test the dataset deletion      
        UTIL_deleteDataset(SiloName,TestDatasetName) 
        return
    
    
        # Test the File Submission into the Dataset: <TestSubmission>  
    def testSingleFileSubmission(self):     
        UTIL_createDataset(SiloName,TestDatasetName)  
        # Submit a file to the Dataset
        mimeType = FileMimeType 
        localFileContent  = UTIL_getFileContents(FileName)
        UTIL_submitFileToDataset(SiloName, TestDatasetName, FileName, mimeType)
        
        # Read from the  updated Dataset
        remoteFileContent = UTIL_getFileFromDataset(SiloName, TestDatasetName, FileName, mimeType)
        
        # Check that the <localFileContent> = <remoteFileContents>
        self.assertEqual(localFileContent, remoteFileContent, "Difference between local and remote file!")
        UTIL_deleteDataset(SiloName,TestDatasetName)  
        return
    
    
    def testDirectorySubmission(self):    
        UTIL_createDataset(SiloName,TestDatasetName)  
        # Zip the required directory
        mimeType = ZipMimeType
        zipFileName = UTIL_ZipDirectory(DirName,TestPat,TestDatasetName+".zip")
        #logger.debug("ZipFileName: " + zipFileName)
        localZipFileContent  = UTIL_getZipFileContents(zipFileName)
        UTIL_submitZipFileToDataset(SiloName, TestDatasetName, zipFileName, mimeType)

        # Read from the  updated Dataset
        remoteZipFileContent = UTIL_getZipFileContentFromDataset(SiloName, TestDatasetName, zipFileName, mimeType)
        
        #logger.debug("LocalZipFileContents: " + localZipFileContent)
        #logger.debug(" RemoteZipFileContents: " + remoteZipFileContent)
        
        # Check that the <localFileContent> = <remoteFileContents>
        self.assertEqual(localZipFileContent, remoteZipFileContent, "Difference between local and remote zip files!") 
        
        #unpack the contents
        UTIL_UnzipRemoteFileCreateNewDataset(zipFileName, SiloName, TestDatasetName)
        UTIL_deleteDataset(SiloName,TestDatasetName)  
        UTIL_deleteDataset(SiloName,TestDatasetName + "-" + TestDatasetName)
        return


    # To dotestDirectorySubmission
    def testEmptyDirectorySubmission(self):
            
        # Create a new Test Dataset
        UTIL_createDataset(SiloName,EmptyTestDatasetName)

        # Zip the Empty directory
        mimeType = ZipMimeType
        zipFileName = UTIL_ZipDirectory(EmptyDirName,TestPat,EmptyTestDatasetName+".zip")
        #logger.debug("ZipFileName: " + zipFileName)
        localZipFileContent  = UTIL_getZipFileContents(zipFileName)
        UTIL_submitZipFileToDataset(SiloName,EmptyTestDatasetName, zipFileName, mimeType)

        # Read from the  updated Dataset
        remoteZipFileContent = UTIL_getZipFileContentFromDataset(SiloName, EmptyTestDatasetName, zipFileName, mimeType)
        
        #logger.debug("LocalZipFileContents: " + localZipFileContent)
        #logger.debug(" RemoteZipFileContents: " + remoteZipFileContent)
        
        # Check that the <localFileContent> = <remoteFileContents>
        self.assertEqual(localZipFileContent, remoteZipFileContent, "Difference between local and remote zip files!") 
        
        #unpack the contents
        UTIL_UnzipRemoteFileCreateNewDataset(zipFileName, SiloName, EmptyTestDatasetName)
        
        UTIL_deleteDataset(SiloName,EmptyTestDatasetName)
        UTIL_deleteDataset(SiloName,EmptyTestDatasetName + "-" + EmptyTestDatasetName)
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