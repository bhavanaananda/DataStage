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

import HttpUtils
from MiscLib.ScanFiles import *

try:
    # Running Python 2.5 with simplejson?
    import simplejson as json
except ImportError:
    import json as json

logger =  logging.getLogger("SubmitDatasetUtils")

def getDatasetsListFromSilo(siloName):
    (responsetype, datasetsListFromSilo) = HttpUtils.doHTTP_GET(
        resource="/" + siloName +"/datasets/", 
        expect_status=200, expect_reason="OK", accept_type="application/json")
    assert responsetype.lower() == "application/json", "Expected application/json, got "+responsetype
    datasetsListFromSilo = json.loads(datasetsListFromSilo)
    return datasetsListFromSilo

def createDataset(siloName, datasetName):
    """
    Create a new empty dataset.
    
    siloName    name of Databank silo in which dataset is created
    datasetName name for the new dataset 
    """
    fields = \
        [ ("id", datasetName)
        ]
    files =[]
    (reqtype, reqdata) = HttpUtils.encode_multipart_formdata(fields, files)
    HttpUtils.doHTTP_POST(
        reqdata, reqtype, 
        resource = "/" + siloName + "/datasets/", 
        expect_status=201, expect_reason="Created")
    return

def deleteDataset(siloName, datasetName):      
    """
    Delete a dataset.
    
    siloName    name of Databank silo containing the dataset
    datasetName name of the dataset 
    """
    HttpUtils.doHTTP_DELETE(
        resource = "/" + siloName + "/datasets/" + datasetName, 
        expect_status=200, expect_reason="OK")
    return

def submitFileToDataset(siloName, datasetName, fileName, mimeType, targetName):
    """
    Submit a single file to a dataset, creating a new resource in the dataset.

    siloName    name of Databank silo containing the dataset
    datasetName name of the dataset 
    fileName    filename of local file to be submitted
    mimeType    MIME content type of file data to be submitted
    targetName  file path and name to be used for storage in Databank dataset
    """
    fields = []
    fileData = getLocalFileContents(fileName)
    files = \
        [ ("file", targetName, fileData, mimeType) 
        ]
    (reqtype, reqdata) = HttpUtils.encode_multipart_formdata(fields, files)
    HttpUtils.doHTTP_POST(
        reqdata, reqtype, 
        resource = "/" + siloName + "/datasets/"+ datasetName, 
        expect_status=201, expect_reason="Created")     
    return

def unzipRemoteFileToNewDataset(siloName, testDatasetName, zipFileName):
    """
    Unzip a ZIP file in one dataset, creating a new dataset with the contents
    of the ZIP file.
    
    The name of the target dataset is derived from the source dataset name and
    the ZIP file name.

    siloName    name of Databank silo
    datasetName name of the source dataset 
    zipFileName name of the ZIP file in the source dataset.

    Returns the name of the created dataset.
    """
    logger.debug("Zip file name to be UNPACKED: " + zipFileName)
    fields = \
        [ ("filename", zipFileName)
        ]
    files = []
    (reqtype, reqdata) = HttpUtils.encode_multipart_formdata(fields, files)
    HttpUtils.doHTTP_POST(
        reqdata, reqtype, 
        resource="/" + siloName +"/items/"+ testDatasetName, 
        expect_status=201, expect_reason="Created")
    return testDatasetName+"-"+zipFileName[:-4]

def getFileFromDataset(siloName, datasetName, fileName):  
    """
    Retrieve a file from a dataset, returning the file's MIME content type
    and the file content.

    siloName    name of Databank silo
    datasetName name of the dataset 
    fileName    name of a file within the dataset to retrieve

    Returns a tuple (type,content), where type is a string containing the MIME
    content-type of the data, and content is a byte array (i.e. a string in python 2) 
    containing the file content.
    """
    readFileTypeContent = HttpUtils.doHTTP_GET(
            resource = "/" + siloName +"/datasets/" + datasetName + "/" + fileName,
            expect_status=200, expect_reason="OK")
    return readFileTypeContent

def getLocalFileContents(fileName):
    fileContent = open(fileName).read()
    return fileContent

def zipLocalDirectory(dirName,testPat,zipFileName):
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

# End.
