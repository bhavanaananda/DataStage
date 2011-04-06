#!/usr/bin/python
#from __future__ import absolute_import

import cgi
import sys

def processFormData(outputstr):
    save_strdout = sys.stdout
    if outputstr:
        sys.stdout = outputstr
    try:
        print "Content-type:text/html\n"
        print "<h1> Hello World! </h1>"
    finally:
        sys.stdout = save_strdout
    return

if __name__ == "__main__":
    processFormData(sys.stdout)




