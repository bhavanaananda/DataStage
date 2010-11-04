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
Low-level HTTP functions to support RESTful API operations 
"""

import logging
import httplib
import urlparse
import base64
import re

# Default SPARQL endpoint details
_endpointhost = "localhost"
_endpointpath = "/admiral-test"     # Really just a placeholder
_endpointuser = "admiral"
_endpointpass = "admiral"

logger = logging.getLogger('TestSubmitDataset')

__author__ = "Bhavana Ananada"
__version__ = "0.1"

# Originally copied from http://code.activestate.com/recipes/146306/:
def encode_multipart_formdata(fields, files):
    """
    fields is a sequence of (name, value) elements for regular form fields.
    files is a sequence of (name, filename, value, filetype) elements for data to be uploaded as files
    Return (content_type, body) ready for httplib.HTTP instance
    """
    BOUNDARY = '----------ThIs_Is_tHe_bouNdaRY_$'
    CRLF = '\r\n'
    L = []
    for (key, value) in fields:
        L.append('--' + BOUNDARY)
        L.append('Content-Disposition: form-data; name="%s"' % key)
        L.append('')
        L.append(value)
    for (key, filename, value, filetype) in files:
        L.append('--' + BOUNDARY)
        L.append('Content-Disposition: form-data; name="%s"; filename="%s"' % (key, filename))
        L.append('Content-Type: %s' % (filetype or get_content_type(filename)))
        L.append('')
        L.append(value)
    L.append('--' + BOUNDARY + '--')
    L.append('')
    body = CRLF.join(L)
    content_type = 'multipart/form-data; boundary=%s' % BOUNDARY
    return content_type, body
    
def setRequestEndPoint(endpointhost=None, endpointpath=None):
        if endpointhost or endpointpath:
            if endpointhost:
                _endpointhost = endpointhost
                # Reset credentials if setting host
                _endpointuser = None
                _endpointpass = None
            if endpointpath: _endpointpath = endpointpath
            #logging.getLogger.debug("setRequestEndPoint: endpointhost %s: " % _endpointhost)
            #logging.getLogger.debug("setRequestEndPoint: endpointpath %s: " % _endpointpath)
        return

def getRequestPath(rel):
        rel = rel or ""
        return urlparse.urljoin(_endpointpath,rel)

def getRequestUri(rel):
        return "http://"+_endpointhost+getRequestPath(rel)

def doRequest(command, resource, reqdata=None, reqheaders={}, expect_status=200, expect_reason="OK"):
        logger.debug(command+" "+getRequestUri(resource))
        logger.debug("In request: "+command+" "+getRequestUri(resource))
        if _endpointuser:
            auth = base64.encodestring("%s:%s" % (_endpointuser, _endpointpass)).strip()
            reqheaders["Authorization"] = "Basic %s" % auth
     
        hc   = httplib.HTTPConnection(_endpointhost)
        path = getRequestPath(resource)
        response     = None
        responsedata = None
        repeat       = 10
        while path and repeat > 0:
            repeat -= 1
            #print "Request "+command+", path "+path
            hc.request(command, path, reqdata, reqheaders)
            logger.debug(" Path  =" + path )
            response = hc.getresponse()
            if response.status != 301: break
            path = response.getheader('Location', None)
            #print "Redirect to: "+path
            if path[0:6] == "https:":
                # close old connection, create new HTTPS connection
                hc.close()
                hc = httplib.HTTPSConnection(_endpointhost)    # Assume same host for https:
            else:
                response.read()  # Seems to be needed to free up connection for new request
        logger.debug(" Response Status: %i %s" % (response.status, response.reason))
        logger.debug(" Expected Status: %i %s" % (expect_status, expect_reason))
        if expect_status != "*": assert response.status==expect_status, " Status: %i (Expected: %i)" % (response.status,expect_status )
        if expect_reason != "*": assert response.reason==expect_reason,"  Reason: %s (Expected: %s)" % (response.reason, expect_reason)
        responsedata = response.read()
        hc.close()
        return (response, responsedata)

def doHTTP_POST(data, data_type="application/octet-strem",
            endpointhost=None, endpointpath=None, resource=None,
            expect_status=200, expect_reason="OK",
            accept_type="*/*"):
        reqheaders   = {
            "Content-type": data_type,
            "Accept":       accept_type
            }
        setRequestEndPoint(endpointhost, endpointpath)
        (response, responsedata) = doRequest("POST", resource,
            reqdata=data, reqheaders=reqheaders,
            expect_status=expect_status, expect_reason=expect_reason)
        return responsedata

matchParams = re.compile(";.*")
def getResponseType(response):
        type = response.getheader("Content-type")
        if type:
            type = matchParams.sub("",type)
        else:
            type = "application/octet-stream"
        return type
    
def doHTTP_GET(endpointhost=None, endpointpath=None, resource=None,
            expect_status=200, expect_reason="OK",
            accept_type="*/*"):
        reqheaders   = {
            "Accept": accept_type
            }
        setRequestEndPoint(endpointhost, endpointpath)
        (response, responsedata) = doRequest("GET", resource, 
            reqheaders=reqheaders,
            expect_status=expect_status, expect_reason=expect_reason)
        responsetype = getResponseType(response)
        return (responsetype, responsedata)
    
def doHTTP_DELETE(
            endpointhost=None, endpointpath=None, resource=None,
            expect_status=200, expect_reason="OK"):
        setRequestEndPoint(endpointhost, endpointpath)
        (response, _) = doRequest("DELETE", resource,
            expect_status=expect_status, expect_reason=expect_reason)
        return response.status    

# End.
