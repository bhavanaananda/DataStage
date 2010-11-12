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
def ScanDirectoriesEx(srcdir, DirFunc, recursive=True):
    """
    Scan all sub-directories in a given source directory.
    Exc
    eptions are thrown back to the calling program.
    """
    directoryList = os.listdir(srcdir)
    for directoryComponent in directoryList:
        path = srcdir+"/"+directoryComponent
        if isdir(path):
            DirFunc(path)
            if recursive:
                logger.debug("Adding Directory %s " % (path))
                ScanDirectoriesEx(path, DirFunc)
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
def ScanDirectories(srcdir, DirFunc, recursive=True):
    try:
        ScanDirectoriesEx(srcdir, DirFunc, recursive)
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
# Returns a list of directories
#
def CollectDirectories(srcDir, baseDir, recursive=True):
    """
    Return a list of directories found under the source directory.
    """
    #logger.debug("CollectDirectories: %s, %s, %s"%(srcDir,baseDir,str(os.path.sep)))
    collection = []
    def Collect(path):
        collection.append(path.replace(baseDir+os.path.sep,"",1))
    ScanDirectoriesEx(srcDir, Collect, recursive)
    return collection

if __name__ == "__main__":
    directoryCollection = CollectDirectories(".")
    #PrintCollection()
