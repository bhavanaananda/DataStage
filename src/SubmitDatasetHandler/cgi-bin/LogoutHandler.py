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
CGI handler to handle Admiral logout.
"""
__author__ = "Bhavana Ananda"
__version__ = "0.1"

import cgi, sys, re, logging, os, os.path,traceback

sys.path.append("..")
sys.path.append("../..")

import SubmitDatasetDetailsHandler
import SubmitDatasetUtils
import ManifestRDFUtils
import HttpUtils
from MiscLib import TestUtils

SuccessStatus            =  "You have successfully logged out of the ADMIRAL system. To login again please click here - <a href='../../../..'>Login<a>"
save_stdout              = sys.stdout
def processLogout(formdata, outputstr):
    """
    Process logout from the DMIRAl system
    
    formdata    is a dictionary containing parameters from the dataset submission form
    """
    if outputstr:
        sys.stdout = outputstr
    try:
        redirectToLogoutResponsePage(convertToUriString(SuccessStatus))
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
        print "<h2>Server error while processing dataset submission</h2>"
        print "<p>Diagnostic stack trace follows</p>"
        SubmitDatasetUtils.printStackTrace()
        raise
    
    finally:
        print "</body>"
        print "</html>"
        sys.stdout = save_stdout
        ###print "---- manifestFilePath "+manifestFilePath
        ###print "---- ElementValueList "+repr(ElementValueList)
    return


def convertToUriString(statusString):
    statusString = SuccessStatus.replace(" ", "%20")
    return statusString


def redirectToLogoutResponsePage(statusText):
    print "Status: 401 Unauthorized"
    #print "Status: 303 Dataset submission successful"
    print "Location: LogoutResponseHandler.py?status=%s" % (statusText)
    print

if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    form = cgi.FieldStorage()   # Parse the query
    os.chdir("/home/")           # Base directory for admiral server data
    processLogout(form, sys.stdout)

# End.
