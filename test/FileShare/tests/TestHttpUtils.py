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
    phan=urllib2.urlopen(TestConfig.webdavbaseurl+'/'+ areaName +'/' + fileName)
    thepage=phan.read()
    return thepage

def do_httpUpdateFile(areaName, userName, userPass,fileName, fileUpdateContent):
    authhandler = do_httpAuthenticationHandler(userName, userPass)
    opener = urllib2.build_opener(authhandler)
    urllib2.install_opener(opener)      
    # Write/update data to server
    do_HTTP_redirect(opener, "PUT",
        TestConfig.webdavbaseurl+'/'+ areaName +'/' + fileName, 
        fileUpdateContent, 'text/plain')
    return

def do_httpDeleteFile(areaName, userName, userPass,fileName):
    authhandler = do_httpAuthenticationHandler(userName, userPass)
    opener = urllib2.build_opener(authhandler)
    do_HTTP_redirect(opener, "DELETE", 
        TestConfig.webdavbaseurl+'/'+ areaName +'/' + fileName,
        None, None)
    return
    

