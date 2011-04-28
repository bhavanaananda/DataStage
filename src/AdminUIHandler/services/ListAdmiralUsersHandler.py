import web
from os.path import join, isdir, normpath
import os, logging, subprocess

logger = logging.getLogger("ListAdmiralUsers")

urls = ('/users','PrintStatement')
if __name__ == "__main__":
    #web.run(urls, globals())
    app = web.application(urls,globals())
    app.run()

class PrintStatement:
    def GET(self):
        if  os.environ.has_key("REMOTE_USER"):
            uname =  os.environ['REMOTE_USER']
            #uname = "bhavana"
            logger.debug("Remote user = " + repr(uname))
            dirPath = "/mnt/lv-admiral-data/home"
            #dirPath = "/home"
            accesspath = "/usr/local/sbin/listAdmiralUsers.sh" + " " + uname + " " + dirPath
            logger.debug("accesspath = " + repr(accesspath))
            cmdOutput = subprocess.Popen(accesspath, shell=True, stdout=subprocess.PIPE)
            logger.debug("cmdOutput = " + repr(cmdOutput))
            return cmdOutput.stdout.read()
            #return "Hello, world!"