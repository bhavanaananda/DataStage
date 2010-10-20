# $Id: $
#
# Utility functions for testing HTTP
#

import os
import sys
import httplib
import urllib2

from TestConfig import TestConfig

# Execute a specified HTTP method using a supplied urllib2 opener object,
# following a single HTTP 301 redirection response

def do_cifsMount(areaName, userName, userPass):
    #print "do_cifsMount: "+areaName+", "+userName+", "+userPass+", "+TestConfig.hostname
    mountcommand = ( 'mount.cifs //%(host)s/%(share)s/%(area)s %(mountpt)s -o rw,user=%(user)s,password=%(pass)s,nounix,forcedirectio' %
                     { 'host': TestConfig.hostname
                     , 'share': TestConfig.cifssharename
                     , 'area': areaName
                     , 'user': userName
                     , 'mountpt': TestConfig.cifsmountpoint
                     , 'pass': userPass
                     } )
    #print mountcommand
    status=os.system(mountcommand)
    return status

def do_cifsUnmount():
    os.system('umount.cifs ' + TestConfig.cifsmountpoint)

def do_cifsCreateFile(fileName, fileContent):
    ###print "do_cifsCreateFile: "+TestConfig.cifsmountpoint + '/' + fileName
    f = open(TestConfig.cifsmountpoint + '/' + fileName, 'w+')
    assert f, "File creation failed"
    f.write(fileContent)
    f.close()
    return 

def do_cifsReadFile(fileName , fileContent):
    f = open(TestConfig.cifsmountpoint + '/' + fileName, 'r')
    l = f.read()
    f.close()
    return l

def do_cifsUpdateFile(fileName, fileUpdateContent):
    f = open(TestConfig.cifsmountpoint + '/' + fileName,'a+')
    f.write(fileUpdateContent)
    f.close()
    return

def do_cifsDeleteFile(fileName):
    # Test and delete file
    try:
        s = os.stat(TestConfig.cifsmountpoint + '/'+ fileName)
    except:
        assert (False), "File "+ fileName+" not found or other stat error"
    os.remove(TestConfig.cifsmountpoint + '/'+ fileName)
    try:
        s = os.stat(TestConfig.cifsmountpoint + '/'+ fileName)
        assert (False), "File "+ fileName+" not deleted"
    except:
        pass
    return

    

