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

import logging, rdflib
from rdflib import URIRef, Namespace
from rdflib.namespace import RDF
from rdflib.graph import Graph
from rdflib.plugins.memory import Memory
from rdflib import Literal

subject            =  URIRef("http://163.1.127.173/admiral-test/datasets/")
dcterms            =  URIRef("http://purl.org/dc/terms/")
oxds               =  URIRef("http://vocab.ox.ac.uk/dataset/schema#") 
Logger = logging.getLogger("MaifestRDFUtils")

def readManifestFile(manifestPath):
    # Read from the manifest.rdf file into an RDF Graph      
    rdfstream = manifestPath
    rdfGraph = Graph()
    rdfGraph.parse(rdfstream)   
    return rdfGraph

def setSubject(datasetID):
    global subject
    subject  =  URIRef("http://163.1.127.173/admiral-test/datasets/" + datasetID )

def writeToManifestFile(manifestPath,elementList,elementValueList):   
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
    # Update the title and the description of the dataset submitted earlier
  
    # Read the manifest File and update the title and the description
    rdfGraph = readManifestFile(manifestPath)
    
    for index in range(len(elementList)):
        rdfGraph.set((subject, URIRef(dcterms+elementList[index]), Literal(elementValueList[index])))
    
    saveToManifestFile(rdfGraph,manifestPath)
    return rdfGraph
    
def saveToManifestFile(rdfGraph, manifestPath):
    # Serialise the RDf Graph into manifest.rdf file
    rdfGraph.serialize(destination=manifestPath, format='pretty-xml')
    return

def compareRdfGraphs(graphA, graphB, assertEqual=False, elementsToCompare=[], compareLength=False):

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