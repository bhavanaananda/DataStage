#!/usr/bin/python
import cgi

def main():
    print "Content-type:text/html\n"
    form = cgi.FieldStorage() #parse the query
    if form.has_key("firstname" and form["firstname"].value!= "" ):
        print "<h1>Hello" , form["firstname"].value, "</h1>"
    else :
        print "<h1> Error! Please enter your first name!/h1>"
    
    #try:
    #except:
    #cgi.print_exception()
    
    
    
    main()
    