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
Support functions for creating, reading, writing and updating manifest RDF file.
"""
 
__author__ = "Bhavana Ananda"
__version__ = "0.1"

import logging,  os, rdflib
from os.path import isdir
from rdflib import URIRef, Namespace
from rdflib.namespace import RDF
from rdflib.graph import Graph
from rdflib.plugins.memory import Memory
from rdflib import Literal

subject              =  URIRef("http://163.1.127.173/admiral-test/datasets/")
dcterms              =  URIRef("http://purl.org/dc/terms/")
oxds                 =  URIRef("http://vocab.ox.ac.uk/dataset/schema#") 
Logger               =  logging.getLogger("MaifestRDFUtils")
DefaultManifestName  =  "manifest.rdf"

def readManifestFile(manifestPath):
    """
    Read from the manifest file.   
    
    manifestPath    manifest file path
    """
    # Read from the manifest.rdf file into an RDF Graph      
    rdfstream = manifestPath
    rdfGraph = Graph()
    rdfGraph.parse(rdfstream)   
    return rdfGraph

def writeToManifestFile(manifestPath,elementList,elementValueList):   
    """
    Write to the manifest file. 
    
    manifestPath      manifest file path
    elementList       Element Names List to be written into the manifest files
    elementValueList  Element Values List to be written into the manifest files
    """
    # Create an empty RDF Graph 
    rdfGraph = Graph()

    # Bind namespaces
    rdfGraph.bind("dcterms", dcterms, override=True)
    rdfGraph.bind("oxds", oxds, override=True)
    
    # Write to the RDF Graph
    rdfGraph.add((subject, RDF.type, URIRef(oxds+"DataSet")))
    for index in range(len(elementList)):
        rdfGraph.add((subject, URIRef(dcterms+elementList[index]), Literal(elementValueList[index])))
 
    # Serialise it to a manifest.rdf file
    saveToManifestFile(rdfGraph, manifestPath)
    return rdfGraph
    
def updateManifestFile(manifestPath, elementList, elementValueList):   
    """
    Update the manifest file. 
    
    manifestPath      manifest file path
    elementList       Element Names List whose values need to be to be updated in the manifest files
    elementValueList  Element Values List to be updated into the manifest files
    """
  
    # Read the manifest File and update the title and the description
    rdfGraph = readManifestFile(manifestPath)
    
    for index in range(len(elementList)):
        rdfGraph.set((subject, URIRef(dcterms+elementList[index]), Literal(elementValueList[index])))
    
    saveToManifestFile(rdfGraph,manifestPath)
    return rdfGraph
    
def saveToManifestFile(rdfGraph, manifestPath):
    """
    Save the RDF Graph into a manifest file. 
    
    rdfGraph          RDF Graph to be serialised into the manifest file
    manifestPath      manifest file path
    """
    # Serialise the RDf Graph into manifest.rdf file
    rdfGraph.serialize(destination=manifestPath, format='pretty-xml')
    return


def setSubject(datasetID):
    """
    Set the subject of the RDF triple.
    
    datasetID    datasetID of the dataset
    """
    global subject
    subject  =  URIRef("http://163.1.127.173/admiral-test/datasets/" + datasetID )
    return

def oldcompareRdfGraphs(graphA, graphB, assertEqual=False, elementsToCompare=[], compareLength=False):
    """
    Compare two RDG graphs
    
    graphA        RDF Graph of Graph A
    graphB        RDF Graph of Graph B
    assertEqual   Takes True/False; Generates assertions based on the value provided; Default: False
    compareLength Tales true/false, Compares the lengths of the two graphs if provided with True and generates assertion; Default: False
    """
    if assertEqual == True :
        if compareLength == True:
            assert len(graphA)==len(graphB),"Length of graphA = "+ repr(len(graphA))+ " and Length of graphB = " + repr(len(graphB))
        assert set(graphA)==set(graphB)," GraphA is not same as GraphB!"
        
        for elementName in elementsToCompare :
            assert graphA.value(subject,URIRef(dcterms+elementName),None)==graphB.value(subject,URIRef(dcterms+elementName),None),\
            elementName +" in GraphA = " + graphA.value(subject,URIRef(dcterms+elementName),None) + \
            " and"+ elementName +" in GraphB = " + graphB.value(subject,URIRef(dcterms+elementName),None)
            
    else :
        if compareLength == True:
            assert len(graphA)!=len(graphB),"Length of graphA = "+ repr(len(graphA))+ " and Length of graphB = " + repr(len(graphB))
        assert set(graphA)!=set(graphB)," GraphA is same as GraphB!"
        
        for elementName in elementsToCompare :
            assert graphA.value(subject,URIRef(dcterms+elementName),None)!=graphB.value(subject,URIRef(dcterms+elementName),None),\
            elementName +" in GraphA = " + graphA.value(subject,URIRef(dcterms+elementName),None) + \
            " and"+ elementName +" in GraphB = " + graphB.value(subject,URIRef(dcterms+elementName),None)   
             
    return assertEqual


def compareRDFGraphs(graphA, graphB, elementsToCompare=[]):
    """
    Compare two RDG graphs
    
    graphA        RDF Graph of Graph A
    graphB        RDF Graph of Graph B
    
    graphsEqual   Return True if the two graphs are equal or false otherwise
    """
    graphsEqual = True
    
    if len(graphA)!=len(graphB) or set(graphA)!=set(graphB):
        graphsEqual = False
                
    for elementName in elementsToCompare :
        if graphA.value(subject,URIRef(dcterms+elementName),None)!=graphB.value(subject,URIRef(dcterms+elementName),None) :
           graphsEqual = False

    return graphsEqual

def getSubmitDatasetToolFieldsFromManifest(rdfGraph,elementList):
    """
    Get element values of the element list supplied from the RDF graph
    
    rdfGraph      RDF Graph
    elementList   Element Names List whose values need to be to be extracted from the manifest files
    """
    elementValueList = []
    for element in elementList:
        elementValueList.append(rdfGraph.value(subject,URIRef(dcterms+element),None))   
    return elementValueList

def getDictionaryFromManifest(dirName, basedir, elementList, manifestName = DefaultManifestName):
    """
    Gets the dictionary of Field-Values from the manifest RDF
    
    dirName       directory in which the manifest.rdf is to be searched and returned; returns None if not found
    basedir       base directory in which the dirName directory is found
    elementList   Element Names List whose values need to be to be updated in the manifest files
    manifestName  manifest file name
    """
    manifestPath     =  None
    file             =  None
    elementValueList =  []
    dict             =  {}
    json             =  ""
    directoryPath    =  basedir + os.path.sep + dirName
    Logger.debug(directoryPath)
    if  isdir(directoryPath):
        manifestPath = directoryPath + os.path.sep + manifestName
        Logger.debug(repr(os.path.isfile(manifestPath)) +":"+ manifestPath)
        
    if manifestPath != None and os.path.isfile(manifestPath):
        rdfGraph = readManifestFile(manifestPath)
        elementValueList = getSubmitDatasetToolFieldsFromManifest(rdfGraph, elementList)
         
        Logger.debug("Element List =" + repr(elementList))
        Logger.debug("Element Value List =" + repr(elementValueList))
        
    if elementValueList!=[]:
        dict = createDictionary(elementList, elementValueList)
        
    return dict
    
def createDictionary(keyList, valueList):   
    """
    Creates and returns a dictionary from the keyList and valueList supplied 
    
    keyList     List of keys
    valueList   List of values
    """
    dict = {}
    i = 0
    for keyName in keyList:
        dict[keyName] = valueList[i]
        i += 1
    return dict

