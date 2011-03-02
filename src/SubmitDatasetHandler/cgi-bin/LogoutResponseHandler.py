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

def logoutResponseForm(formdata, outputstr):
    """
    Print (to stdout) a new HTML page reflecting the outcome of the logout request.
    
    formdata    is a dictionary containing parameters from the logout handler 
    """
    status               =  SubmitDatasetUtils.getFormParam("status"  , formdata)  
   
    # print repr(formdata)

    if outputstr:
        sys.stdout = outputstr

        # Generate response headers
        print "Content-type: text/html"
        print "Cache-control: no-cache"
        print

        # Generate web page

        pageTemplate = ("""
            <html>
                <head>
                    <script type="text/javascript" src="../../jQuery/js/jquery-1.4.2.js"></script>                    
                </head>
                
                <body>
                    <div>
                        <span><a href="/"><img alt="site_logo" src="../../images/ADMIRALogo96x96.png" border="0"/></a></span>
                    </div>
                    <h2>%(status)s</h2>
                </body>
            </html>
            """)
        print (pageTemplate%
            { 
             'status'              : status
            })

    return

if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    form = cgi.FieldStorage()   # Parse the query
    os.chdir("/home/")           # Base directory for admiral server data
    logoutResponseForm(form, sys.stdout)


# End.
