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

Logger                   =  logging.getLogger("SubmitDatasetSummary")

def datasetSummaryForm(formdata, outputstr):
    """
    Print (to stdout) a new HTML page reflecting the outcome of the request.
    
    formdata    is a dictionary containing parameters from the dataset submission form / handler
    """
    siloName             =  "admiral-test"
    save_stdout          =  sys.stdout
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
        dataToolURL      =  "../../SubmitDatasetUI/html/SubmitDataset.html"                                 
        mainURL          =  "/data/index.html"
        viewDatasetURL   =  "../../DisplayDataset/html/DisplayDataset.html#" + datasetUnzippedName
        viewZippedURL    =  "/admiral-test/datasets/" + datasetName
        viewUnzippedURL  =  "/admiral-test/datasets/" + datasetUnzippedName

        pageTemplate = ("""
            <html>
                <head>
                    <script type="text/javascript" src="../../jQuery/js/jquery-1.4.2.js"></script>
                </head>
                
                <body>
                    <h2>%(status)s</h2>
                    <h3><a href="%(viewDatasetURL)s">View submitted dataset (%(datasetUnzippedName)s)</a></h3>
                    <h3><a href="%(dataToolURL)s">Submit another dataset</a></h3>
                    <h3><a href="%(mainURL)s">Back to front page</a></h3>
                    <p>View Data in Dataset: %(datasetName)s - <a href="%(viewZippedURL)s">packaged data</a></p>
                    <p>View Data in Dataset: %(datasetUnzippedName)s - <a href="%(viewUnzippedURL)s">original data</a></p>
                </body>
            </html>
            """)
        print (pageTemplate%
            { 'viewDatasetURL'      : viewDatasetURL
            , 'datasetName'         : datasetName
            , 'dataToolURL'         : dataToolURL
            , 'mainURL'             : mainURL
            , 'viewZippedURL'       : viewZippedURL
            , 'datasetUnzippedName' : datasetUnzippedName
            , 'viewUnzippedURL'     : viewUnzippedURL
            , 'status'              : status               
            })

    return

if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    form = cgi.FieldStorage()   # Parse the query
    os.chdir("/home/")           # Base directory for admiral server data
    datasetSummaryForm(form, sys.stdout)

# End.
