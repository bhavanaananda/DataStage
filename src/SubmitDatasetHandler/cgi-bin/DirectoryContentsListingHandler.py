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
Directory Contents Listing handler lists all the directory contents - both files and sub-directories from ADMIRAL to the requesting module
"""
__author__ = "Bhavana Ananda"
__version__ = "0.1"

import cgi, sys, re, logging, os, os.path
sys.path.append("..")
sys.path.append("../..")

import SubmitDatasetUtils

try:
    import simplejson as json
except ImportError:
    import json as json

#from MiscLib.ScanFiles import CollectFiles #CollectWritableDirectories
from MiscLib.ScanDirectories import CollectDirectoryContents 
logger   =  logging.getLogger("DirectoryContentsListingHandler")
FilePat = re.compile("")


def processDirectoryListingRequest(formdata, srcdir, outputstr):
    """
    Generate a list of all directory contents - files and subdirectories in a specified directory,
    expressed relative to the supplied base directory, and write the result to the
    supplied output stream as as an HTTP application/JSON entity.
    
    srcdir      source directory containing files, directories and subdirectories
    outputstr   output stream to receive resulting JSON entity
    """
    
    datdir =  SubmitDatasetUtils.getFormParam("datdir",  formdata)
    datdir = "/home/" + datdir
    logger.debug(" datdir "+ datdir)

    outputstr.write("Content-type: application/JSON\n")
    outputstr.write("\n")      # end of MIME headers

    index = datdir.rindex('/')
    
    # basedir - base relative to which results are expressed
    basedir = datdir[:-(len(datdir)-index)]

    contents = CollectDirectoryContents(datdir, basedir, listFiles=True)
    json.dump(contents, outputstr, indent=4)

    return

if __name__ == "__main__":
    form = cgi.FieldStorage()   # Parse the query
    processDirectoryListingRequest(form, "/home/data", sys.stdout)

# End.
