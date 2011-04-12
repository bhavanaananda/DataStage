****************************
REST in python using Web.py
****************************

1> Install web.py : http://webpy.org/install

2> Create example.py :

___________________________________________
import web

urls = ('/memory','PrintStatement')
if __name__ == "__main__":
    app = web.application(urls,globals())
    app.run()

class PrintStatement:
    def GET(self):
        return "Hello, world!"
_____________________________________________

3> From the command line run : python example.py

ie. In one command window, run the server:
     $ python example.py
        http://0.0.0.0:8080/
     ...

4> Open the URL : http://localhost:8080/memory
   The link should display "Hello, world!"

