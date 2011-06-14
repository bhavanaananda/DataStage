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
Main CGI handler program for submitting data files from ADMIRAL to be stored as
an RDF Databank dataset.
"""
__author__ = "Bhavana Ananda"
__version__ = "0.1"

import cgi, sys, re, logging, os, os.path,traceback
from rdflib import URIRef
sys.path.append("..")
sys.path.append("../..")

import SubmitDatasetDetailsHandler
import SubmitDatasetUtils
import ManifestRDFUtils
import HttpSession
from MiscLib import TestUtils

siloProxyPath            = "/databanksilo/" 
save_stdout              = sys.stdout
dcterms                  =  URIRef("http://purl.org/dc/terms/")
oxds                     =  URIRef("http://vocab.ox.ac.uk/dataset/schema#") 
NamespaceDictionary      =  {
                               "dcterms"   : dcterms ,
                               "oxds"      : oxds                    
                            }
ZipMimeType              =  "application/zip"
FilePat                  =  re.compile("^.*$(?<!\.zip)")
Logger                   =  logging.getLogger("SubmitDatasetConfirmationHandler")
ElementCreatorUri        =  URIRef(dcterms + "creator")
ElementIdentifierUri     =  URIRef(dcterms + "identifier")
ElementTitleUri          =  URIRef(dcterms + "title")
ElementDescriptionUri    =  URIRef(dcterms + "description")
ElementUriList           =  [ElementCreatorUri, ElementIdentifierUri, ElementTitleUri, ElementDescriptionUri]
DefaultManifestName      =  "manifest.rdf"
BaseDir                  =  "/home/"
SuccessStatus            =  "Congratulations! Your data package submission to Oxford DataBank was successful"

def processDatasetSubmissionForm(formdata, outputstr):
    """
    Process form data, and print (to stdout) a new HTML page reflecting
    the outcome of the request.
    
    formdata    is a dictionary containing parameters from the dataset submission form
    """
    userName             =  SubmitDatasetUtils.getFormParam("user"        ,  formdata)
    userPass             =  SubmitDatasetUtils.getFormParam("pass"        ,  formdata)
    endpointhost         =  SubmitDatasetUtils.getFormParam("endpointhost",  formdata)
    basepath             =  SubmitDatasetUtils.getFormParam("basepath"    ,  formdata) 
    datasetName          =  SubmitDatasetUtils.getFormParam("datId"       ,  formdata)  
    title                =  SubmitDatasetUtils.getFormParam("title"       ,  formdata)  
    description          =  SubmitDatasetUtils.getFormParam("description" ,  formdata)  
    dirName              =  SubmitDatasetUtils.getFormParam("datDir"      ,  formdata)
    ElementValueList     =  [userName, datasetName, title, description]

    # Host and silo name in the form data are used for testing.
    # In a live system, these are not provided in the form: the following values are used.
    if endpointhost==None or endpointhost=="":
        endpointhost = "localhost"
    if basepath==None or basepath=="":
        basepath = siloProxyPath

    ###print("\n---- processDatasetSubmissionForm:formdata ---- \n"+repr(formdata))
  
    # Zip the selected Directory
    zipFileName = os.path.basename(dirName) +".zip"
    zipFilePath = "/tmp/" + zipFileName
    Logger.debug("zipFilePath = "+zipFilePath)

    if outputstr:
        sys.stdout = outputstr
    try:    
        # Validate the dataset name and dataset directory fields
        validateFields(dirName, datasetName)
        
        # Set user credentials       
        #session.setRequestUserPass(userName,userPass)  
         
        #Create Session
        session  = HttpSession.makeHttpSession(endpointhost, basepath, userName, userPass)   
                   
        SubmitDatasetUtils.createDataset(session, datasetName)                             
        # Update the local manifest
        manifestFilePath     = dirName + str(os.path.sep) + DefaultManifestName
        Logger.debug("Element List = " + repr(ElementUriList))
        Logger.debug("Element Value List = " + repr(ElementValueList))
        SubmitDatasetDetailsHandler.updateMetadataInDirectoryBeforeSubmission(manifestFilePath, ElementUriList, ElementValueList)       

        #Logger.debug("datasetName %s, dirName %s, zipFileName %s"%(datasetName,dirName,zipFileName))
        SubmitDatasetUtils.zipLocalDirectory(dirName, FilePat, zipFilePath)
        # Submit zip file to dataset
        SubmitDatasetUtils.submitFileToDataset(session, datasetName, zipFileName, zipFilePath, ZipMimeType, zipFileName)
        # Unzip the contents into a new dataset
        datasetUnzippedName = SubmitDatasetUtils.unzipRemoteFileToNewDataset(session, datasetName, zipFileName)       
        # Redirect to the Dataset Summary page
        redirectToSubmissionSummaryPage(dirName, datasetName+"-packed", datasetUnzippedName, convertToUriString(SuccessStatus))
        return
        
    except SubmitDatasetUtils.SubmitDatasetError, e:
        SubmitDatasetUtils.printHTMLHeaders()
        SubmitDatasetUtils.generateErrorResponsePageFromException(e) 

    except session.HTTPSessionError, e:
        SubmitDatasetUtils.printHTMLHeaders()
        SubmitDatasetUtils.generateErrorResponsePage(
            SubmitDatasetUtils.HTTP_ERROR,
            e.code, e.reason)
        SubmitDatasetUtils.printStackTrace()
        
    except:
        SubmitDatasetUtils.printHTMLHeaders()
        print "<h2>Server error while processing dataset submission</h2>"
        print "<p>Diagnostic stack trace follows</p>"
        SubmitDatasetUtils.printStackTrace()
        raise
    
    finally:
        print "</body>"
        print "</html>"
        Logger.debug("zipFilePath = "+zipFilePath)
        SubmitDatasetUtils.deleteLocalFile(zipFilePath)# Delete the local zip file after submission
        sys.stdout = save_stdout
        ###print "---- manifestFilePath "+manifestFilePath
        ###print "---- ElementValueList "+repr(ElementValueList)
    return

def validateFields(datasetDirectoryName, datasetName):
    datIDPattern = re.compile("^[a-zA-Z0-9._:-]+$")
    matchedString = datIDPattern.match(datasetName)
    
    if matchedString==None:
        raise SubmitDatasetUtils.SubmitDatasetError(
            SubmitDatasetUtils.INPUT_ERROR,
            None,
            "Not a valid Dataset ID: '"+datasetName+"' supplied")

    if datasetDirectoryName.endswith('/'):
        raise SubmitDatasetUtils.SubmitDatasetError(
            SubmitDatasetUtils.INPUT_ERROR,
            None,
            "Expecting no trailing '/' on directory name: '"+datasetDirectoryName+"' supplied")
    return

def convertToUriString(statusString):
    statusString = SuccessStatus.replace(" ", "%20")
    return statusString

def redirectToSubmissionSummaryPage(dirName, datasetName, datasetUnzippedName, statusText):
    print "Status: 303 Dataset submission successful"
    print "Location: SubmitDatasetSummaryHandler.py?dir=%s&id=%s&unzipid=%s&status=%s" % (dirName,datasetName,datasetUnzippedName, statusText)
    print

if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    form = cgi.FieldStorage()   # Parse the query
    os.chdir("/home/")           # Base directory for admiral server data
    processDatasetSubmissionForm(form, sys.stdout)

# End.
