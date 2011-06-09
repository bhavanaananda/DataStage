# $Id: TestAll.py 1047 2009-01-15 14:48:58Z graham $
#
# Unit testing for WebBrick library functions (Functions.py)
# See http://pyunit.sourceforge.net/pyunit.html
#
import sys, unittest, logging,re, StringIO, os, logging, subprocess
from os.path import normpath, abspath
sys.path.append(".")
from  TestConfig import TestConfig
sys.path.append("..")
from MiscLib import TestUtils


try:
    # Running Python 2.5 with simplejson?
    import simplejson as json
except ImportError:
    import json as json


logger = logging.getLogger("TestAdminInterfaceRestfulAPIs")
    
class TestAdminInterfaceRestfulAPIs(unittest.TestCase):

    def setUp(self):
        return
       
    def tearDown(self):
        return
    
    
    # Tests  

    # Test that the Admin Interface API: /user/[AdmiralUserID] API   
    def testAdmiralModifyUserDetails(self):
        url = TestConfig.HostName + "/user/" + TestConfig.UserName
        inputJsonFileName = TestConfig.UserName+".json"
        curlcommand = "curl " + url + " -u " + TestConfig.RemoteUserName+":"+ TestConfig.RemoteUserPass +" --data-binary  @"+inputJsonFileName+" -X PUT "
        print curlcommand
        cmdOutput = subprocess.Popen(curlcommand, shell=True, stdout=subprocess.PIPE)
        expectedOutput = '{"Update": "Successful"}'
        print "expectedOutput = " + expectedOutput
        actualOutput = cmdOutput.stdout.read()
        print "actualOutput = " + actualOutput
        assert (actualOutput==expectedOutput), "Actual Response=" + actualOutput +" while Expected response= "+expectedOutput
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
              "testAdmiralModifyUserDetails"
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
    return TestUtils.getTestSuite(TestAdminInterfaceRestfulAPIs, testdict, select=select)

if __name__ == "__main__":
    #logging.basicConfig(level=logging.DEBUG)
    TestUtils.runTests("TestAdminInterfaceRestfulAPIs.log", getTestSuite, sys.argv)
    #runner = unittest.TextTestRunner()
    #runner.run(getTestSuite())