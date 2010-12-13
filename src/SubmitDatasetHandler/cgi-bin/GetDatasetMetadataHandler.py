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
Data submission Handler program for populating metadata for the requested dataset directory
"""
__author__ = "Bhavana Ananda"
__version__ = "0.1"

import cgi, sys, logging, os, os.path,traceback, rdflib
from rdflib.graph import Graph,URIRef

sys.path.append("..")
sys.path.append("../..")

import ManifestRDFUtils
import SubmitDatasetUtils
from MiscLib import TestUtils

try:
    # Running Python 2.5 with simplejson?
    import simplejson as json
except ImportError:
    import json as json
    
Logger                    =  logging.getLogger("GetDatasetMetadataHandler")
DefaultManifestName       =  "manifest.rdf"

dcterms                   =  URIRef("http://purl.org/dc/terms/")
oxds                      =  URIRef("http://vocab.ox.ac.uk/dataset/schema#") 

ElementCreatorUri         =  URIRef(dcterms + "creator")
ElementIdentifierUri      =  URIRef(dcterms + "identifier")
ElementTitleUri           =  URIRef(dcterms + "title")
ElementDescriptionUri     =  URIRef(dcterms + "description")
ElementUriList            =  [ElementCreatorUri, ElementIdentifierUri, ElementTitleUri, ElementDescriptionUri]
    

def getDatasetMetadata(formdata, manifestName ,outputstr):
    """
    Gets the metadata from the manifest.rdf file and formulates it into the JSON format.
    
    formdata    is a dictionary containing parameters from the dataset submission form
    """
    dirName      = SubmitDatasetUtils.getFormParam("directory",formdata)
    manifestPath = dirName  + str(os.path.sep) + manifestName
    Logger.debug("Manifest Path = " + manifestPath)
    outputstr.write("Content-type: application/JSON\n")
    outputstr.write("\n")      # end of MIME headers

    manifestDictionary = ManifestRDFUtils.getDictionaryFromManifest(manifestPath, ElementUriList)
    Logger.debug("Manifest Dictionary = " + repr(manifestDictionary))
    json.dump(manifestDictionary, outputstr, indent=4)

    Logger.debug("Manifest Dictionary = " + repr(manifestDictionary))
    return


if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    form = cgi.FieldStorage()   # Parse the query
    os.chdir("/home")           # Base directory for admiral server data
    
    getDatasetMetadata(form, DefaultManifestName, sys.stdout)

# End.
