#!/usr/bin/python
# $Id:  $
"""
HTTP and SPARQL query test case support functions 

$Rev: $
"""

import os, os.path
import sys
import unittest
import logging
import httplib
import urllib
import simplejson

if __name__ == "__main__":
    # For testing: 
    # add main library directory to python path if running stand-alone
    sys.path.append("..")

from MiscLib import TestUtils
from TestLib import SparqlQueryTestCase

logger = logging.getLogger('TestSubmission')

class TestSubmission(SparqlQueryTestCase.SparqlQueryTestCase):
    """
    Test simple dataset submissions to RDFDatabank
    """
    def setUp(self):
        #super(TestSubmission, self).__init__()
        # TODO: use separate config file
        self.setRequestEndPoint(
            endpointhost="163.1.127.173", 
            endpointpath="/packages/admiral-test/")
        self.setRequestEndPoint(
            endpointhost="localhost:9080",  # Via SSH tunnel
            endpointpath="/packages/admiral-test/")
        self.setRequestUserPass(endpointuser="admiral", endpointpass="admiral")
        self.doHTTP_DELETE(
            endpointpath="/objects/admiral-test/", resource="TestSubmission", 
            expect_status="*", expect_reason="*")
        return

    def tearDown(self):
        return

    # Actual tests follow

    def testDatasetNotPresent(self):
        self.doHTTP_GET(resource="TestSubmission", expect_status=404, expect_reason="Not Found")

    def testInitialSubmission(self):
        # Submit ZIP file data/testdir.zip, check response
        fields = \
            [ ("id", "TestSubmission")
            ]
        zipdata = open("data/testdir.zip").read()
        files = \
            [ ("file", "testdir.zip", zipdata, "application/zip") 
            ]
        (reqtype, reqdata) = SparqlQueryTestCase.encode_multipart_formdata(fields, files)
        self.doHTTP_POST(
            reqdata, reqtype, 
            endpointpath="/packages/admiral-test/", 
            expect_status=200, expect_reason="OK")
        # Access dataset, check response
        data = self.doHTTP_GET(
            endpointpath="/objects/admiral-test/", resource="TestSubmission", 
            expect_status=200, expect_reason="OK", expect_type="application/JSON")
        # Access versions info, check two versions exist
        state = data['state']
        parts = data['parts']
        self.assertEqual(state['item_id'],        "TestSubmission", "Submission item identifier")
        self.assertEqual(len(state['versions']),  2,   "Initially two versions")
        self.assertEqual(state['versions'][0],    '1', "Version 1")
        self.assertEqual(state['versions'][1],    '2', "Version 2")
        self.assertEqual(state['currentversion'], '2', "Current version == 2")
        self.assertEqual(state['rdffileformat'],  'xml',          "RDF file type")
        self.assertEqual(state['rdffilename'],    'manifest.rdf', "RDF file name")
        # subdir
        self.assertEqual(len(state['subdir']),    2,   "Subdirectory count")
        # Files
        # Metadata files
        # date
        # version_dates
        # Metadata
        self.assertEqual(state['metadata']['createdby'], "admiral", "Created by")
        self.assertEqual(state['metadata']['embargoed'], True,      "Embargoed?")

    def testInitialSubmissionContent(self):
        assert False, "TODO"
        # Submit ZIP file, check response
        # Access dataset, check response
        # Access and check list of contents
        # Access and check content of each resource
        # Access and check zip file content

    def testUpdateSubmission(self):
        assert False, "TODO"
        # Submit ZIP file, check response
        # Submit ZIP file again, check response
        # Access dataset, check response
        # Access versions info, check three versions exist

    def testUpdatedSubmissionContent(self):
        assert False, "TODO"
        # Submit ZIP file, check response
        # Submit ZIP file again, check response
        # Access dataset, check response
        # Access and check list of contents
        # Access and check content of each resource
        # Access and check zip file content

    def testDeleteDataset(self):
        assert False, "TODO"
        # Submit ZIP file, check response
        # Access dataset, check response
        # Delete dataset, check response
        # Access dataset, test response indicating non-existent

    # Sentinel/placeholder tests

    def testUnits(self):
        assert (True)

    def testComponents(self):
        assert (True)

    def testIntegration(self):
        assert (True)

    def testPending(self):
        assert (False), "Pending tests follow"

# Assemble test suite

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
            [ "testUnits"
            , "testDatasetNotPresent"
            , "testInitialSubmission"
            , "testInitialSubmissionContent"
            , "testUpdateSubmission"
            , "testUpdatedSubmissionContent"
            , "testDeleteDataset"
            ],
        "component":
            [ "testComponents"
            ],
        "integration":
            [ "testIntegration"
            ],
        "pending":
            [ "testPending"
            ]
        }
    return TestUtils.getTestSuite(TestSubmission, testdict, select=select)

if __name__ == "__main__":
    TestUtils.runTests("TestSubmission.log", getTestSuite, sys.argv)

# End.
