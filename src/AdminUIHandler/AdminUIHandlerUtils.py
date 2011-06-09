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
Support functions for Admin UI Handler.
"""
__author__ = "Bhavana Ananda"
__version__ = "0.1"

import sys, traceback, logging, os.path

try:
    import json
except:
    import simplejson as json

from MiscLib.ScanFiles import *

try:
    # Running Python 2.5 with simplejson?
    import simplejson as json
except ImportError:
    import json as json

logger =  logging.getLogger("AdminUIHandlerUtils")

INPUT_ERROR ="INPUT ERROR"
HTTP_ERROR  ="HTTP REQUEST ERROR"

def printHTMLHeaders():
    # Generate error response headers
    print "Content-type: text/html"
    print "Cache-control: no-cache"
    print

    print "<html>"
    print "<body>"   
    return

def printStackTrace():
    print "<p>"
    print "Stack trace: <br\>"
    print "<pre>"
    print traceback.format_exc()
    print "</pre>"
    print "</p>"
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