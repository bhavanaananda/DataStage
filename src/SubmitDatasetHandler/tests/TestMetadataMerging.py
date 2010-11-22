# $Id: TestMetadataMerging.py 1047 2009-01-15 14:48:58Z bhavana $
#
# Unit testing for WebBrick library functions (Functions.py)
# See http://pyunit.sourceforge.net/pyunit.html
#
import sys, unittest, logging, re, StringIO, os, cgi, rdflib
from rdflib.namespace import RDF
from rdflib.graph import Graph
from rdflib.plugins.memory import Memory
from rdflib import URIRef, Namespace
from rdflib import Literal
from os.path import normpath

sys.path.append("..")
sys.path.append("../cgi-bin")

import SubmitDatasetHandler
import SubmitDatasetUtils
import ManifestRDFUtils
import HttpUtils
from MiscLib import TestUtils

Logger             =  logging.getLogger("TestMetadataMerging")
SiloName           =  "admiral-test"
DirName            =  "DatasetsTopDir"
DatasetsEmptyDir   =  "DatasetsEmptyDir"
subject            =  URIRef("http://163.1.127.173/admiral-test/datasets/"+ DatasetId)
dcterms            =  URIRef("http://purl.org/dc/terms/")
oxds               =  URIRef("http://vocab.ox.ac.uk/dataset/schema#")
ManifestFilePath   =  "./TestMetadataMergingManifest.rdf"
Dict1              =  \
                      {  'datDir'      :  cgi.MiniFieldStorage('datDir'      ,  "./DatasetsTopDir")
                       , 'datId'       :  cgi.MiniFieldStorage('datId'       ,  "SubmissionHandlerTest")
                       , 'title'       :  cgi.MiniFieldStorage('title'       ,  "Submission handler test title")
                       , 'description' :  cgi.MiniFieldStorage('description' ,  "Submission handler test description")
                       , 'user'        :  cgi.MiniFieldStorage('user'        ,  "admiral")
                       , 'pass'        :  cgi.MiniFieldStorage('pass'        ,  "admiral")
                       , 'submit'      :  cgi.MiniFieldStorage('submit'      ,  "Submit")
                      }
DatasetId          =  SubmitDatasetUtils.getFormParam('datId', Dict1)
DatasetDir         =  SubmitDatasetUtils.getFormParam('datDir', Dict1)
Title              =  SubmitDatasetUtils.getFormParam('title', Dict1)
Description        =  SubmitDatasetUtils.getFormParam('description', Dict1)
User               =  SubmitDatasetUtils.getFormParam('user', Dict1) 
ElementValueList   =  [User, DatasetId, Title, Description]

ElementCreator     =  "creator"
ElementIdentifier  =  "identifier"
ElementTitle       =  "title"
ElementDescription =  "description"
ElementList        = [ElementCreator,ElementIdentifier,ElementTitle,ElementDescription]   

class TestMetadataMerging(unittest.TestCase):

    def setUp(self):
     return
       
    def tearDown(self):
        try:
            SubmitDatasetUtils.deleteDataset(SiloName,  SubmitDatasetUtils.getFormParam('datId', formdata))
        except:
            pass
        return
    
    # Tests  
 
    def testReadMetadata(self):    
       
        rdfGraphBeforeSerialisation = writeToManifestFile(ManifestFilePath, ElementList, ElementValueList)
        
        rdfGraphAfterSerialisation  = readManifestFile()
     
        # Compare the serialised graph obtained with the graph before serialisation
        self.assertEqual(len(rdfGraphBeforeSerialisation),5,'Graph length %i' %len(rdfGraphAfterSerialisation))
        self.failUnless((subject,RDF.type,URIRef(oxds+"DataSet")) in rdfGraphAfterSerialisation, 'Testing submission type: '+subject+", "+ URIRef(oxds+"DataSet"))
        self.failUnless((subject,URIRef(dcterms+ElementCreator),User) in rdfGraphAfterSerialisation, 'dcterms:creator')
        self.failUnless((subject,URIRef(dcterms+ElementIdentifier),DatasetId) in rdfGraphAfterSerialisation, 'dcterms:identifier')
        self.failUnless((subject,URIRef(dcterms+ElementTitle),Title) in rdfGraphAfterSerialisation, 'dcterms:title')
        self.failUnless((subject,URIRef(dcterms+ElementDescription),Description) in rdfGraphAfterSerialisation, 'dcterms:Description')
        return
    
    def testUpdateMetadata(self):
        updatedTitle      =  "Updated Submission handler test title"
        updatedDescription =  "Updated Submission handler test description" 
        
        initialGraph = writeToManifestFile(ManifestFilePath, ElementList, ElementValueList)

        updatedGraph = updateManifestFile(ManifestFilePath, [ElementTitle,ElementDescription], [updatedTitle, updatedDescription])
        
        readGraph    = readManifestFile()
        
        # Assert that the graphs ar enot equal           
        self.assertEqual(False, compareRdfGraphs(initialGraph, updatedGraph, assertEqual=False, ElementList))
        
        # Assert that the graphs are equal
        self.assertEqual(True, compareRdfGraphs(updatedGraph, readGraph, assertEqual=True , ElementList))
        return    
    
    
def writeToManifestFile(manifestPath,elementList,elementValueList):   
    # Create an empty RDF Graph 
    rdfGraph = Graph()

    # Bind namespaces
    rdfGraph.bind("dcterms", dcterms, override=True)
    rdfGraph.bind("oxds", oxds, override=True)
    
    # Write to the RDF Graph
    rdfGraph.add((subject, RDF.type, URIRef(oxds+"DataSet")))
    for element in elementList and elementValue in elementValueList:
        rdfGraph.add((subject, URIRef(dcterms+element), Literal(elementValue)))
#    rdfGraphBeforeSerialisation.add((subject, URIRef(dcterms+ElementIdentifier), Literal(DatasetId)))
#    rdfGraphBeforeSerialisation.add((subject, URIRef(dcterms+ElementTitle), Literal(Title)))
#    rdfGraphBeforeSerialisation.add((subject, URIRef(dcterms+ElementDescription), Literal(Description)))
    
    # Serialise it to a manifest.rdf file
    saveToManifestFile(rdfGraph, manifestPath)
    return rdfGraph

def readManifestFile(manifestPath):
    # Read from the manifest.rdf file into an RDF Graph      
    rdfstream = manifestPath
    rdfGraph = Graph()
    rdfGraph.parse(rdfstream)   
    return rdfGraph
    
def updateManifestFile(manifestPath, elementList, elementValueList):   
    # Update the title and the description of the dataset submitted earlier
  
    # Read the manifest File and update the title and the description
    rdfGraph = readManifestFile(manifestPath)
    
    for element in elementList and elementValue in elementValueList:
        rdfGraph.set((subject, URIRef(dcterms+element), Literal(elementValueList)))
    
    saveToManifestFile(rdfGraph,manifestPath)
    return rdfGraph
    
def saveToManifestFile(rdfGraph, manifestPath):
    # Serialise the RDf Graph into manifest.rdf file
    rdfGraph.serialize(destination=manifestPath, format='pretty-xml')
    return

def compareRdfGraphs(graphA, graphB, assertEqual=False, elementsToCompare=[]):
    # Compare the serialised graph obtained with the graph before serialisation
    if equal == True :
        assert len(graphA)==len(graphB),"Length of graphA = "+ repr(len(graphA))+ " and Length of graphB = " + repr(len(graphB))
        assert set(graphA)==set(graphB)," GraphA is not same as GraphB!"
        
        for elementName in elementsToCompare :
            assert graphA.value(subject,URIRef(dcterms+elementName),None)==graphB.value(subject,URIRef(dcterms+elementName),None),\
            elementName +" in GraphA = " + graphA.value(subject,URIRef(dcterms+elementName),None) + \
            " and"+ elementName +" in GraphB = " + graphB.value(subject,URIRef(dcterms+elementName),None)
            
    else :
        assert len(graphA)!=len(graphB),"Length of graphA = "+ repr(len(graphA))+ " and Length of graphB = " + repr(len(graphB))
        assert set(graphA)!=set(graphB)," GraphA is same as GraphB!"
        
        for elementName in elementsToCompare :
            assert graphA.value(subject,URIRef(dcterms+elementName),None)!=graphB.value(subject,URIRef(dcterms+elementName),None),\
            elementName +" in GraphA = " + graphA.value(subject,URIRef(dcterms+elementName),None) + \
            " and"+ elementName +" in GraphB = " + graphB.value(subject,URIRef(dcterms+elementName),None)
        
    return True

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
            [
              "testReadMetadata",
              "testUpdateMetadata"
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
