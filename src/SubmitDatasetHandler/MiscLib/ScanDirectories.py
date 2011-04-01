# $Id: ScanDirectories.py 1047 2009-01-15 14:48:58Z graham $
#
"""
Function to scan the sub-directory structure in a given directory.

Note that files are not included in the results returned.
"""

from os.path import join, isdir, normpath
import os, logging
#from functional import partial

logger = logging.getLogger("ScanDirectories")

# Scan the sub-directory structure in a given directory
#
# Exceptions are left to the calling program.
#
# srcdir    directory to search, maybe including sub-directories
# DirFunc   a function to be called for each selected directory name
#           as DirFunc( dir ).  (NOTE:  this can be an
#           object method with access to the instance data of
#           the object to which it belongs.)
# recursive is True if directories are to be scanned recursively,
#           otherwise only the named directory is scanned.
#
def ScanDirectoriesEx(srcdir, DirFunc,listFiles=False, recursive=True):
    """
    Scan all sub-directories in a given source directory.
    Exceptions are thrown back to the calling program.
    """
    directoryList = os.listdir(srcdir)
    for directoryComponent in directoryList:
        path = srcdir+"/"+directoryComponent
        if isdir(path):
            DirFunc(path)
            if recursive:
                logger.debug("Adding Directory %s " % (path))
                ScanDirectoriesEx(path, DirFunc, listFiles, recursive)
                
        if listFiles==True:
            DirFunc(path)
    return

# Scan the sub-directory structure in a given directory
#
# This is just like 'ScanDirectoriesEx' above, except that an error 
# is reported if an I/O exception occurs.
#
# srcdir    directory to search, maybe including sub-directories
# DirFunc  a function to be called for each selected directory name
#           as DirFunc( dir ).  (NOTE:  this can be an
#           object method with access to the instance data of
#           the object to which it belongs.)
# recursive is True if directories are to be scanned recursively,
#           otherwise only the named directory is scanned.
#
def ScanDirectories(srcdir, DirFunc, listFiles=False, recursive=True):
    try:
        ScanDirectoriesEx(srcdir, DirFunc, listFiles, recursive)
    except (IOError, os.error), why:
        logger.debug("Can't scan %s: %s" % (`srcdir`, str(why)))
        print "Can't scan %s: %s" % (`srcdir`, str(why))
    return

# Collect directories/sub-directories found under the source directory
#
# srcdir    directory to search, maybe including sub-directories
# recursive is True if directories are to be scanned recursively,
#           otherwise only the named directory is scanned.
#
# Returns a list of directory contents
#
def CollectDirectoryContents(srcDir, baseDir, listFiles=False, recursive=True):
    """
    Return a list of directory contents found under the source directory.
    """
    #logger.debug("CollectDirectories: %s, %s, %s"%(srcDir,baseDir,str(os.path.sep)))
    collection = []
    if (baseDir != "") and (not baseDir.endswith(os.path.sep)):
        baseDir = baseDir+os.path.sep
    def Collect(path):
        collection.append(path.replace(baseDir,"",1))
    ScanDirectoriesEx(srcDir, Collect, listFiles, recursive)
    return collection

if __name__ == "__main__":
    directoryCollection = CollectDirectories(".")
    #PrintCollection()


# Collect user accessible and writable directories/sub-directories found under the source directory
#
# srcdir    directory to search, maybe including sub-directories
# recursive is True if directories are to be scanned recursively,
#           otherwise only the named directory is scanned.
#
# Returns a list of directories
#
def CollectWritableDirectories(srcDir, baseDir,listFiles=False, recursive=True):
    """
    Return a list of user accessible and writable directories found under the source directory.
    """
    #logger.debug("CollectDirectories: %s, %s, %s"%(srcDir,baseDir,str(os.path.sep)))
    collection = []
    if (baseDir != "") and (not baseDir.endswith(os.path.sep)):
        baseDir = baseDir+os.path.sep
    def CollectDirs(path):       
        if IsDirectoryWritable(path):
            logger.debug("Adding Path to tree = " + repr(path))
            collection.append(path.replace(baseDir,"",1))
    ScanDirectoriesEx(srcDir, CollectDirs,listFiles, recursive)
    return collection


def IsDirectoryWritable(dirPath):
    if  os.environ.has_key("REMOTE_USER"):
        uname =  os.environ['REMOTE_USER']
        logger.debug("Remote user = " + repr(uname))
        accesspath = "/usr/local/sbin/testuseraccess.sh" + " " + uname + " " + dirPath
        logger.debug("accesspath = " + repr(accesspath))
        accessStatus = os.system(accesspath)
        logger.debug("accessStatus = " + repr(accessStatus))
        if accessStatus == 0:
            return True
        else :
            return False
    else :
        return True
 
 