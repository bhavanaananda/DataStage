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
Directory Lisiting handler thats lists all directories from ADMIRAL to the requesting module
"""
__author__ = "Bhavana Ananda"
__version__ = "0.1"

import cgi, sys, re, logging, os, os.path
sys.path.append("..")
sys.path.append("../..")

try:
    # Running Python 2.5 with simplejson?
    import simplejson as json
except ImportError:
    import json as json

from MiscLib.ScanDirectories import CollectWritableDirectories

logger =  logging.getLogger("DirectoryListingHandler")

def processDirectoryListingRequest(srcdir, basedir, outputstr):
    """
    Generate a list of all directories and subdirectories in a specified directory,
    expressed relative to the supplied base directory, and write the result to the
    supplied output stream as as an HTTP application/JSON entity.
    
    srcdir      source directory containing directories and subdirectories
    basedir     base relative to which results are expressed
    outputstr   output stream to receive resulting JSON entity
    """

    outputstr.write("Content-type: application/JSON\n")
    outputstr.write("\n")      # end of MIME headers

    #CollectDirectories
    dirs = CollectWritableDirectories(srcdir, basedir)

    #result = json.dumps(dirs)
    #outputstr.write(result)

    json.dump(dirs, outputstr, indent=4)

    return

if __name__ == "__main__":
    processDirectoryListingRequest("/home/data", "/home", sys.stdout)

# End.
