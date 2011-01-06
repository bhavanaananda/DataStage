# $Id: TestMetadataMerging.py 1047 2009-01-15 14:48:58Z bhavana $
#
# Unit testing for WebBrick library functions (Functions.py)
# See http://pyunit.sourceforge.net/pyunit.html
#
import sys, unittest, logging, re, StringIO, os, cgi, rdflib
from rdflib import URIRef, Namespace, RDF
from os.path import normpath

sys.path.append("..")
sys.path.append("../cgi-bin")

from MiscLib import TestUtils
import SubmitDatasetUtils, ManifestRDFUtils, TestConfig

Logger                    =  logging.getLogger("TestMetadataMerging")             
ExpectedDictionary        =  {
                                 "creator"     : "admiral"
                               , "identifier"  : "SubmissionToolTest"
                               , "title"       : "Submission tool test title"
                               , "description" : "Submission tool test description"                     
                             }

class TestMetadataMerging(unittest.TestCase):

    def setUp(self):
        return
       
    def tearDown(self):
        return
    
    # Tests  
    def testReadMetadata(self):    
       
        rdfGraphBeforeSerialisation = ManifestRDFUtils.writeToManifestFile(TestConfig.ManifestFilePath,TestConfig.NamespaceDictionary, TestConfig.ElementUriList, TestConfig.ElementValueList)       
        rdfGraphAfterSerialisation  = ManifestRDFUtils.readManifestFile(TestConfig.ManifestFilePath)
     
        # Compare the serialised graph obtained with the graph before serialisation
        self.assertEqual(len(rdfGraphBeforeSerialisation),5,'Graph length %i' %len(rdfGraphAfterSerialisation))
        
        subject = rdfGraphAfterSerialisation.value(None,RDF.type,URIRef(ManifestRDFUtils.oxds+"Grouping"))
        self.failUnless((subject,RDF.type,URIRef(TestConfig.oxds+"Grouping")) in rdfGraphAfterSerialisation, 'Testing submission type: '+subject+", "+ URIRef(TestConfig.oxds+"Grouping"))
        self.failUnless((subject,TestConfig.ElementCreatorUri,TestConfig.User) in rdfGraphAfterSerialisation, 'dcterms:creator')
        self.failUnless((subject,TestConfig.ElementIdentifierUri,TestConfig.DatasetId) in rdfGraphAfterSerialisation, 'ManifestRDFUtils.dcterms:identifier')
        self.failUnless((subject,TestConfig.ElementTitleUri,TestConfig.Title) in rdfGraphAfterSerialisation, 'dcterms:title')
        self.failUnless((subject,TestConfig.ElementDescriptionUri,TestConfig.Description) in rdfGraphAfterSerialisation, 'dcterms:TestConfig.Description')
        return
    
    def testUpdateMetadata(self):
        updatedTitle       =  "Submission tool updated test title"
        updatedDescription =  "Submission tool updated test description" 
        
        initialGraph = ManifestRDFUtils.writeToManifestFile(TestConfig.ManifestFilePath, TestConfig.NamespaceDictionary,TestConfig.ElementUriList, TestConfig.ElementValueList)
        updatedGraph = ManifestRDFUtils.updateManifestFile(TestConfig.ManifestFilePath, [TestConfig.ElementTitleUri,TestConfig.ElementDescriptionUri], [updatedTitle, updatedDescription])       
        readGraph    = ManifestRDFUtils.readManifestFile(TestConfig.ManifestFilePath)

        # Assert that (initialGraph != updatedGraph)          
        self.assertEqual(False, ManifestRDFUtils.compareRDFGraphs(initialGraph, updatedGraph,TestConfig.ElementUriList),"Error updating the manifest file!")
        
        # Assert that (updatedGraph == readGraph)
        self.assertEqual(True, ManifestRDFUtils.compareRDFGraphs(updatedGraph, readGraph,TestConfig.ElementUriList),"Error updating the manifest file!")
        return    
    
    def testGetElementValuesFromManifest(self):
        rdfGraph = ManifestRDFUtils.writeToManifestFile(TestConfig.ManifestFilePath, TestConfig.NamespaceDictionary, TestConfig.ElementUriList, TestConfig.ElementValueList)        
        fields = ManifestRDFUtils.getElementValuesFromManifest(rdfGraph, TestConfig.ElementUriList)
        self.assertEquals(fields,TestConfig.ElementValueList,"Problem reading submit dataset utility Fields!")
        return
    
    def testGetDictionaryFromManifest(self):
        rdfGraph = ManifestRDFUtils.writeToManifestFile(TestConfig.ManifestFilePath, TestConfig.NamespaceDictionary, TestConfig.ElementUriList, TestConfig.ElementValueList)
        actualDictionary = ManifestRDFUtils.getDictionaryFromManifest(TestConfig.ManifestFilePath, TestConfig.ElementUriList)
        Logger.debug(repr(actualDictionary))
        #print "ExpectedDictionary: "+repr(ExpectedDictionary)
        #print "actualDictionary: "+repr(actualDictionary)
        self.assertEqual(ExpectedDictionary,actualDictionary, "Error fetching dictionary from the metadata!")
        return
    
    
def getTestSuite(select="unit"):
    """
    Get test suite

    select  is one of the following:
            "unit"      return suite of unit tests only
            "component" return suite of unit and component tests
            "all"       return suite of unit, component and integration tests
            "pending"   return suite of pending tests
             name       a single named test to be run
    """
    testdict = {
        "unit":
            [
              "testReadMetadata",
              "testUpdateMetadata",
              "testGetElementValuesFromManifest",
              "testGetDictionaryFromManifest"
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
    return TestUtils.getTestSuite(TestMetadataMerging, testdict, select=select)


if __name__ == "__main__":
    TestConfig.setDatasetsBaseDir(".")
    TestUtils.runTests("TestMetadataMerging.log", getTestSuite, sys.argv)
