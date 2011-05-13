import web
from os.path import join, isdir, normpath
import os, sys, logging, subprocess

try:
    import simplejson as json
except ImportError:
    import json as json

logger = logging.getLogger("AdminUIHandler")

urls = ('/users','ListAdmiralUsers',
        '/user/(.+)','AdmiralUserDetails')
if __name__ == "__main__":
    #web.run(urls, globals())
      app = web.application(urls,globals())
      app.run()
    # app = web.application(urls, globals(), autoreload=False)
    # application = app.wsgifunc()

class ListAdmiralUsers:
    def GET(self):
        outputstr = sys.stdout
        outputstr.write("Content-type: application/JSON\n")
        outputstr.write("\n")      # end of MIME headers

        if  os.environ.has_key("REMOTE_USER"):
            uname =  os.environ['REMOTE_USER']
            #uname = "bhavana"
            logger.debug("Remote user = " + repr(uname))
            #dirPath = "/mnt/lv-admiral-data/home"
            dirPath = "/homedata/private"
            accesspath = "/usr/local/sbin/listAdmiralUsers.sh" + " " + uname + " " + dirPath
            logger.debug("accesspath = " + repr(accesspath))
            cmdOutput = subprocess.Popen(accesspath, shell=True, stdout=subprocess.PIPE)
            cmdOutputString = cmdOutput.stdout.read()

            # Convert the retrieved column of users to a list to enable easy conversion to json
            cmdOutputList = []
            cmdOutputList = cmdOutputString.split("\n")

            logger.debug("cmdOutputList = " + repr(cmdOutputList))
            return json.dumps(cmdOutputList)

        else:
            uname = "TestUser1"
            logger.debug("Remote user = " + repr(uname))
            #dirPath = "/mnt/lv-admiral-data/home"
            dirPath = "/home/data/private"
            accesspath = "/usr/local/sbin/listAdmiralUsers.sh" + " " + uname + " " + dirPath
            logger.debug("accesspath = " + repr(accesspath))
            cmdOutput = subprocess.Popen(accesspath, shell=True, stdout=subprocess.PIPE)
            cmdOutputString = cmdOutput.stdout.read()

            # Convert the retrieved column of users to a list to enable easy conversion to json
            cmdOutputList = []
            cmdOutputString = cmdOutputString.strip()
            cmdOutputList = cmdOutputString.split("\n")

            logger.debug("cmdOutputList = " + repr(cmdOutputList))
            return json.dumps(cmdOutputList)

        #return "Hello, world!"
        
class AdmiralUserDetails:
    def GET(self, userID):
        outputstr = sys.stdout
        outputstr.write("Content-type: application/JSON\n")
        outputstr.write("\n")      # end of MIME headers

        if  os.environ.has_key("REMOTE_USER"):
            remoteUser =  os.environ['REMOTE_USER']
            admiralUser = userID
            accesspath = "/usr/local/sbin/admiraluserinfo.sh" + " " + remoteUser + " " + admiralUser
            logger.debug("accesspath = " + repr(accesspath))
            cmdOutput = subprocess.Popen(accesspath, shell=True, stdout=subprocess.PIPE)
            cmdOutputString = cmdOutput.stdout.read()

            # Convert the retrieved column of users to a list to enable easy conversion to json
            cmdOutputList = []
            cmdOutputString = cmdOutputString.strip()
            cmdOutputList = cmdOutputString.split("\n")

            logger.debug("cmdOutputList = " + repr(cmdOutputList))
            return json.dumps(cmdOutputList)


        else:
            remoteUser = "TestUser1"
            logger.debug("Remote user = " + repr(remoteUser))
            admiralUser = userID
            accesspath = "/usr/local/sbin/admiraluserinfo.sh" + " " + remoteUser + " " + admiralUser
            logger.debug("accesspath = " + repr(accesspath))
            cmdOutput = subprocess.Popen(accesspath, shell=True, stdout=subprocess.PIPE)
            cmdOutputString = cmdOutput.stdout.read()

            # Convert the retrieved column of users to a list to enable easy conversion to json
            cmdOutputList = []
            cmdOutputString = cmdOutputString.strip()
            cmdOutputList = cmdOutputString.split("\n")

            logger.debug("cmdOutputList = " + repr(cmdOutputList))
            return json.dumps(cmdOutputList)

        #return "Hello, world!"

