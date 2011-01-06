# $Id: $
#
# See http://pyunit.sourceforge.net/pyunit.html
#
import cgi, SubmitDatasetUtils, os, re
from rdflib import URIRef
  
def setDatasetsBaseDir(base):
    global DatasetsBaseDir
    DatasetsBaseDir  =  base
    
    global SiloName, Username, Password, FileName
    global FilePath, FileMimeType, ZipMimeType
    global DirName, DirPath 
    global DatasetsEmptyDirName, DatasetsEmptyDirPath
    global UpdatedTitle, UpdatedDescription, TestPat
    
    SiloName                 =  "admiral-test"
    Username                 =  "admiral"
    Password                 =  "admiral"
    FileName                 =  "file1.txt"
    FilePath                 =  DatasetsBaseDir + os.path.sep + FileName
    FileMimeType             =  "text/plain"
    ZipMimeType              =  "application/zip"
    DirName                  =  "DatasetsTopDir"
    DirPath                  =  DatasetsBaseDir + os.path.sep + DirName
    DatasetsEmptyDirName     =  "DatasetsEmptySubDir"
    DatasetsEmptyDirPath     =  DatasetsBaseDir + os.path.sep + DirName + os.path.sep + DatasetsEmptyDirName
    UpdatedTitle             =  "Updated Title"
    UpdatedDescription       =  "Updated Description"
    TestPat              =  re.compile("^.*$(?<!\.zip)")
    

    global ManifestFilePath
    ManifestFilePath =  DatasetsBaseDir + os.path.sep + DirName + "/manifest.rdf"
    
    global formdata, updatedformdata

    formdata                 =  \
                                {  'datDir'      :  cgi.MiniFieldStorage('datDir'      ,  DatasetsBaseDir+"/DatasetsTopDir")
                                 , 'datId'       :  cgi.MiniFieldStorage('datId'       ,  "SubmissionHandlerTest")
                                 , 'title'       :  cgi.MiniFieldStorage('title'       ,  "Submission handler test title")
                                 , 'description' :  cgi.MiniFieldStorage('description' ,  "Submission handler test description")
                                 , 'user'        :  cgi.MiniFieldStorage('user'        ,  "admiral")
                                 , 'pass'        :  cgi.MiniFieldStorage('pass'        ,  "admiral")
                                 , 'submit'      :  cgi.MiniFieldStorage('submit'      ,  "Submit")
                                }
    updatedformdata         =   \
                                {  'datDir'      :  cgi.MiniFieldStorage('datDir'      ,  DatasetsBaseDir+"/DatasetsTopDir")
                                 , 'datId'       :  cgi.MiniFieldStorage('datId'       ,  "SubmissionHandlerTest")
                                 , 'title'       :  cgi.MiniFieldStorage('title'       ,  "Submission handler updated test title")
                                 , 'description' :  cgi.MiniFieldStorage('description' ,  "Submission handler updated test description")
                                 , 'user'        :  cgi.MiniFieldStorage('user'        ,  "admiral")
                                 , 'pass'        :  cgi.MiniFieldStorage('pass'        ,  "admiral")
                                 , 'submit'      :  cgi.MiniFieldStorage('submit'      ,  "Submit")      
                                }
    
    global DatasetId, DatasetDir, Title, Description, User, ElementValueList, ElementValueUpdatedList
    DatasetId                 =  SubmitDatasetUtils.getFormParam('datId', formdata)
    DatasetDir                =  SubmitDatasetUtils.getFormParam('datDir', formdata)
    Title                     =  SubmitDatasetUtils.getFormParam('title', formdata)
    Description               =  SubmitDatasetUtils.getFormParam('description', formdata)
    User                      =  SubmitDatasetUtils.getFormParam('user', formdata)
    ElementValueList          =  [User, DatasetId, Title, Description]
    ElementValueUpdatedList   =  [User, DatasetId, UpdatedTitle, UpdatedDescription]
    
    global dcterms, oxds
    dcterms                   =  URIRef("http://purl.org/dc/terms/")
    oxds                      =  URIRef("http://vocab.ox.ac.uk/dataset/schema#") 
    
    global NamespaceDictionary
    NamespaceDictionary       =  {
                                   "dcterms"   : dcterms ,
                                   "oxds"      : oxds                    
                                 }
    global ElementCreatorUri,ElementIdentifierUri,ElementTitleUri,ElementDescriptionUri,ElementUriList 
    ElementCreatorUri         =  URIRef(dcterms + "creator")
    ElementIdentifierUri      =  URIRef(dcterms + "identifier")
    ElementTitleUri           =  URIRef(dcterms + "title")
    ElementDescriptionUri     =  URIRef(dcterms + "description")
    ElementUriList            =  [ElementCreatorUri, ElementIdentifierUri, ElementTitleUri, ElementDescriptionUri]
    return

