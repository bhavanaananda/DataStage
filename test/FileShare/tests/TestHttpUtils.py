# $Id: $
#
# Utility functions for testing HTTP
#

import os
import sys
import httplib
import urllib2


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