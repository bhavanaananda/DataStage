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

import cgi, sys, re, logging, os, os.path,traceback
sys.path.append("..")
sys.path.append("../..")

import SubmitDatasetUtils
import ManifestRDFUtils
import HttpUtils
from MiscLib import TestUtils

ZipMimeType          =  "application/zip"
FilePat              =  re.compile("^.*$(?<!\.zip)")
Logger               =  logging.getLogger("SubmitDatasetHandler")

ElementCreator       =  "creator"
ElementIdentifier    =  "identifier"
ElementTitle         =  "title"
ElementDescription   =  "description"
ElementList          =  [ElementCreator,ElementIdentifier,ElementTitle,ElementDescription]
#TODO...
#??? ElementKeyList       =  []  # Element dictionary keys 
ElementUriList       =  []  # Element property URIs

DefaultManifestName  = "manifest.rdf"
BaseDir              =  "/home/"


def processDatasetSubmissionForm(formdata, outputstr):
    """
    Process form data, and print (to stdout) a new HTML page reflecting
    the outcome of the request.
    
    formdata    is a dictionary containing parameters from the dataset submission form
    """
    siloName             = "admiral-test"
    save_stdout          = sys.stdout

    userName             =  SubmitDatasetUtils.getFormParam("user",formdata)
    userPass             =  SubmitDatasetUtils.getFormParam("pass", formdata)
    datasetName          =  SubmitDatasetUtils.getFormParam("datId",formdata)  
    title                =  SubmitDatasetUtils.getFormParam("title",formdata)  
    description          =  SubmitDatasetUtils.getFormParam("description",formdata)  
    dirName              =  SubmitDatasetUtils.getFormParam("datDir",formdata)
    ElementValueList     =  [userName, datasetName, title, description]
    
    # print repr(formdata)

    if outputstr:
        sys.stdout = outputstr
    try:    
        # Generate response headers
        print "Content-type: text/html"
        print "Cache-control: no-cache"
        print

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
 
        # Set user credentials       
        HttpUtils.setRequestUserPass(userName,userPass)
        
        # Check if the dataset already exists
        datasetFound = SubmitDatasetUtils.ifDatasetExists(siloName, datasetName)
        
        # Create a dataset if the dataset does not exist
        if not datasetFound:              
            SubmitDatasetUtils.createDataset(siloName, datasetName)
                             
        # Update the local manifest
        manifestFilePath     = dirName + str(os.path.sep) + DefaultManifestName
        Logger.debug("Element List = " + repr(ElementList))
        Logger.debug("Element Value List = " + repr(ElementValueList))
        updateMetadataInDirectoryBeforeSubmission(manifestFilePath, ElementList, ElementValueList)
        
        # Zip the selected Directory
        zipFileName = os.path.basename(dirName) +".zip"
        zipFilePath = "/tmp/" + zipFileName
        Logger.debug("datasetName %s, dirName %s, zipFileName %s"%(datasetName,dirName,zipFileName))
        SubmitDatasetUtils.zipLocalDirectory(dirName, FilePat, zipFilePath)
        # Submit zip file to dataset
        try:
            SubmitDatasetUtils.submitFileToDataset(siloName, datasetName, zipFilePath, ZipMimeType, zipFileName)
        finally:
            SubmitDatasetUtils.deleteLocalFile(zipFilePath)

        # Unzip the contents into a new dataset
        datasetUnzippedName = SubmitDatasetUtils.unzipRemoteFileToNewDataset(siloName, datasetName, zipFileName)

#        print "Status: 303 Dataset submission successful"
#        print "Location: SubmitDatasetSummary.py?id=%s&zipid=%s&status=%s"%(
#                    datasetUnzippedName,
#                    datasetName,
#                    "submission%20successful"
#                    )
#        print
#        print "Dataset submission suceeded"
#        return

        # Generate web page
        dataToolURL = "../../SubmitDatasetUI/html/SubmitDataset.html"                                 
        mainURL = "http://zoo-admiral-devel.zoo.ox.ac.uk"
        viewDatasetURL = "../../DisplayDataset/html/DisplayDataset.html#" + datasetUnzippedName
        viewZippedURL = "/admiral-test/datasets/" + datasetName
        viewUnzippedURL = "/admiral-test/datasets/" + datasetUnzippedName

        pageTemplate = ("""
            <html>
                <head>
                    <script type="text/javascript" src="../../jQuery/js/jquery-1.4.2.js"></script>
                </head>
                
                <body>
                    <h2>Dataset submission successful</h2>
                    <h3><a href="%(viewDatasetURL)s">View submitted dataset (%(datasetUnzippedName)s)</a></h3>
                    <h3><a href="%(dataToolURL)s">Submit another dataset</a></h3>
                    <h3><a href="%(mainURL)s">Back to front page</a></h3>
                    <p>View Data in Dataset: %(datasetName)s - <a href="%(viewZippedURL)s">packaged data</a></p>
                    <p>View Data in Dataset: %(datasetUnzippedName)s - <a href="%(viewUnzippedURL)s">original data</a></p>
                </body>
            </html>
            """)
        print (pageTemplate%
            { 'viewDatasetURL':         viewDatasetURL
            , 'datasetName':            datasetName
            , 'dataToolURL':            dataToolURL
            , 'mainURL':                mainURL
            , 'viewZippedURL':          viewZippedURL
            , 'datasetUnzippedName':    datasetUnzippedName
            , 'viewUnzippedURL':        viewUnzippedURL
            })

    except SubmitDatasetUtils.SubmitDatasetError, e:
        SubmitDatasetUtils.generateErrorResponsePageFromException(e) 

    except HttpUtils.HTTPUtilsError, e:
        SubmitDatasetUtils.generateErrorResponsePage(
            SubmitDatasetUtils.HTTP_ERROR,
            e.code, e.reason)
        SubmitDatasetUtils.printStackTrace()
        
    except:
        print "<h2>Server error while processing dataset submission</h2>"
        print "<p>Diagnostic stack trace follows</p>"
        SubmitDatasetUtils.printStackTrace()
        raise
    
    finally:
        sys.stdout = save_stdout

    return

def updateMetadataInDirectoryBeforeSubmission(manifestFilePath, elementList, elementValueList) :
    """
    Update the metadata RDF with the form data obtained from the dataset submission tool.
    """
    Logger.debug("Manifest Path = " + manifestFilePath)
    inputDict    = ManifestRDFUtils.createDictionary(elementList, elementValueList)   
    if ManifestRDFUtils.ifFileExists(manifestFilePath):
        Logger.debug("Manifest File Exists... skipping creation!")
        manifestDict = ManifestRDFUtils.getDictionaryFromManifest(manifestFilePath, elementList) 
        if inputDict!= manifestDict:
            ManifestRDFUtils.updateManifestFile(manifestFilePath, elementList, elementValueList)   
    else:
        Logger.debug("Creating Manifest File...")
        ManifestRDFUtils.writeToManifestFile(manifestFilePath, elementList, elementValueList)     
    return

if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    form = cgi.FieldStorage()   # Parse the query
    os.chdir("/home/")           # Base directory for admiral server data
    processDatasetSubmissionForm(form, sys.stdout)

# End.
