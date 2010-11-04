# $Id: TestAll.py 1047 2009-01-15 14:48:58Z graham $
#
# Unit testing for WebBrick library functions (Functions.py)
# See http://pyunit.sourceforge.net/pyunit.html
#

import sys, unittest, logging, zipfile, re
from os.path import normpath
#Add main library directory to python path
sys.path.append("../../../test")
from MiscLib.ScanFiles import *
from MiscLib import TestUtils
#from TestLib import SparqlQueryTestCase
import logging

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
        zipFileName = UTIL_ZipDirectory(DirName,TestPat,TestDatasetName)
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
        zipFileName = UTIL_ZipDirectory(EmptyDirName,TestPat,EmptyTestDatasetName)
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

    
    # Test Helper methods
    
def UTIL_createDataset(siloName, datasetName):
    # Create a new dataset, check response
    fields = \
        [ ("id", datasetName)
        ]
    files =[]
    (reqtype, reqdata) = TestUtils.encode_multipart_formdata(fields, files)
    TestUtils.doHTTP_POST(
        reqdata, reqtype, 
        resource = "/" + siloName + "/datasets/", 
        expect_status=201, expect_reason="Created")
    return


def UTIL_submitFileToDataset(siloName, datasetName, fileName , mimeType):
    fields = []
    fileData = UTIL_getFileContents(fileName)
    files = \
        [ ("file", fileName, fileData, mimeType) 
        ]
    (reqtype, reqdata) = TestUtils.encode_multipart_formdata(fields, files)
    TestUtils.doHTTP_POST(
        reqdata, reqtype, 
        resource = "/" + siloName + "/datasets/"+ datasetName, 
        expect_status=201, expect_reason="Created")     
    return


def UTIL_submitZipFileToDataset(siloName, datasetName, zipFileName , mimeType):
    fields = []
    zipFileData = UTIL_getZipFileContents(zipFileName)
    zipFiles = \
        [ ("file", zipFileName, zipFileData, mimeType) 
        ]
    (reqtype, reqdata) = TestUtils.encode_multipart_formdata(fields, zipFiles)
    TestUtils.doHTTP_POST(
        reqdata, reqtype, 
        resource = "/" + siloName + "/datasets/"+ datasetName, 
        expect_status=201, expect_reason="Created")     
    return


def UTIL_deleteDataset(siloName, datasetName):      
    # Access dataset, check response
    data = TestUtils.doHTTP_GET(
        resource = "/" + siloName + "/datasets/" + datasetName, 
        expect_status=200, expect_reason="OK", expect_type="application/json")
    
    # Delete dataset, check response
    TestUtils.doHTTP_DELETE(
        resource = "/" + siloName + "/datasets/" + datasetName, 
        expect_status=200, expect_reason="OK")
    
    # Access dataset, test response indicating non-existent
    data = TestUtils.doHTTP_GET(
        resource = "/" + siloName + "/datasets/" + datasetName, 
        expect_status=404, expect_reason="Not Found")
    return
        
          
def UTIL_getDatasetsListFromSilo(siloName):
    datasetsListFromSilo = TestUtils.doHTTP_GET(
    resource="/" + siloName +"/datasets/", 
    expect_status=200, expect_reason="OK", expect_type="application/json")
    return datasetsListFromSilo


def UTIL_getFileFromDataset(siloName, datasetName, fileName, mimeType):  
    readFileContent = TestUtils.doHTTP_GET(
            resource = "/" + siloName +"/datasets/" + datasetName + "/" + fileName,
            expect_status=200, expect_reason="OK", expect_type=mimeType)
    return readFileContent


def UTIL_getZipFileContentFromDataset(siloName, datasetName, fileName, mimeType):  
    readZipFileContent = TestUtils.doHTTP_GET(
            resource = "/" + siloName +"/datasets/" + datasetName + "/" + fileName,
            expect_status=200, expect_reason="OK", expect_type=mimeType)
    return readZipFileContent


def UTIL_getFileContents(fileName):
    fileContent = open(fileName).read()
    return fileContent
    
    
def UTIL_getZipFileContents(zipFileName):
    zipFileContent = UTIL_getFileContents(zipFileName)
    return zipFileContent


def UTIL_ZipDirectory(dirName,testPat,datasetName):
    # Write data directly to zip file
    # See O'Reilly Python Nutshell guide, p238
    def data_to_zip(z, name, data):
        import time
        zinfo = zipfile.ZipInfo(name, time.localtime()[:6])
        zinfo.external_attr = 0777 << 16L # Access control for created file
        z.writestr(zinfo, data)
        return
    files = CollectFiles(dirName,testPat)
    z = zipfile.ZipFile(datasetName + '.zip','w')
    data_to_zip(z, "admiral-dataset", "This directory contains an ADMIRAL dataset\n")
    for i in files: 
        n = joinDirName(i[0], i[1])
        z.write(n)
    z.close()
    return datasetName + '.zip'


def UTIL_UnzipRemoteFileCreateNewDataset(zipFileName, siloName, testDatasetName):
    # Unpack ZIP file into a new dataset, check response
    logger.debug("Zip file name to be UNPACKED: " + zipFileName)
    fields = \
        [ ("filename", zipFileName)
        ]
    files = []
    (reqtype, reqdata) = TestUtils.encode_multipart_formdata(fields, files)
    TestUtils.doHTTP_POST(
        reqdata, reqtype, 
        resource="/" + siloName +"/items/"+ testDatasetName, 
        expect_status=201, expect_reason="Created")
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