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
Main CGI handler program for submitting data files from ADMIRAL to to stored as
an RDF Databank dataset.
"""
__author__ = "Bhavana Ananda"
__version__ = "0.1"

import cgi, sys, re, logging, os, os.path
sys.path.append("..")
sys.path.append("../..")

import SubmitDatasetUtils
import HttpUtils
from MiscLib import TestUtils

ZipMimeType  =  "application/zip"
FilePat      =  re.compile("^.*$(?<!\.zip)")
logger       =  logging.getLogger("SubmitDatasetHandler")

def processDatasetSubmissionForm(formdata, outputstr):
    """
    Process form data, and print (to stdout) a new HTML page reflecting
    the outcome of the request.
    
    formdata    is a dictionary containing parameters from the dataset submission form
    """
    siloName= "admiral-test"
    save_stdout = sys.stdout
    #print repr(formdata)
    if outputstr:
        sys.stdout = outputstr
  
    try:
        datasetName = SubmitDatasetUtils.getFormParam("datId",formdata)   
        dirName     = SubmitDatasetUtils.getFormParam("datDir",formdata)
        userName    = SubmitDatasetUtils.getFormParam("user",formdata)
        userPass    = SubmitDatasetUtils.getFormParam("pass", formdata)

        datIDPattern = re.compile("^[a-zA-Z0-9._:-]+$")
        matchedString = datIDPattern.match(datasetName)
        
        if matchedString==None:
            raise SubmitDatasetUtils.SubmitDatasetError(
                SubmitDatasetUtils.INPUT_ERROR,
                None,
                "Not a valid Dataset ID: '"+datasetName+"' supplied")

        if dirName.endswith('/'):
            raise SubmitDatasetUtils.SubmitDatasetError(
                SubmitDatasetUtils.INPUT_ERROR,
                None,
                "Expecting no trailing '/' on directory name: '"+dirName+"' supplied")
          
        zipFileName = os.path.basename(dirName) +".zip"
        zipFilePath = "/tmp/" + zipFileName
        logger.debug("datasetName %s, dirName %s, zipFileName %s"%(datasetName,dirName,zipFileName))

        #Check user credentiALS
        HttpUtils.setRequestUserPass(userName,userPass)
        # Creating a dataset
        SubmitDatasetUtils.createDataset(siloName, datasetName)
        # Zip the selected Directory
        SubmitDatasetUtils.zipLocalDirectory(dirName, FilePat, zipFilePath)
        # Submit zip file to dataset
        try:
            SubmitDatasetUtils.submitFileToDataset(siloName, datasetName, zipFilePath, ZipMimeType, zipFileName)
        finally:
            SubmitDatasetUtils.deleteLocalFile(zipFilePath)

        # Unzip the contents into a new dataset
        SubmitDatasetUtils.unzipRemoteFileToNewDataset(siloName, datasetName, zipFileName)
        print "Content-type: text/html"
        print                               # end of MIME headers

        print "<h2>Form parameters supplied</h2>"
        # print "<h3>Printing form dqata: " + str(formdata)+"</h3>"
        print "<dl>"
        print "<dt></dt><dd></dd>"
        for k in formdata:
            print "  <dt>%s</dt><dd>%s</dd>"%(k, formdata[k].value)
        print "</dl>"
    
        print "Dataset submission handler to be implemented here"

    except SubmitDatasetUtils.SubmitDatasetError, e:
        SubmitDatasetUtils.generateErrorResponsePageFromException(e)

    except HttpUtils.HTTPUtilsError, e:
        SubmitDatasetUtils.generateErrorResponsePage(
            SubmitDatasetUtils.HTTP_ERROR,
            e.code, e.reason)
        
    finally:
        sys.stdout = save_stdout

    return


if __name__ == "__main__":
    form = cgi.FieldStorage()   # Parse the query
    os.chdir("/home")           # Base directory for admiral server data
    processDatasetSubmissionForm(form, sys.stdout)

# End.
