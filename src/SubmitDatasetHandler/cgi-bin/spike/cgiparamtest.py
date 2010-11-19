#!/usr/bin/python

import cgi, sys, traceback

def doCgiRequest(stdout, formdata):

    print "Content-type: text/html"
    print "\n"
    print "<h2>Query parameters:</h2>"
    for k in formdata:
        print "<p>%s: %s</p>"%(k, formdata[k])
    print "<h2>End</h2>"
    return

if __name__ == "__main__":
    try:
        form = cgi.FieldStorage()   # Parse the query
        doCgiRequest(sys.stdout, form)
    except:
        print "<p>"
        print "Stack trace: <br\>"
        print "<pre>"
        print traceback.format_exc()
        print "</pre>"
        print "</p>"
        raise
