# $Id: TestUtils.py 1047 2009-01-15 14:48:58Z graham $
#
# Support functions for running different test suites
#
# Test suites are selected using a command line argument:
#
# Test classes are:
#   "unit"          These are stand-alone tests that all complete within a few 
#                   seceonds and do not depend on resources external to the 
#                   package being tested, (other than other libraries used).
#   "component"     These are tests that take loonger to run, or depend on 
#                   external resources, (files, etc.) but do not depend on 
#                   external services.
#   "integration"   These are tests that exercise interactions with seperate
#                   services.
#   "pending"       These are tests that have been designed and created, but 
#                   for which the corresponding implementation has not been
#                   completed.
#   "all"           return suite of unit, component and integration tests
#   name            a single named test to be run.
#

import logging
import unittest
import httplib
import urlparse
import base64

try:
    # Running Python 2.5 with simplejson?
    import simplejson as simplejson
except ImportError:
    import json as simplejson

# Default SPARQL endpoint details
_endpointhost = "localhost"
_endpointpath = "/admiral-test"     # Really just a placeholder
_endpointuser = "admiral"
_endpointpass = "admiral"

logger = logging.getLogger('TestSubmitDataset')
        

def getTestSuite(testclass,testdict,select="unit"):
    """
    Assemble test suite from supplied class, dictionary and selector
    
    testclass   is the test class whose methods are test cases
    testdict    is a dictionary of test cases in named test suite, 
                keyed by "unit", "component", etc., or by a named test.
    select      is the test suite selector:
                "unit"      return suite of unit tests only
                "component" return suite of component tests
                "integrate" return suite of integration tests
                "pending"   return suite of pending tests
                "all"       return suite of unit and component tests
                name        a single named test to be run
    """
    suite = unittest.TestSuite()
    # Named test only
    if select[0:3] not in ["uni","com","all","int","pen"]:
        if not hasattr(testclass, select):
            print "%s: no test named '%s'"%(testclass.__name__, select)
            return None
        suite.addTest(testclass(select))
        return suite
    # Select test classes to include
    if select[0:3] == "uni":
        testclasses = ["unit"]
    elif select[0:3] == "com":
        testclasses = ["component"]
    elif select[0:3] == "int":
        testclasses = ["integration"]
    elif select[0:3] == "pen":
        testclasses = ["pending"]
    elif select[0:3] == "all":
        testclasses = ["unit", "component"]
    else:
        testclasses = ["unit"]
    for c in testclasses:
        for t in testdict.get(c,[]):
            if not hasattr(testclass, t):
                print "%s: in '%s' tests, no test named '%s'"%(testclass.__name__, c, t)
                return None
            suite.addTest(testclass(t))
    return suite

def runTests(logname, getSuite, args):
    """
    Run unit tests based on supplied command line argument values
    
    logname     name for logging output file, if used
    getSuite    function to retrieve test suite, given selector value
    args        command line arguments (or equivalent values)
    """
    sel = "unit"
    vrb = 1
    if len(args) > 1:
        sel = args[1]
    if sel[0:3] in ["uni","com","all","int","pen"]:
        logging.basicConfig(level=logging.WARNING)
        if sel[0:3] in ["com","all"]: vrb = 2
    else:
        # Run single test with elevated logging to file via new handler
        logging.basicConfig(level=logging.DEBUG)
        # Enable debug logging to a file
        fileloghandler = logging.FileHandler(logname,"w")
        fileloghandler.setLevel(logging.DEBUG)
        # Use this formatter for shorter log records
        ###filelogformatter = logging.Formatter('%(levelname)s %(message)s', "%H:%M:%S")
        # Use this formnatter to display timing information:
        filelogformatter = logging.Formatter('%(asctime)s.%(msecs)03d %(levelname)s %(message)s', "%H:%M:%S")
        fileloghandler.setFormatter(filelogformatter)
        #logging.getLogger('').addHandler(fileloghandler)
        vrb = 2
    runner = unittest.TextTestRunner(verbosity=vrb)
    tests  = getSuite(select=sel)
    if tests: runner.run(tests)
    return

####################   Bhavana added more test cases into this TestUtils###############################

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
            expect_type="*/*"):
        reqheaders   = {
            "Content-type": data_type,
            "Accept":       expect_type
            }
        setRequestEndPoint(endpointhost, endpointpath)
        (response, responsedata) = doRequest("POST", resource,
            reqdata=data, reqheaders=reqheaders,
            expect_status=expect_status, expect_reason=expect_reason)
        if (expect_type.lower() == "application/json"): responsedata = simplejson.loads(responsedata)
        return responsedata
    
    
def doHTTP_GET(endpointhost=None, endpointpath=None, resource=None,
            expect_status=200, expect_reason="OK",
            expect_type="*/*"):
        reqheaders   = {
            "Accept":       expect_type
            }
        setRequestEndPoint(endpointhost, endpointpath)
        (response, responsedata) = doRequest("GET", resource, 
            reqheaders=reqheaders,
            expect_status=expect_status, expect_reason=expect_reason)
        if (expect_type.lower() == "application/json"): responsedata = simplejson.loads(responsedata)
        return responsedata    
    
def doHTTP_DELETE(
            endpointhost=None, endpointpath=None, resource=None,
            expect_status=200, expect_reason="OK"):
        setRequestEndPoint(endpointhost, endpointpath)
        (response, _) = doRequest("DELETE", resource,
            expect_status=expect_status, expect_reason=expect_reason)
        return response.status    
# End.
