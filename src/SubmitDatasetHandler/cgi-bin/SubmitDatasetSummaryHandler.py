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

Logger = logging.getLogger("SubmitDatasetSummaryHandler")

def datasetSummaryForm(formdata, outputstr):
    """
    Print (to stdout) a new HTML page reflecting the outcome of the request.
    
    formdata    is a dictionary containing parameters from the dataset submission form / handler
    """
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
        resetURL         =  "../../SubmitDatasetUI/html/SubmitDatasetDetails.html?dir=" + dirName
        loadDatasetURL   =  "'../../DisplayDataset/html/DisplayDataset.html?dir=" + dirName + "#"+ datasetUnzippedName +" #outherMain"+"'"
        viewDatasetURL   =  "'../../DisplayDataset/html/DisplayDataset.html?dir=" + dirName + "#"+ datasetUnzippedName +"'"
        unpackedLink     =  "/databanksilo/datasets/" + datasetUnzippedName
        
        pageTemplate = ("""
            <html>
                <head>
                    <!-- Import Stylesheets -->
                    <link rel="stylesheet" href="../../DisplayDataset/css/DisplayDataset.css" type="text/css" />
                    <link rel="stylesheet" href="../../jQuery/jquery-treeview/jquery.treeview.css" type="text/css" />    
                    <link rel="stylesheet" href="../../SelectDataset/css/SelectDataset.css" type="text/css" />      
                    
                    <!-- Import jQuery framework -->
                    <script type="text/javascript" src="../../jQuery/js/jquery-1.4.2.js"></script>
                    
                    <!-- Import jQuery additional libraries -->
                    <script type="text/javascript" src="../../jQuery/jquery.json-2.2.js"></script> 
                    
                    <!-- Import treeview plugin -->                
                    <script type="text/javascript" src="../../jQuery/jquery-treeview/jquery.treeview.js"></script>
                    
                    <!-- import rdfquery libraries -->
                    <script type="text/javascript" src="../../rdfquery/jquery.uri.js"></script>
                    <script type="text/javascript" src="../../rdfquery/jquery.xmlns.js"></script>
                    <script type="text/javascript" src="../../rdfquery/jquery.curie.js"></script>
                    <script type="text/javascript" src="../../rdfquery/jquery.datatype.js"></script>
                    <script type="text/javascript" src="../../rdfquery/jquery.rdf.js"></script>
                    <script type="text/javascript" src="../../rdfquery/jquery.rdfa.js"></script>
                    <script type="text/javascript" src="../../rdfquery/jquery.datatype.js"></script>
                    <script type="text/javascript" src="../../rdfquery/jquery.rdf.xml.js"></script>
                    <script type="text/javascript" src="../../rdfquery/jquery.rdf.turtle.js"></script>        
                           
                    <!-- Import MochiKit modules: require MochiKit library functions to be fully qualified -->
                    <script type="text/javascript">MochiKit = {__export__: false};</script>
                    <script type="text/javascript" src="../../MochiKit/Base.js"></script>
                    <script type="text/javascript" src="../../MochiKit/Iter.js"></script>
                    <script type="text/javascript" src="../../MochiKit/Logging.js"></script>
                    
                    <!-- Import Admiral functions -->
                    <script type="text/javascript" src="../../Admiral/admiral-base.js"></script>
                    <script type="text/javascript" src="../../Admiral/Error.js"></script>
                    <script type="text/javascript" src="../../Admiral/AsyncComputation.js"></script>
                    
                    <!-- Import generic code from the dataset utils package -->
                    <script type="text/javascript" src="../../DatasetUtils/js/DatasetTree.js"></script>
                    <script type="text/javascript" src="../../DatasetUtils/js/DatasetManifestDictionary.js"></script>

                    <!-- Import dataset information display code -->
                    <script type="text/javascript" src="../../DisplayDataset/DisplayDatasetTree.js"></script>
                    <script type="text/javascript" src="../../DisplayDataset/DisplayDataset.js"></script>
                    
                    <!--  Import admiral configuration details -->
                    <!--  NOTE: these are loaded from an absolute location in the web server -->
                    <script type="text/javascript" src="/js/admiral-config.js"></script>
                    
                    <script>
                        jQuery(document).ready( function ()
                        {   var m = new admiral.AsyncComputation();
                            /* m.eval(function(val,callback)
                            { var datasetName = "%(datasetUnzippedName)s";
                              var datasetPath = "/"+admiral.databanksilo+"/datasets/"+datasetName;
                              admiral.datasetManifestDictionary(datasetPath,datasetName, callback);   
                            }); 
                            m.eval(function(datasetdetails,callback)                          
                            {                                                 
                               jQuery("#currentVersion").text(datasetdetails.currentVersion);
                               jQuery("#lastModified").text(datasetdetails.lastModified);   
                               callback(datasetdetails);                         
                            });  */
                            m.eval(function(val,callback)                          
                            {  
                               jQuery('#displayDatasetPage').load(%(loadDatasetURL)s , function(){}); 
                               callback(val);
                            });
                            m.eval(function(val,callback)                          
                            {  url=%(viewDatasetURL)s;
                               admiral.loadDisplay(url);
                               callback(val);
                            });
                            m.exec(null,admiral.noop);
                                          
                        });                      
                    </script>
                </head>
                
                <body>
                    <h2>%(status)s   
                           <span><a href="%(unpackedLink)s"><img name="databank_logo" id="databank_logo" alt="databank_logo" src="http://databank.ora.ox.ac.uk/static/databank_logo_generic.png" /></a></span>
                    </h2>
                    <div id="displayDatasetPage"> </div> 
                    <!-- 
                        <table name="submissionStatus" id = "submissionStatus" >
                          <tr><td>Dataset Identifier</td><td> %(datasetUnzippedName)s</td></tr>
                          <tr><td>Version number</td><td><span id="currentVersion">nn</span></td></tr>
                          <tr><td>Date</td><td><span id="lastModified">yyyy-mm-dd</span></td></tr>
                        </table>
                        <h4><a href="%(viewDatasetURL)s">View details of submitted ADMIRAL data package - %(datasetUnzippedName)s</a></h4> 
                    -->
                    <h4><a href="%(unpackedLink)s">View the data package</a></h4>
                    <h4><a href="%(resetURL)s" id="revised">Submit a revised version of this data package</a></h4>
                    <h4><a href="%(dataToolURL)s">Submit another ADMIRAL data package to databank</a></h4>
                    <h4><a href="%(mainURL)s">Return to your research group's ADMIRAL front page</a></h4>
                </body>
            </html>
            """)
        print (pageTemplate%
            { 'viewDatasetURL'      : viewDatasetURL
            , 'loadDatasetURL'      : loadDatasetURL 
            , 'unpackedLink'        : unpackedLink  
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
