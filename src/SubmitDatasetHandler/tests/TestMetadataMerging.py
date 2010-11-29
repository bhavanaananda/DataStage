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
import SubmitDatasetUtils
import ManifestRDFUtils

Logger             =  logging.getLogger("TestMetadataMerging")
Dict1              =  \
                      {  'datDir'      :  cgi.MiniFieldStorage('datDir'      ,  "./DatasetsTopDir")
                       , 'datId'       :  cgi.MiniFieldStorage('datId'       ,  "SubmissionHandlerTest")
                       , 'title'       :  cgi.MiniFieldStorage('title'       ,  "Submission handler test title")
                       , 'description' :  cgi.MiniFieldStorage('description' ,  "Submission handler test description")
                       , 'user'        :  cgi.MiniFieldStorage('user'        ,  "admiral")
                       , 'pass'        :  cgi.MiniFieldStorage('pass'        ,  "admiral")
                       , 'submit'      :  cgi.MiniFieldStorage('submit'      ,  "Submit")
                      }
                      
ExpectedDictionary =  {
                         "creator"     : "admiral"
                       , "identifier"  : "SubmissionHandlerTest"
                       , "title"       : "Submission handler test title"
                       , "description" : "Submission handler test description"                     
                      }
DatasetId          =  SubmitDatasetUtils.getFormParam('datId', Dict1)
DatasetDir         =  SubmitDatasetUtils.getFormParam('datDir', Dict1)
Title              =  SubmitDatasetUtils.getFormParam('title', Dict1)
Description        =  SubmitDatasetUtils.getFormParam('description', Dict1)
User               =  SubmitDatasetUtils.getFormParam('user', Dict1)
ElementValueList   =  [User, DatasetId, Title, Description]

BaseDir            =  "."
SubmitToolDatDirFormField = "DatasetsTopDir"
ManifestFilePath   =  SubmitToolDatDirFormField+ "/TestMetadataMergingManifest.rdf"

ElementCreator     =  "creator"
ElementIdentifier  =  "identifier"
ElementTitle       =  "title"
ElementDescription =  "description"
ElementList        =  [ElementCreator,ElementIdentifier,ElementTitle,ElementDescription]  



class TestMetadataMerging(unittest.TestCase):

    def setUp(self):
        return
       
    def tearDown(self):
        return
    
    # Tests  
    def testReadMetadata(self):    
       
        rdfGraphBeforeSerialisation = ManifestRDFUtils.writeToManifestFile(ManifestFilePath, ElementList, ElementValueList)       
        rdfGraphAfterSerialisation  = ManifestRDFUtils.readManifestFile(ManifestFilePath)
     
        # Compare the serialised graph obtained with the graph before serialisation
        self.assertEqual(len(rdfGraphBeforeSerialisation),5,'Graph length %i' %len(rdfGraphAfterSerialisation))
        
        subject = rdfGraphAfterSerialisation.value(None,RDF.type,URIRef(ManifestRDFUtils.oxds+"DataSet"))
        self.failUnless((subject,RDF.type,URIRef(ManifestRDFUtils.oxds+"DataSet")) in rdfGraphAfterSerialisation, 'Testing submission type: '+subject+", "+ URIRef(ManifestRDFUtils.oxds+"DataSet"))
        self.failUnless((subject,URIRef(ManifestRDFUtils.dcterms+ElementCreator),User) in rdfGraphAfterSerialisation, 'ManifestRDFUtils.dcterms:creator')
        self.failUnless((subject,URIRef(ManifestRDFUtils.dcterms+ElementIdentifier),DatasetId) in rdfGraphAfterSerialisation, 'ManifestRDFUtils.dcterms:identifier')
        self.failUnless((subject,URIRef(ManifestRDFUtils.dcterms+ElementTitle),Title) in rdfGraphAfterSerialisation, 'ManifestRDFUtils.dcterms:title')
        self.failUnless((subject,URIRef(ManifestRDFUtils.dcterms+ElementDescription),Description) in rdfGraphAfterSerialisation, 'ManifestRDFUtils.dcterms:Description')
        return
    
    def testUpdateMetadata(self):
        updatedTitle       =  "Updated Submission handler test title"
        updatedDescription =  "Updated Submission handler test description" 
        
        initialGraph = ManifestRDFUtils.writeToManifestFile(ManifestFilePath, ElementList, ElementValueList)
        updatedGraph = ManifestRDFUtils.updateManifestFile(ManifestFilePath, [ElementTitle,ElementDescription], [updatedTitle, updatedDescription])       
        readGraph    = ManifestRDFUtils.readManifestFile(ManifestFilePath)

        # Assert that (initialGraph != updatedGraph)          
        self.assertEqual(False, ManifestRDFUtils.compareRDFGraphs(initialGraph, updatedGraph,ElementList),"Error updating the manifest file!")
        
        # Assert that (updatedGraph == readGraph)
        self.assertEqual(True, ManifestRDFUtils.compareRDFGraphs(updatedGraph, readGraph,ElementList),"Error updating the manifest file!")
        return    
    
    def testGetElementValuesFromManifest(self):
        rdfGraph = ManifestRDFUtils.writeToManifestFile(ManifestFilePath, ElementList, ElementValueList)        
        fields = ManifestRDFUtils.getElementValuesFromManifest(rdfGraph, ElementList)
        self.assertEquals(fields,ElementValueList,"Problem reading submit dataset utility Fields!")
        return
    
    def testGetDictionaryFromManifest(self):
        rdfGraph = ManifestRDFUtils.writeToManifestFile(ManifestFilePath, ElementList, ElementValueList)
        actualDictionary = ManifestRDFUtils.getDictionaryFromManifest(ManifestFilePath, ElementList)
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
    TestUtils.runTests("TestMetadataMerging.log", getTestSuite, sys.argv)
