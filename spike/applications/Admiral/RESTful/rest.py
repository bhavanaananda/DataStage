import web
import re
import uuid

urls = ('/cgi-bin')
if __name__ == "__main__":
    web.run(urls, globals())
    #app = web .application(urls,globals())
    #app.run();

class AbstractDB(object):
    """Abstract database that handles the high-level HTTP primitives.
    """
    def GET(self):
         print '<html><body><b>Hello World</b></body></html>'



