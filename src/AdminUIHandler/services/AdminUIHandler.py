import web
from os.path import join, isdir, normpath
import os, sys, logging, subprocess, ast, base64

try:
    import simplejson as json
except ImportError:
    import json as json

logger = logging.getLogger("AdminUIHandler")

urls = ('/users','ListAdmiralUsers',
        '/user/(.+)','AdmiralUserDetails',
        '/error/(.+)',"AdmiralError")
if __name__ == "__main__":
    #web.run(urls, globals())
      app = web.application(urls,globals())
      app.run()
    # app = web.application(urls, globals(), autoreload=False)
    # application = app.wsgifunc()

class ListAdmiralUsers:
    def GET(self):
        web.header('Content-Type', 'application/JSON')

        if not web.ctx.environ.has_key('HTTP_AUTHORIZATION') or  not web.ctx.environ['HTTP_AUTHORIZATION'].startswith('Basic '):
            return web.Unauthorized()
        else:
            hash = web.ctx.environ['HTTP_AUTHORIZATION'][6:]
            remoteUser, remotPasswd = base64.b64decode(hash).split(':')

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
        web.ok
        return json.dumps(cmdOutputList, sort_keys=True)
        #return "List Admiral Users"

class AdmiralUserDetails:
    def GET(self, userID):
        web.header('Content-Type', 'application/JSON')

        if not web.ctx.environ.has_key('HTTP_AUTHORIZATION') or  not web.ctx.environ['HTTP_AUTHORIZATION'].startswith('Basic '):
            return web.Unauthorized()
        else:
            hash = web.ctx.environ['HTTP_AUTHORIZATION'][6:]
            remoteUser, remotPasswd = base64.b64decode(hash).split(':')

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
            
        if cmdOutputString.find("ADMIRAL SERVER ERROR") == -1 :
            raise web.redirect('/error/'+cmdOutputString)
            #print "Status: 303 ADMIRAL SERVER ERROR"
            
        return json.dumps(ast.literal_eval(cmdOutputString))
        #return "Admiral User Details"
        
class AdmiralError:
    def GET(self, errorMessage): 
        web.header('Content-Type', 'text/html') 
        return errorMessage  
        #return "Admiral Server Error"
