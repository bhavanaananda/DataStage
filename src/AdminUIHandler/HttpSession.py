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

logger = logging.getLogger('HTTPSession')

__author__ = "Bhavana Ananda"
__version__ = "0.1"

class Session:
    class HTTPSessionError(Exception):
        def __init__(self, code, reason):
            self.code   = code
            self.reason = reason
            return
    
        def __str__(self):
            return "HTTPSessionError(%i,%s)"%(self.code,self.reason)
    
    # Originally copied from http://code.activestate.com/recipes/146306/:
    def encode_multipart_formdata(self, fields, files):
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
    
    # Factory function
    
    # Class definition
    
    # Class __init__ method
    
    # Other class methods per test suite
    
    
    
    
    ### .....................    
        
    def setRequestEndPoint(self, endpointhost=None, endpointpath=None):
        #global _endpointhost, _endpointpath
        logger.debug("setRequestEndPoint: endpointhost %s, endpointpath: %s " % (endpointhost,endpointpath))
        if endpointhost or endpointpath:
            if endpointhost:
                self._endpointhost = endpointhost
                # Reset credentials if setting host
                #                _endpointuser = None
                #                _endpointpass = None
            if endpointpath: self._endpointpath = endpointpath
            #logger.debug("setRequestEndPoint: endpointhost %s " % self._endpointhost)
            #logger.debug("setRequestEndPoint: endpointpath %s " % self._endpointpath)
        return
    
    def setRequestUserPass(self, endpointuser=None, endpointpass=None):
        #global _endpointuser, _endpointpass
        logger.debug("setRequestUserPass: endpointuser %s: " % endpointuser)
        logger.debug("setRequestUserPass: endpointpass %s: " % endpointpass)
        if endpointuser:
            self._endpointuser = endpointuser
            self._endpointpass = endpointpass
        else:
            self._endpointuser = None
            self._endpointpass = None
        return
    
    def getRequestPath(self,rel):
            rel = rel or ""
            path = urlparse.urljoin(self._endpointpath,rel)
            logger.debug("getRequestPath: rel %s, path %s " % (rel, path))
            return path
    
    def getRequestUri(self,rel):
            return "http://"+self._endpointhost+self.getRequestPath(rel)
    
    def expectedReturnStatus(self,expected, actual):
        return ( (expected == "*") or
                 (isinstance(expected,int)  and actual == expected) or
                 (isinstance(expected,list) and actual in expected) )
    
    def expectedReturnReason(self,expected, actual):
        return ( (expected == "*") or
                 (isinstance(expected,str)  and actual == expected) or
                 (isinstance(expected,list) and actual in expected) )
    
    def doRequest(self,command, resource, reqdata=None, reqheaders={}, expect_status=200, expect_reason="OK"):
            logger.debug(command+" "+self.getRequestUri(resource))
            logger.debug("In request: "+command+" "+self.getRequestUri(resource))
            if self._endpointuser:
                auth = base64.encodestring("%s:%s" % (self._endpointuser, self._endpointpass)).strip()
                reqheaders["Authorization"] = "Basic %s" % auth
                logger.debug("doRequest: auth: %s:%s"%(self._endpointuser,self._endpointpass))
         
            hc   = httplib.HTTPConnection(self._endpointhost)
            logger.debug("End point host:"+ self._endpointhost)
            path = self.getRequestPath(resource)
            logger.debug("Path: "+ path)
            response     = None
            responsedata = None
            repeat       = 10
            while path and repeat > 0:
                repeat -= 1
                #print "Request "+command+", path "+path

                hc.request(command, path, reqdata, reqheaders)
                logger.debug(" Path= " + path )
                response = hc.getresponse()
                if response.status != 301: break
                path = response.getheader('Location', None)
                #print "Redirect to: "+path
                if path[0:6] == "https:":
                    # close old connection, create new HTTPS connection
                    hc.close()
                    hc = httplib.HTTPSConnection(self._endpointhost)    # Assume same host for https:
                else:
                    response.read()  # Seems to be needed to free up connection for new request
            logger.debug(" Response Status: %s %s" % (response.status, response.reason))
            logger.debug(" Expected Status: %s %s" % (repr(expect_status), repr(expect_reason)))
            if ( not self.expectedReturnStatus(expect_status, response.status) or
                 not self.expectedReturnReason(expect_reason, response.reason) ):
                raise self.HTTPSessionError(response.status, response.reason)
            responsedata = response.read()
            hc.close()
            return (response, responsedata)
    
    def doHTTP_POST(self,data, data_type="application/JSON",
                endpointhost=None, endpointpath=None, resource=None,
                expect_status=200, expect_reason="OK",
                accept_type="*/*"):
            reqheaders   = {
                "Content-type": data_type,
                "Accept":       accept_type
                }
            self.setRequestEndPoint(endpointhost, endpointpath)
            (response, responsedata) = self.doRequest("POST", resource,
                reqdata=data, reqheaders=reqheaders,
                expect_status=expect_status, expect_reason=expect_reason)
            responsetype = self.getResponseType(response)
            return (responsetype, responsedata)
        
    def doHTTP_PUT(self,data, data_type="application/JSON",
                endpointhost=None, endpointpath=None, resource=None,
                expect_status=200, expect_reason="OK",
                accept_type="*/*"):
            reqheaders   = {
                "Content-type": data_type,
                "Accept":       accept_type
                }
            self.setRequestEndPoint(endpointhost, endpointpath)
            (response, responsedata) = self.doRequest("PUT", resource,
                #reqdata=data,
                 reqheaders=reqheaders,
                expect_status=expect_status, expect_reason=expect_reason)
            responsetype = self.getResponseType(response)
            return (responsetype, responsedata)    
        
    matchParams = re.compile(";.*")
    
    def getResponseType(self,response):
            type = response.getheader("Content-type")
            if type:
                type = self.matchParams.sub("",type)
            else:
                type = "application/JSON"
            return type
        
    def doHTTP_GET(self,endpointhost=None, endpointpath=None, resource=None,
                expect_status=200, expect_reason="OK",
                accept_type="*/*"):
            reqheaders   = {
                "Accept": accept_type
                }
            self.setRequestEndPoint(endpointhost, endpointpath)
            (response, responsedata) = self.doRequest("GET", resource, 
                reqheaders=reqheaders,
                expect_status=expect_status, expect_reason=expect_reason)
            responsetype = self.getResponseType(response)
            return (responsetype, responsedata)
        
        
    def doHTTP_DELETE(self,
                endpointhost=None, endpointpath=None, resource=None,
                expect_status=200, expect_reason="OK"):
            self.setRequestEndPoint(endpointhost, endpointpath)
            (response, responsedata) = self.doRequest("DELETE", resource,
                expect_status=expect_status, expect_reason=expect_reason)
            responsetype = self.getResponseType(response)
            return (responsetype, responsedata)  
       
def makeHttpSession(endpointhost=None, basepath=None, username=None, password=None):
        session = Session()
        session.setRequestEndPoint(endpointhost, basepath)
        session.setRequestUserPass(username, password)
        return session


# End.
