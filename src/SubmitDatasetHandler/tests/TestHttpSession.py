# $Id: TestHttpUtils.py 1047 2009-01-15 14:48:58Z graham $
#
# Unit testing for WebBrick library functions (Functions.py)
# See http://pyunit.sourceforge.net/pyunit.html
#

import sys, unittest, logging, zipfile, os, re
from os.path import normpath

#Add main library directory to python path
###sys.path.append("../../../test")
sys.path.append("..")

from MiscLib import TestUtils
import HttpSession, HttpUtils, TestConfig

logger               =  logging.getLogger("TestHttpUtils")

class TestHttpSession(unittest.TestCase):
  
    def setUp(self):
        # Tests run against Databank via local proxy
        self.endpointhost = "localhost"
        self.basepath     = "/admiral-test/"
        self.username     = TestConfig.Username
        self.password     = TestConfig.Password
        return

    def tearDown(self):        
        return
        
    # Tests

    #def getRequestPath(rel): ???
    
    #def getRequestUri(rel): ???
    
    #def expectedReturnStatus(expected, actual):
    
    #def expectedReturnReason(expected, actual):

    def testSimpleHttpGet_orig(self):
        HttpUtils.setRequestEndPoint(self.endpointhost, self.basepath)
        HttpUtils.setRequestUserPass(self.username, self.password)
        (responsetype, responsedata) = HttpUtils.doHTTP_GET(endpointpath=self.basepath, resource="datasets", expect_status=200, expect_reason="OK", accept_type="*/*")
        self.assertEquals(responsetype, "text/html", "List datasets response type: %s"%responsetype)
        self.assertTrue(re.search("<title>.*List of Datasets.*</title>", responsedata) != None, "List datasets response data")
        return

    def testSimpleHttpGet(self):
        session = HttpUtils.makeHttpSession(self.endpointhost, self.basepath, self.username, self.password)
        (responsetype, responsedata) = session.doHTTP_GET("datasets", expect_status=200, expect_reason="OK", accept_type="*/*")
        self.assertEquals(responsetype, "text/html", "List datasets response type")
        self.assertTrue(re.search("<title>.*List of Datasets.*</title>", responsedata) != None, "List datasets response data")
        return


    def testSimpleHttpPost(self):
        session = HttpUtils.makeHttpSession(self.endpointhost, self.basepath, self.username, self.password)
        fields = \
            [ ("id", "test-dataset")
            ]
        files =[]
        (reqtype, reqdata) = HttpUtils.encode_multipart_formdata(fields, files)
        (responsetype, responsedata) = session.doHTTP_POST("datasets", reqdata, data_type=reqtype, expect_status=201, expect_reason="Created", accept_type="*/*")
        self.assertEquals(responsetype, "text/html", "Create dataset response type: "+responsetype)
        self.assertEquals(responsedata, "...", "Create dataset response data: "+responsedata)
        #self.assertTrue(re.search("<title>.*List of Datasets.*</title>", responsedata) != None, "Create dataset response data")
        
        # Do GET to datasets/test-dataset
        (responsetype, responsedata) = session.doHTTP_GET("datasets/test-dataset", expect_status=200, expect_reason="OK", accept_type="*/*")
        self.assertEquals(responsetype, "text/html", "Get dataset response type")
        self.assertTrue(re.search("<title>.*Get Datasets.*</title>", responsedata) != None, "Get dataset response data")       
        return

    def testSimpleHttpDelete(self):
        session = HttpUtils.makeHttpSession(self.endpointhost, self.basepath, self.username, self.password)
        (responsetype, responsedata) = session.doHTTP_DELETE("datasets/test-dataset", expect_status=200, expect_reason="OK", accept_type="*/*")
        self.assertEquals(responsetype, "text/html", "Delete dataset response type")
        self.assertTrue(re.search("<title>.*Del Dataset.*</title>", responsedata) != None, "Delete dataset response data")
        
        # Do GET to datasets/test-dataset
        (responsetype, responsedata) = session.doHTTP_GET("datasets/test-dataset", expect_status=404, expect_reason="Not Found", accept_type="*/*")
        self.assertEquals(responsetype, "text/html", "Get dataset response type")
        self.assertTrue(re.search("<title>.*Get Datasets.*</title>", responsedata) != None, "Get dataset response data") 
        return

    # Test the Dataset Creation: <TestSubmission>       
    def testZZZZZ(self):
        return
    
def getTestSuite(select="unit"):
    """
    Get test suite

    select  is one of the following:
            "unit"      return suite of unit tests only
            "component" return suite of unit and component tests
            "all"       return suite of unit, component and integration tests
            "pending"   return suite of pending tests
            name        a single named test to be run
    """
    testdict = {
        "unit":
            [ #"testUnits"
              "testSimpleHttpGet"
            ],
        "component":
            [ #"testComponents"
            ],
        "integration":
            [ #"testIntegration"
            ],
        "pending":
            [ #"testPending"
            ]
        }
    return TestUtils.getTestSuite(TestHttpSession, testdict, select=select)

if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    TestConfig.setDatasetsBaseDir(".")
    TestUtils.runTests("TestHttpSession.log", getTestSuite, sys.argv)
