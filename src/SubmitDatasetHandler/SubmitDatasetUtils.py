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

import sys, traceback, logging, zipfile, os.path, json

import HttpUtils
from MiscLib.ScanFiles import *

try:
    # Running Python 2.5 with simplejson?
    import simplejson as json
except ImportError:
    import json as json

logger =  logging.getLogger("SubmitDatasetUtils")

INPUT_ERROR ="INPUT ERROR"
HTTP_ERROR  ="HTTP REQUEST ERROR"

class SubmitDatasetError(Exception):
    def __init__(self, errType, errCode, errMsg):
        self._errType = errType
        self._errCode = errCode
        self._errMsg  = errMsg
        return

def generateErrorResponsePageFromException(e):
    generateErrorResponsePage(e._errType,e._errCode,e._errMsg)
    return

def generateErrorResponsePage(errType, errCode, errMsg):
    """
    Generate error response page
    
    errType    Type of error: [INPUT_ERROR]
    errCode    Error Code
        # (type, value, traceback) =  sys.exec_info()
        # The following take Sys arguments implicitly
        #  traceback.print_exc returns a file
        #  traceback.format_exc returns a string
    errorMsg   Error Message
    """
    print "<h2>"+errType+"</h2>"
    if errCode!=None:
        print str(errCode) + " : "
    if errMsg!=None:
        print errMsg
    return

def printStackTrace():
    print "<p>"
    print "Stack trace: <br\>"
    print "<pre>"
    print traceback.format_exc()
    print "</pre>"
    print "</p>"
    return

def getDatasetsListFromSilo(siloName):
    (responsetype, datasetsListFromSilo) = HttpUtils.doHTTP_GET(
        resource="/" + siloName +"/datasets/", 
        expect_status=200, expect_reason="OK", accept_type="application/json")
    assert responsetype.lower() == "application/json", "Expected application/json, got "+responsetype
    datasetsListFromSilo = json.loads(datasetsListFromSilo)
    return datasetsListFromSilo

def ifDatasetExists(siloName, datasetName):
    """
    Check if the dataset already exists.
    
    siloName    name of Databank silo in which the existence of dataset is being checked
    datasetName name of the dataset whose existence is being checked
    """
    # Check if the dataset exists in the databank silo
    datasetsFromSilo = getDatasetsListFromSilo(siloName)
    found = False
    for dataset in datasetsFromSilo:
        if dataset == datasetName :
            found = True
        
    return found

def createDataset(siloName, datasetName):
    """
    Create a new empty dataset.
    
    siloName    name of Databank silo in which dataset is created
    datasetName name for the new dataset 
    """
    #Check if the dataset already exists
    datasetFound = ifDatasetExists(siloName, datasetName+"-packed")    
    # Create a dataset if the dataset does not exist
    if not datasetFound: 
        logger.debug("createDataset: siloName %s, datasetName %s"%(siloName, datasetName))
        fields = \
            [ ("id", datasetName+"-packed")
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
    logger.debug("deleteDataset: siloName %s, datasetName %s"%(siloName, datasetName))
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
    logger.debug("submitFileToDataset: siloName %s, datasetName %s, fileName %s, targetName %s"%(siloName, datasetName+"-packed", fileName, targetName))
    assert os.path.basename(targetName) == targetName, "No directories allowed in targetName: "+targetName
    fields = []
    fileData = getLocalFileContents(fileName)
    files = \
        [ ("file", targetName, fileData, mimeType) 
        ]
    (reqtype, reqdata) = HttpUtils.encode_multipart_formdata(fields, files)
    HttpUtils.doHTTP_POST(
        reqdata, reqtype, 
        resource = "/" + siloName + "/datasets/"+ datasetName+"-packed", 
        expect_status=[201,204], expect_reason=["Created","No Content"])
    return

def unzipRemoteFileToNewDataset(siloName, datasetName, zipFileName):
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
    logger.debug("unzipRemoteFileToNewDataset: siloName %s, datasetName %s, zipFileName %s"%(siloName, datasetName, zipFileName))
    fields = \
        [ ("filename", zipFileName),
          ("id",datasetName )
        ]
    files = []
    (reqtype, reqdata) = HttpUtils.encode_multipart_formdata(fields, files)
    HttpUtils.doHTTP_POST(
        reqdata, reqtype, 
        resource="/" + siloName +"/items/"+ datasetName+"-packed", 
        expect_status=[200,201], expect_reason=["OK","Created"])
    return datasetName

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
    logger.debug("getFileFromDataset: siloName %s, datasetName %s, fileName %s"%(siloName, datasetName, fileName))
    readFileTypeContent = HttpUtils.doHTTP_GET(
            resource = "/" + siloName +"/datasets/" + datasetName + "/" + fileName,
            expect_status=200, expect_reason="OK")
    return readFileTypeContent

def getLocalFileContents(fileName):
    """
    Retrieve content of local file
    
    fileName    name of file to read
    """
    fileContent = open(fileName).read()
    return fileContent

def getFormParam(key,formdata):
    """
    Retrieve key value from formdata
    
    key      name of key whose value is to be read
    formdata formdata of the input page
    """
    if formdata.has_key(key): 
        return formdata[key].value
    return ""
        
def generateJson(rootDir, baseDir, subDirs):
    jsonObject = {'rootdir':rootDir,'basedir': baseDir,'subdirs':subDirs}
    #logger.debug(json.dumps(jsonString, separators=(',',':'),sort_keys=True, indent=4))
    print json.dumps(jsonObject, separators=(',',':'),sort_keys=True, indent=4)
    return json.dumps(jsonObject, separators=(',',':'),sort_keys=True, indent=4)


def deleteLocalFile(filePath):
    """
    Delete local file
    
    filePath    Path of the file to be deleted
    """
    os.remove(filePath)
    return 
    
def zipLocalDirectory(dirName,filePat,zipFileName):
    """
    Create a ZIP file from the contents of a local directory
    
    dirName     name of directory whose contents are scanned
    filePat     compiled regular expression matching filenames to be included
                in the ZIP file
    zipFileName name (in the local file system) of the ZIP file to be created
    """
    # Write data directly to zip file
    # See O'Reilly Python Nutshell guide, p238
    def data_to_zip(z, name, data):
        import time
        zinfo = zipfile.ZipInfo(name, time.localtime()[:6])
        zinfo.external_attr = 0777 << 16L # Access control for created file
        z.writestr(zinfo, data)
        return

    logger.debug("zipLocalDirectory: dirName %s, zipFileName %s"%(dirName, zipFileName))
    assert not dirName.endswith('/'), "Expecting no trailing '/' on directory name: "+dirName+" supplied"
    absDirName = os.path.abspath(dirName)
    (leadingPath,targetPath) = os.path.split(absDirName)
    logger.debug("leadingPath %s, targetPath %s"%(leadingPath,targetPath))
    z = zipfile.ZipFile(zipFileName,'w')
    # Create sentinel file to ensure non-empty ZIP file
    data_to_zip(z, "admiral-dataset.txt", "This directory contains an ADMIRAL dataset\n")
    # Now add files from the nominated directory
    files = CollectFiles(absDirName,filePat)
    for i in files: 
        fullname = joinDirName(i[0], i[1])
        relname  = fullname.replace(leadingPath+"/","",1)
        z.write(fullname, arcname=relname)
    z.close()
    return zipFileName

def printHTMLHeaders():
    # Generate error response headers
    print "Content-type: text/html"
    print "Cache-control: no-cache"
    print

    print "<html>"
    print "<body>"   
    return
# End.
