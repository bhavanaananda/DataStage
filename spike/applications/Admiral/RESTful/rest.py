import web

urls = ('/memory','PrintStatement')
if __name__ == "__main__":
    app = web.application(urls,globals())
    app.run()

class PrintStatement:
    def GET(self):
        return "Hello, world!"
        #print '<html><body><b>Hello World</b></body></html>'



