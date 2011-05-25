import web
from os.path import join, isdir, normpath
import os, sys, logging, subprocess, ast, base64

try:
    import simplejson as json
except ImportError:
    import json as json

logger = logging.getLogger("AdminUIHandler")

urls = ('/admin','AdminUIFormHandler',
	    '/users','ListAdmiralUsers',
        '/user/(.+)','AdmiralUserDetails',
        '/error/(.+)','AdmiralError')
if __name__ == "__main__":
    #web.run(urls, globals())
      app = web.application(urls,globals())
      app.run()
    # app = web.application(urls, globals(), autoreload=False)
    # application = app.wsgifunc()

class AdminUIFormHandler:
    def POST(self):
        form = web.input(UserID="", FullName="", Role="", RoomNumber="", WorkPhone="",UserPassword="", UserOperation="")
        UserID = form.UserID
        FullName = form.FullName
        Role = form.Role
        RoomNumber = form.RoomNumber
        WorkPhone = form.WorkPhone
        Password = form.UserPassword
        Operation = form.UserOperation   	   	
    	cmdOutputList = []
    	cmdOutputList = [UserID,FullName,Role,RoomNumber,WorkPhone,Password,Operation]
        return	json.dumps(cmdOutputList)
	 
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
        cmdOutputString = cmdOutputString.strip()
        #print "Status: 303 ADMIRAL SERVER ERROR"

        if cmdOutputString.find("ADMIRAL SERVER ERROR") == -1 :
            # Convert the retrieved column of users to a list to enable easy conversion to json
            cmdOutputList = []
            #cmdOutputList = cmdOutputString.split("\n")
            cmdOutputString = '{"' + cmdOutputString + '"}'
            cmdOutputString = cmdOutputString.replace("\n", '","')
            cmdOutputString = cmdOutputString.replace(":", '":"')
            logger.debug("cmdOutputList = " + repr(cmdOutputList))
            return json.dumps(ast.literal_eval(cmdOutputString))
        else:
            returnString = '{"redirect":"' + cmdOutputString  + '"}'
            return returnString
            #raise web.redirect('/error/'+cmdOutputString)
            #raise web.redirect('http://www.google.com')
            
	def PUT(self, userID):
		web.header('Content-Type', 'application/JSON')
		
#		form = web.input()
#		UserID = form.userID
#		FullName = form.fullName
#		Role = form.role
#		RoomNumber = form.roomNumber
#		WorkPhone = form.workPhone
#		Password = form.userpass
		cmdOutputList = ["a","b"]
		return json.dumps(cmdOutputList)
        #return "admiralupdateuserinfo.sh"+ " "+RemoteUserID+ " "+UserID+ " "+FullName+ " "+Role+ " "+RoomNumber+ " "+Workphone+ " "+Password
#		if not web.ctx.environ.has_key('HTTP_AUTHORIZATION') or  not web.ctx.environ['HTTP_AUTHORIZATION'].startswith('Basic '):
#			return web.Unauthorized()
#		else:
#			hash = web.ctx.environ['HTTP_AUTHORIZATION'][6:]
#			remoteUser, remotPasswd = base64.b64decode(hash).split(':')
#
#		admiralUser = userID
#		#admiralupdateuserinfo.sh RemoteUserID UserID [FullName] [Role] [Room Number] [Work phone] [Password]
#		accesspath = "/usr/local/sbin/admiralupdateuserinfo.sh" + " " + remoteUser + " " + admiralUser
#		logger.debug("accesspath = " + repr(accesspath))
#		cmdOutput = subprocess.Popen(accesspath, shell=True, stdout=subprocess.PIPE)
#		cmdOutputString = cmdOutput.stdout.read()
#		cmdOutputString = cmdOutputString.strip()
#		#print "Status: 303 ADMIRAL SERVER ERROR"
#
#		if cmdOutputString.find("ADMIRAL SERVER ERROR") == -1 :
#			# Convert the retrieved column of users to a list to enable easy conversion to json
#			cmdOutputList = []
#			#cmdOutputList = cmdOutputString.split("\n")
#			cmdOutputString = '{"' + cmdOutputString + '"}'
#			cmdOutputString = cmdOutputString.replace("\n", '","')
#			cmdOutputString = cmdOutputString.replace(":", '":"')
#			logger.debug("cmdOutputList = " + repr(cmdOutputList))
#			return json.dumps(ast.literal_eval(cmdOutputString))
#		else:
#			returnString = '{"redirect":"' + cmdOutputString  + '"}'
#			return returnString            
            
        #return "Admiral User Details"

class AdmiralError:
    def GET(self, errorMessage):
        #returnString = '{"redirect":"' +  errorMessage + '"}'
        #return json.dumps(ast.literal_eval(returnString))

        if web.ctx.environ.has_key('HTTP_REFERER') or  web.ctx.environ['HTTP_REFERER'].endswith('AdminFrontPage.html'):
            web.header('Content-Type', 'text/html')
            returnString ="""
            <html>
                <head>
                    <title>ADMIRAL: ADMIRAL User Administration</title>
                    <link rel="stylesheet" href="./../css/AdminUI.css" type="text/css" />
                </head>
                <body>
                   <div>
                     <span id="logo"><a href="/"><img alt="site_logo" src="/images/Admiral-logo-284x100.png" border="0"/></a></span>
                     <!-- <span id="logout"><a href="/tool/AdminUI/html/AdminFrontPage.html">logout</a></span> -->
                   </div>
                   <h1>ADMIRAL User Administration</h1>"""

            returnString=returnString + "<h2>" + errorMessage + "</h2>"

            returnString=returnString + """
                   <form id="adminForm" name="adminForm" action="/tool/AdminUI/html/AdminFrontPage.html" method="post">
                         <div class="box">
                           <span class="labelvalue">
                             <input name="back" id="back" type="submit" value="Back"/>
                           </span>
                        </div>
                   </form>
                 </body>
            </html> """
            return returnString
        else:
             web.header('Content-Type', 'text/plain')
             return  json.dumps(errorMessage)
