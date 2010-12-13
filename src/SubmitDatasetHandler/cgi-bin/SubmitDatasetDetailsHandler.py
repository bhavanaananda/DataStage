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
Main CGI handler program for saving metadata.
"""
__author__ = "Bhavana Ananda"
__version__ = "0.1"

import cgi, sys, re, logging, os, os.path,traceback
from rdflib import URIRef
sys.path.append("..")
sys.path.append("../..")

import SubmitDatasetUtils
import ManifestRDFUtils
import HttpUtils
from MiscLib import TestUtils


save_stdout              = sys.stdout
dcterms                  =  URIRef("http://purl.org/dc/terms/")
oxds                     =  URIRef("http://vocab.ox.ac.uk/dataset/schema#") 
NamespaceDictionary      =  {
                               "dcterms"   : dcterms ,
                               "oxds"      : oxds                    
                            }
Logger                   =  logging.getLogger("SaveMetadata")
ElementCreatorUri        =  URIRef(dcterms + "creator")
ElementIdentifierUri     =  URIRef(dcterms + "identifier")
ElementTitleUri          =  URIRef(dcterms + "title")
ElementDescriptionUri    =  URIRef(dcterms + "description")

DefaultManifestName      =  "manifest.rdf"
BaseDir                  =  "/home/"

def submitMetadata(formdata, outputstr):
    """
    Process form data, and print (to stdout) a new HTML page reflecting
    the outcome of the request.
    
    formdata    is a dictionary containing parameters from the dataset submission form
    """
    userName             =  SubmitDatasetUtils.getFormParam("user"        ,  formdata)
    datasetName          =  SubmitDatasetUtils.getFormParam("datId"       ,  formdata)  
    title                =  SubmitDatasetUtils.getFormParam("title"       ,  formdata)  
    description          =  SubmitDatasetUtils.getFormParam("description" ,  formdata)  
    dirName              =  SubmitDatasetUtils.getFormParam("datDir"      ,  formdata)
    ElementUriList   =  [ElementIdentifierUri, ElementTitleUri, ElementDescriptionUri]
    ElementValueList =  [datasetName, title, description]

    if outputstr:
        sys.stdout = outputstr
    try:                             
        # Update the local manifest
        manifestFilePath     = dirName + str(os.path.sep) + DefaultManifestName
        Logger.debug("Element List = " + repr(ElementUriList))
        Logger.debug("Element Value List = " + repr(ElementValueList))
        updateMetadataInDirectoryBeforeSubmission(manifestFilePath, ElementUriList, ElementValueList)       
       
        # Redirect to the Submission Confirmation page
        redirectToSubmissionConfirmationPage(dirName);
        return
        
    except SubmitDatasetUtils.SubmitDatasetError, e:
        SubmitDatasetUtils.printHTMLHeaders()
        SubmitDatasetUtils.generateErrorResponsePageFromException(e) 

    except HttpUtils.HTTPUtilsError, e:
        SubmitDatasetUtils.printHTMLHeaders()
        SubmitDatasetUtils.generateErrorResponsePage(
            SubmitDatasetUtils.HTTP_ERROR,
            e.code, e.reason)
        SubmitDatasetUtils.printStackTrace()
        
    except:
        SubmitDatasetUtils.printHTMLHeaders()
        print "<h2>Server error while saving Metadata</h2>"
        print "<p>Diagnostic stack trace follows</p>"
        SubmitDatasetUtils.printStackTrace()
        raise
    
    finally:
        sys.stdout = save_stdout
    return

def redirectToSubmissionConfirmationPage(dirName):
    print "Status: 303 Meatadata saving successful"
    print "Location: ../../SubmitDatasetUI/html/SubmitDatasetConfirmation.html?dir="+dirName
    print


def updateMetadataInDirectoryBeforeSubmission(manifestFilePath, elementUriList, elementValueList) :
    """
    Update the metadata RDF with the form data obtained from the dataset submission tool.
    """
    Logger.debug("Manifest Path = " + manifestFilePath)
    inputDict    = ManifestRDFUtils.createDictionary(elementUriList, elementValueList)   
    if ManifestRDFUtils.ifFileExists(manifestFilePath):
        Logger.debug("Manifest File Exists... skipping creation!")
        manifestDict = ManifestRDFUtils.getDictionaryFromManifest(manifestFilePath, elementUriList) 
        if inputDict!= manifestDict:
            ManifestRDFUtils.updateManifestFile(manifestFilePath, elementUriList, elementValueList)   
    else:
        Logger.debug("Creating Manifest File...")
        ManifestRDFUtils.writeToManifestFile(manifestFilePath, NamespaceDictionary, elementUriList, elementValueList)     
    return

if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    form = cgi.FieldStorage()   # Parse the query
    os.chdir("/home/")           # Base directory for admiral server data
    submitMetadata(form, sys.stdout)

# End.
