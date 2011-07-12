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
    mountcommand = ( '/sbin/mount.cifs //%(host)s/%(share)s/%(area)s %(mountpt)s -o rw,user=%(user)s,password=%(pass)s,nounix,forcedirectio' %
                     { 'host': TestConfig.hostname
                     , 'share': TestConfig.cifssharename
                     , 'area': areaName
                     , 'user': userName
                     , 'mountpt': TestConfig.cifsmountpoint
                     , 'pass': userPass
                     } )
    print mountcommand
    status=os.system(mountcommand)
    # OS.system Returns a 16-bit number, whose low byte is the signal number that killed the process, and 
    # whose high byte is the exit status (if the signal number is zero); the high bit of the low byte is set if a core file was produced
 
    return status

def do_cifsUnmount():
    os.system('/sbin/umount.cifs ' + TestConfig.cifsmountpoint)
    return 

def do_cifsCreateFile(fileName, createFileContent):
    ###print "do_cifsCreateFile: "+TestConfig.cifsmountpoint + '/' + fileName
    f = open(TestConfig.cifsmountpoint + '/' + fileName, 'w+')
    assert f, "File creation failed"
    f.write(createFileContent)
    f.close()
    return createFileContent

def do_cifsReadFile(fileName):
    f = open(TestConfig.cifsmountpoint + '/' + fileName, 'r')
    readFileContent = f.read()
    f.close()
    return readFileContent

def do_cifsUpdateFile(fileName, updateFileContent):
    f = open(TestConfig.cifsmountpoint + '/' + fileName,'a+')
    f.write(updateFileContent)
    f.close()
    return updateFileContent

def do_cifsDeleteFile(fileName):
    deleteMessage = (0,"Success")
    # Test and delete file
    try:
        s = os.stat(TestConfig.cifsmountpoint + '/'+ fileName)
    except OSError as e:
         #print repr(e)
         deleteMessage = (e.errno,str(e))
#    except:
#        assert (False), "File "+ fileName+" not found or other stat error"  
#        deleteMessage = str(e)
    else:
        try:
            os.remove(TestConfig.cifsmountpoint + '/'+ fileName)
        except OSError as e:
             deleteMessage = (e.errno,str(e))
        else:
            try:
                s = os.stat(TestConfig.cifsmountpoint + '/'+ fileName)
                assert (False), "File "+ fileName+" not deleted"
            except OSError as e:
                 deleteMessage = (e.errno,str(e))
#            except:
#                pass
    return deleteMessage

    

