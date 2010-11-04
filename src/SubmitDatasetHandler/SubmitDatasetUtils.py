#!/usr/bin/python
#
# Coypyright (C) 2010, University of Oxford
#
# Licensed under the MIT License.  You may obtain a copy of the License at:
#
#     http://www.opensource.org/licenses/mit-license.php
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# $Id: $

"""
Support functions for creating, unpacking and managing datsets in RDF Databank.
"""
__author__ = "Bhavana Ananda"
__version__ = "0.1"

import sys, logging, zipfile

#TODO: eliminate this
from MiscLib import TestUtils
from MiscLib.ScanFiles import *

logger =  logging.getLogger("SubmitDatasetUtils")
    
def createDataset(siloName, datasetName):
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


def submitFileToDataset(siloName, datasetName, fileName , mimeType):
    fields = []
    fileData = getFileContents(fileName)
    files = \
        [ ("file", fileName, fileData, mimeType) 
        ]
    (reqtype, reqdata) = TestUtils.encode_multipart_formdata(fields, files)
    TestUtils.doHTTP_POST(
        reqdata, reqtype, 
        resource = "/" + siloName + "/datasets/"+ datasetName, 
        expect_status=201, expect_reason="Created")     
    return


def submitZipFileToDataset(siloName, datasetName, zipFileName , mimeType):
    fields = []
    zipFileData = getZipFileContents(zipFileName)
    zipFiles = \
        [ ("file", zipFileName, zipFileData, mimeType) 
        ]
    (reqtype, reqdata) = TestUtils.encode_multipart_formdata(fields, zipFiles)
    TestUtils.doHTTP_POST(
        reqdata, reqtype, 
        resource = "/" + siloName + "/datasets/"+ datasetName, 
        expect_status=201, expect_reason="Created")     
    return


def deleteDataset(siloName, datasetName):      
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
          
def getDatasetsListFromSilo(siloName):
    datasetsListFromSilo = TestUtils.doHTTP_GET(
    resource="/" + siloName +"/datasets/", 
    expect_status=200, expect_reason="OK", expect_type="application/json")
    return datasetsListFromSilo


def getFileFromDataset(siloName, datasetName, fileName, mimeType):  
    readFileContent = TestUtils.doHTTP_GET(
            resource = "/" + siloName +"/datasets/" + datasetName + "/" + fileName,
            expect_status=200, expect_reason="OK", expect_type=mimeType)
    return readFileContent

def getZipFileContentFromDataset(siloName, datasetName, fileName, mimeType):  
    readZipFileContent = TestUtils.doHTTP_GET(
            resource = "/" + siloName +"/datasets/" + datasetName + "/" + fileName,
            expect_status=200, expect_reason="OK", expect_type=mimeType)
    return readZipFileContent

def getFileContents(fileName):
    fileContent = open(fileName).read()
    return fileContent
    
def getZipFileContents(zipFileName):
    zipFileContent = getFileContents(zipFileName)
    return zipFileContent

def ZipDirectory(dirName,testPat,zipFileName):
    # Write data directly to zip file
    # See O'Reilly Python Nutshell guide, p238
    def data_to_zip(z, name, data):
        import time
        zinfo = zipfile.ZipInfo(name, time.localtime()[:6])
        zinfo.external_attr = 0777 << 16L # Access control for created file
        z.writestr(zinfo, data)
        return
    files = CollectFiles(dirName,testPat)
    z = zipfile.ZipFile(zipFileName,'w')
    data_to_zip(z, "admiral-dataset", "This directory contains an ADMIRAL dataset\n")
    for i in files: 
        n = joinDirName(i[0], i[1])
        z.write(n)
    z.close()
    return zipFileName

def UnzipRemoteFileCreateNewDataset(zipFileName, siloName, testDatasetName):
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

# End.
