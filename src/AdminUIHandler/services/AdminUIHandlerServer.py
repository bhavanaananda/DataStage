import web
from os.path import join, isdir, normpath
import os, sys, logging, subprocess, ast

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
            remoteUser =  os.environ['REMOTE_USER']
        else:
            remoteUser = "TestLeader"
            
        logger.debug("Remote user = " + repr(remoteUser))
        accesspath = "/usr/local/sbin/listAdmiralUsers.sh" + " " + remoteUser 
        logger.debug("accesspath = " + repr(accesspath))
        cmdOutput = subprocess.Popen(accesspath, shell=True, stdout=subprocess.PIPE)
        cmdOutputString = cmdOutput.stdout.read()

        # Convert the retrieved column of users to a list to enable easy conversion to json
        cmdOutputList = []
        cmdOutputString = cmdOutputString.strip()
        cmdOutputString = cmdOutputString.replace("\n", ",")
        cmdOutputList = cmdOutputString.split(",")
        logger.debug("cmdOutputList = " + repr(cmdOutputList))
        return json.dumps(cmdOutputList, sort_keys=True)

        #return "List Admiral Users"

class AdmiralUserDetails:
    def GET(self, userID):
        outputstr = sys.stdout
        outputstr.write("Content-type: application/JSON\n")
        outputstr.write("\n")      # end of MIME headers

        if  os.environ.has_key("REMOTE_USER"):
            remoteUser =  os.environ['REMOTE_USER']
        else:
            remoteUser = "TestUser1"
            
        admiralUser = userID
        accesspath = "/usr/local/sbin/admiraluserinfo.sh" + " " + remoteUser + " " + admiralUser
        logger.debug("accesspath = " + repr(accesspath))
        cmdOutput = subprocess.Popen(accesspath, shell=True, stdout=subprocess.PIPE)
        cmdOutputString = cmdOutput.stdout.read()

        # Convert the retrieved column of users to a list to enable easy conversion to json
        cmdOutputList = []
        cmdOutputString = cmdOutputString.strip()
        #cmdOutputList = cmdOutputString.split("\n")
        cmdOutputString = '{"' + cmdOutputString + '"}'
        cmdOutputString = cmdOutputString.replace("\n", '","')
        cmdOutputString = cmdOutputString.replace(":", '":"')
        logger.debug("cmdOutputList = " + repr(cmdOutputList))
        return json.dumps(ast.literal_eval(cmdOutputString))

        #return "Admiral User Details"


