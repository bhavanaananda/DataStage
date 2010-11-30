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
from rdflib import URIRef, Namespace, BNode
from rdflib.namespace import RDF
from rdflib.graph import Graph
from rdflib.plugins.memory import Memory
from rdflib import Literal

Logger  =  logging.getLogger("MaifestRDFUtils")
oxds    =  URIRef("http://vocab.ox.ac.uk/dataset/schema#")
oxdsGroupingUri =  URIRef(oxds+"Grouping")

def bindNamespaces(rdfGraph, namespaceDict):
    # Bind namespaces
    for key in namespaceDict:
        keyValue = namespaceDict[key]
        Logger.debug(key+":"+keyValue)
        rdfGraph.bind( key,  keyValue , override=True)
    # rdfGraph.bind("dcterms", dcterms, override=True)
    # rdfGraph.bind("oxds", oxds, override=True)
    # URIRef(dcterms+elementList[index])
    return rdfGraph

def readManifestFile(manifestPath):
    """
    Read from the manifest file.   
    
    manifestPath    manifest file path
    """
    # Read from the manifest.rdf file into an RDF Graph      

    rdfGraph = Graph()
    rdfGraph.parse(manifestPath)   
    return rdfGraph

def writeToManifestFile(manifestPath, namespaceDict, elementUriList,elementValueList):   
    """
    Write to the manifest file. 
    
    manifestPath      manifest file path
    elementUriList    Element Uri List to be written into the manifest files
    elementValueList  Element Values List to be written into the manifest files
    """
    # Create an empty RDF Graph 
    rdfGraph = Graph()
    subject =  BNode()
    rdfGraph = bindNamespaces(rdfGraph, namespaceDict)
    # Write to the RDF Graph
    
    rdfGraph.add((subject, RDF.type, oxdsGroupingUri))
    for index in range(len(elementUriList)):
        rdfGraph.add((subject,elementUriList[index], Literal(elementValueList[index])))
 
    # Serialise it to a manifest.rdf file
    saveToManifestFile(rdfGraph, manifestPath)
    return rdfGraph
    
def updateManifestFile(manifestPath, elementUriList, elementValueList):   
    """
    Update the manifest file. 
    
    manifestPath      manifest file path
    elementUriList    Element Uri List whose values need to be to be updated in the manifest files
    elementValueList  Element Values List to be updated into the manifest files
    """
  
    # Read the manifest file and update the title and the description
    rdfGraph = readManifestFile(manifestPath)

    subject  = rdfGraph.value(None,RDF.type, oxdsGroupingUri)
    if subject == None :
        subject = BNode()
    for index in range(len(elementUriList)):
        rdfGraph.set((subject, elementUriList[index], Literal(elementValueList[index])))
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

def compareRDFGraphs(graphA, graphB, elementUriListToCompare=[]):
    """
    Compare two RDG graphs
    
    graphA        RDF Graph of Graph A
    graphB        RDF Graph of Graph B
    
    graphsEqual   Return True if the two graphs are equal or false otherwise
    """
    def graphContains(graph, statement):
        (s,p,o) = statement
        if isinstance(s, BNode): s = None
        if isinstance(p, BNode): p = None
        if isinstance(o, BNode): o = None
        return (s,p,o) in graph
    
    graphsEqual = True

    for statement in graphA:
        if not graphContains(graphB, statement) : return False

    for statement in graphB:
        if not graphContains(graphA, statement) : return False
                
    subjectA  = graphA.value(None,RDF.type, oxdsGroupingUri)
    subjectB  = graphB.value(None,RDF.type, oxdsGroupingUri)
    for elementUri in elementUriListToCompare :
        if graphA.value(subjectA,elementUri,None)!=graphB.value(subjectB,elementUri,None) :
           graphsEqual = False

    return graphsEqual

def getElementValuesFromManifest(rdfGraph,elementUriList):
    """
    Get element values of the element list supplied from the RDF graph
    
    rdfGraph         RDF Graph
    elementUriList   Element Uri List whose values need to be to be extracted from the manifest files
    """
    elementValueList = []
    subject  = rdfGraph.value(None, RDF.type, oxdsGroupingUri)
    for elementUri in elementUriList:
        elementValueList.append(rdfGraph.value(subject,elementUri,None))   
    Logger.debug("Element Uri List =" + repr(elementUriList))
    Logger.debug("Element Value List =" + repr(elementValueList))
    return elementValueList

def getDictionaryFromManifest(manifestPath, elementUriList):
    """
    Gets the dictionary of Field-Values from the manifest RDF
    
    manifestPath   path of the manifest file
    elementList    Element Names List whose values need to be to be updated in the manifest files
    """

    file             =  None
    elementValueList =  []
    elementList      =  [] 
    dict             =  {}
    json             =  ""

    Logger.debug(manifestPath)
        
    if manifestPath != None and ifFileExists(manifestPath):
        rdfGraph = readManifestFile(manifestPath)
        elementValueList = getElementValuesFromManifest(rdfGraph, elementUriList)
     #   Logger.debug("Element URi List =" + repr(elementUriList))
     #   Logger.debug("Element Value List =" + repr(elementValueList))
     

    for index  in range(len(elementUriList)): 
        Logger.debug("Index = " + repr(index))
        elementUri = elementUriList[index]
        position   = elementUri.rfind("/") +1
        elementList.append(elementUri[position:])
        Logger.debug("substring = " + elementUri[position:])
         
        
    if elementValueList!=[]:
        dict = createDictionary(elementList, elementValueList)
        
    return dict


def ifFileExists(filePath):
    """
    Cheks if the file exists; returns True/False
    
    filePath     File Path
    """
   
    return os.path.isfile(filePath)

def createDictionary(keyList, valueList):   
    """
    Creates and returns a dictionary from the keyList and valueList supplied 
    
    keyUriList  List of key uris
    valueList   List of values
    """
    dict = {}
    for index in range(len(keyList)):
        dict[keyList[index]] = valueList[index]
   # Logger.debug(" Key Uri List = "+ repr(keyUriList))
   # Logger.debug(" Key value list = "+ repr(valueList))
    return dict

