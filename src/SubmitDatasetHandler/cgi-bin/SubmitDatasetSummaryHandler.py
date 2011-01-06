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
Main CGI program that handles response summary page after dataset submission to RDF Databank.
"""
__author__ = "Bhavana Ananda"
__version__ = "0.1"

import cgi, sys, os, logging

sys.path.append("..")
sys.path.append("../..")

import SubmitDatasetUtils

Logger                   =  logging.getLogger("SubmitDatasetSummaryHandler")

def datasetSummaryForm(formdata, outputstr):
    """
    Print (to stdout) a new HTML page reflecting the outcome of the request.
    
    formdata    is a dictionary containing parameters from the dataset submission form / handler
    """
    siloName             =  "admiral-test"
    save_stdout          =  sys.stdout
    dirName              =  SubmitDatasetUtils.getFormParam("dir"     , formdata)
    datasetName          =  SubmitDatasetUtils.getFormParam("id"      , formdata)
    datasetUnzippedName  =  SubmitDatasetUtils.getFormParam("unzipid" , formdata)
    status               =  SubmitDatasetUtils.getFormParam("status"  , formdata)  
   
    # print repr(formdata)

    if outputstr:
        sys.stdout = outputstr

        # Generate response headers
        print "Content-type: text/html"
        print "Cache-control: no-cache"
        print

        # Generate web page
        dataToolURL      =  "../../SubmitDatasetUI/html/SubmitDatasetDetails.html"                                 
        mainURL          =  "../../../.."
        resetURL         =  "../../SubmitDatasetUI/html/SubmitDatasetDetails.html?dir="+dirName
        viewDatasetURL   =  "../../DisplayDataset/html/DisplayDataset.html?dir="+ dirName + "#"+ datasetUnzippedName 

        pageTemplate = ("""
            <html>
                <head>
                    <script type="text/javascript" src="../../jQuery/js/jquery-1.4.2.js"></script>
                </head>
                
                <body>
                    <h2>%(status)s</h2>
                    <h3><a href="%(viewDatasetURL)s">View details of submitted ADMIRAL dataset - %(datasetUnzippedName)s</a></h3>
                    <h3><a href="%(resetURL)s" id="revised">Submit revised version of this dataset</a></h3>
                    <h3><a href="%(dataToolURL)s">Submit another ADMIRAL dataset to databank</a></h3>
                    <h3><a href="%(mainURL)s">Return to ADMIRAL front page</a></h3>
                </body>
            </html>
            """)
        print (pageTemplate%
            { 'viewDatasetURL'      : viewDatasetURL
            , 'datasetName'         : datasetName
            , 'dataToolURL'         : dataToolURL
            , 'mainURL'             : mainURL
            , 'datasetUnzippedName' : datasetUnzippedName
            , 'status'              : status
            , 'resetURL'            : resetURL               
            })

    return

if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    form = cgi.FieldStorage()   # Parse the query
    os.chdir("/home/")           # Base directory for admiral server data
    datasetSummaryForm(form, sys.stdout)

# End.
