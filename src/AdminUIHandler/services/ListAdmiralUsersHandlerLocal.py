import web
from os.path import join, isdir, normpath
import os, sys, logging, subprocess

try:
    import simplejson as json
except ImportError:
    import json as json

logger = logging.getLogger("ListAdmiralUsers")

urls = ('/users','ListAdmiralUsers')
if __name__ == "__main__":
    #web.run(urls, globals())
    app = web.application(urls,globals())
    app.run()
    #app = web.application(urls,globals(),autoreload=False)
    #app.wsgifunc()

class ListAdmiralUsers:
    def GET(self):
        outputstr = sys.stdout
        #outputstr.write("Content-type: application/JSON\n")
        outputstr.write("Content-type: application/JSON\n")
        outputstr.write("\n")      # end of MIME headers
        
#       if  os.environ.has_key("REMOTE_USER"):
#       uname =  os.environ['REMOTE_USER']
        uname = "bhavana"
        logger.debug("Remote user = " + repr(uname))
        #dirPath = "/mnt/lv-admiral-data/home"
        dirPath = "/home"
        accesspath = "/usr/local/sbin/listAdmiralUsers.sh" + " " + uname + " " + dirPath
        logger.debug("accesspath = " + repr(accesspath))
        cmdOutput = subprocess.Popen(accesspath, shell=True, stdout=subprocess.PIPE)
        cmdOutputString = cmdOutput.stdout.read()
    
        #Convert the retrieved column of users to a list to enable easy conversion to json   
        cmdOutputList = []
        cmdOutputString = cmdOutputString.strip()
        cmdOutputList = cmdOutputString.split("\n")
        
        logger.debug("cmdOutputList = " + repr(cmdOutputList))

        return json.dumps(cmdOutputList)
