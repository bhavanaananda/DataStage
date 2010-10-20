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

def do_HTTP_redirect(opener, method, uri, data, content_type):
    req=urllib2.Request(uri, data=data)
    if content_type: req.add_header('Content-Type', content_type)
    req.get_method = lambda: method
    try:
        url=opener.open(req)
    except urllib2.HTTPError as e:
        if e.code == 301:                # Follow redirection
            req=urllib2.Request( e.headers['Location'], data=data)
            if content_type: req.add_header('Content-Type', content_type)
            req.get_method = lambda: method
            url=opener.open(req)
        else:
            raise e     # propagate exception
    return

def do_cifsMount(areaName, userName, userPass):
    #print "do_cifsMount: "+areaName+", "+userName+", "+userPass+", "+TestConfig.hostname
    mountcommand = ( 'mount.cifs //%(host)s/%(share)s/private/%(area)s %(mountpt)s -o rw,user=%(user)s,password=%(pass)s,nounix,forcedirectio' %
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


def do_httpAuthenticationHandler(userName, userPass):
    passman = urllib2.HTTPPasswordMgrWithDefaultRealm()
    passman.add_password(None, TestConfig.webdavbaseurl, userName, userPass)
    authhandler = urllib2.HTTPBasicAuthHandler(passman)
    return authhandler

def do_httpCreateFile(areaName, userName, userPass, fileName, fileContent):
    authhandler = do_httpAuthenticationHandler(userName, userPass)
    opener = urllib2.build_opener(authhandler)
    urllib2.install_opener(opener)      
    # Write data to server
    do_HTTP_redirect(opener, "PUT",
        TestConfig.webdavbaseurl + '/' + areaName + '/' + fileName, 
        fileContent, 'text/plain')
    return 

def do_httpReadFile(areaName, userName, userPass,fileName, fileContent):
    authhandler = do_httpAuthenticationHandler(userName, userPass)
    opener = urllib2.build_opener(authhandler)
    urllib2.install_opener(opener)       
    phan=urllib2.urlopen(TestConfig.webdavbaseurl+'/private/'+ userName +'/' + fileName)
    thepage=phan.read()
    return thepage

def do_httpUpdateFile(areaName, userName, userPass,fileName, fileUpdateContent):
    authhandler = do_httpAuthenticationHandler(userName, userPass)
    opener = urllib2.build_opener(authhandler)
    urllib2.install_opener(opener)      
    # Write/update data to server
    do_HTTP_redirect(opener, "PUT",
        TestConfig.webdavbaseurl+'/private/'+ userName +'/' + fileName, 
        fileUpdateContent, 'text/plain')
    return

def do_httpDeleteFile(areaName, userName, userPass,fileName):
    authhandler = do_httpAuthenticationHandler(userName, userPass)
    opener = urllib2.build_opener(authhandler)
    do_HTTP_redirect(opener, "DELETE", 
        TestConfig.webdavbaseurl+'/private/'+ userName +'/' + fileName,
        None, None)
    return
    

