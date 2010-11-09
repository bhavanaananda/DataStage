#!/usr/bin/python
#from __future__ import absolute_import

import cgi
import sys

def processFormData(formdata, outputstr):
    save_stdout = sys.stdout
    if outputstr:
        sys.stdout = outputstr
    try:
        print "Content-type:text/html\n"
        if formdata.has_key("firstname") and formdata["firstname"].value!= "" :
            print "<h1>Hello" , formdata["firstname"].value, "</h1>"
        else :
            print "<h1> Error! Please enter your first name!</h1>"
    finally:
        sys.stdout = save_strdout
    return

if __name__ == "__main__":
    form = cgi.FieldStorage() #parse the query
    processFormData(form, sys.stdout)
