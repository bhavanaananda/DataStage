import web
from os.path import join, isdir, normpath
import os, sys, logging, subprocess, ast, base64

import httplib,urllib, urllib2, urlparse
sys.path.append("..")
sys.path.append("../..")

import HttpSession
import AdminUIHandlerUtils
try:
    import simplejson as json
except ImportError:
    import json as json

logger = logging.getLogger("AdminUIHandler")

urls = ('/admin','AdminUIFormHandler',
        '/users','ListAdmiralUsers',
        '/users/(.+)','AddAdmiralUsers',
        '/user/(.+)','GetAdmiralUserDetails',
        '/error/(.+)','DisplayAdmiralError')

app = web.application(urls,globals())

if __name__ == "__main__":
    #web.run(urls, globals())
    #web.config.debug = False
    app = web.application(urls,globals())
    app.run()

    # app = web.application(urls, globals(), autoreload=False)
    # application = app.wsgifunc()
class AdminUIFormHandler:
    def POST(self):
        print "POST in AdminUIFormHandler"
        reqdata = web.data()
        print "Request POST data obtained from the client before redirection"+reqdata
        jsonInputData = json.loads(reqdata)
        print "JSON INPUT DATA =" + repr(jsonInputData)

        UserID       =  jsonInputData["UserID"]
        print "UserID= "+ UserID
        # FullName   =  jsonInputData["UserFullName"]
        # Role       =  jsonInputData["UserRole"]
        RoomNumber   =  jsonInputData["UserRoomNumber"]
        print "Room Number: " + RoomNumber
        # WorkPhone  =  jsonInputData["UserWorkPhone"]
        # Password   =  jsonInputData["UserPassword"]
        Operation    =  jsonInputData["UserOperation"]
        print "Operation = " + Operation

        if Operation=="Modify":
                method="PUT"
                url = '/user/'+UserID
        elif Operation=="Add":
                method="POST"
                url = '/users/'+UserID
        elif Operation=="Delete":
                method="DELETE"
                url = '/user/'+UserID

        endpointhost = "localhost"
        basepath = '/user/'+UserID
        responsedata = ""

        if not web.ctx.environ.has_key('HTTP_AUTHORIZATION') or  not web.ctx.environ['HTTP_AUTHORIZATION'].startswith('Basic '):
                return web.Unauthorized()
        else:
                hash = web.ctx.environ['HTTP_AUTHORIZATION'][6:]
                remoteUser, remotePasswd = base64.b64decode(hash).split(':')

        auth = base64.encodestring("%s:%s" % (remoteUser, remotePasswd))
        headers = {"Authorization" : "Basic %s" % auth}
        data = reqdata#jsonInputData
        #data = web.http.urlencode(jsonInputData)
        print "URL encoded data before sending=" + repr(data)
        try:
                session  = HttpSession.makeHttpSession(endpointhost, basepath, remoteUser,remotePasswd)
               # encodeddata = session.encode_multipart_formdata(jsonInputData)
               # (responsetype, responsedata)=session.doHTTP_PUT( resource='/user/'+UserID,data=None, data_type='application/JSON', expect_status=200, expect_reason="OK")
               # (responsetype, responsedata)=session.doHTTP_GET( resource='/users', expect_status=200, expect_reason="OK")
                connection =  httplib.HTTPConnection('localhost', timeout=30)
                connection.request(method, url, body=data, headers=headers)
               # connection.endheaders()
               # connection.send(jsonInputData)
                response = connection.getresponse()
                responsedata = response.read()
               # connection.close()
               # req = urllib2.Request(url, data)
               # response = urllib2.urlopen(req)
               # responsedata = response.read()
        except session.HTTPSessionError, e:
               #AdminUIHandlerUtils.printHTMLHeaders()
               # AdminUIHandlerUtils.generateErrorResponsePage(AdminUIHandlerUtils.HTTP_ERROR,e.code, e.reason)
               # AdminUIHandlerUtils.printStackTrace()
               returnString = '{"redirect":"' + e.code + "-" + e.reason + '"}'
               print returnString
               return returnString
               # print "</body>"
               # print "</html>"
        except httplib.HTTPException, e:
               returnString = '{"redirect":"' + e.code + "-" + e.reason + '"}'
               print returnString
               return returnString
               # response = app.request('https://localhost/user/'+UserID, method='PUT', data=jsonInputData)
               # respdata = json.dumps(response)


        print "POST RESULT=" + repr(responsedata)
        return json.dumps(responsedata)
       
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

class AddAdmiralUsers:
    def POST(self,UserID):
        web.header('Content-Type', 'application/JSON')
        print "Web.data() = " + web.data()
        #jsonInputData = json.loads(web.data())
        jsonInputData = urlparse.parse_qs(web.data().replace('\n', "").replace('\r', ""), keep_blank_values=True)
        print "jsonInputData = " + repr(jsonInputData)
        #print "PUT : "  + jsonInputData
        UserID     =  jsonInputData["UserID"]
        FullName   =  jsonInputData["UserFullName"]
        Role       =  jsonInputData["UserRole"]
        RoomNumber =  jsonInputData["UserRoomNumber"]
        WorkPhone  =  jsonInputData["UserWorkPhone"]
        Password   =  jsonInputData["UserPassword"]
        Operation  =  jsonInputData["UserOperation"]

        if not web.ctx.environ.has_key('HTTP_AUTHORIZATION') or  not web.ctx.environ['HTTP_AUTHORIZATION'].startswith('Basic '):
                return web.Unauthorized()
        else:
                hash = web.ctx.environ['HTTP_AUTHORIZATION'][6:]
                remoteUser, remotPasswd = base64.b64decode(hash).split(':')

        admiralUser = UserID
        print "USAGE: admiralupdateuserinfo.sh  RemoteUserID UserID [FullName] [Role] [Room Number] [Work phone] [Password]"
        commandString = "/usr/local/sbin/admiraladdnewuser.sh" + " " + "'" + remoteUser + "'" + " " + "'" + admiralUser + "'" + " " + "'" + FullName + "'" + " " + "'" + Role + "'" + " " + "'" + RoomNumber + "'" +  " " + "'" + WorkPhone + "'" +  " " + "'" + Password + "'" 
        print commandString
        logger.debug("commandString = " + repr(commandString))
        cmdOutput = subprocess.Popen(commandString, shell=True, stdout=subprocess.PIPE)
        cmdOutputString = cmdOutput.stdout.read()
        cmdOutputString = cmdOutputString.strip()

        if cmdOutputString.find("ADMIRAL SERVER ERROR") == -1 :
                #cmdOutputList = []
                #cmdOutputList = cmdOutputString.split("\n")
                #cmdOutputString = '{"' + cmdOutputString + '"}'
                #cmdOutputString = cmdOutputString.replace("\n", '","')
                #cmdOutputString = cmdOutputString.replace(":", '":"')
                #logger.debug("cmdOutputList = " + repr(cmdOutputList))
                #return json.dumps(ast.literal_eval(cmdOutputString))

                return json.dumps({"Update": "Successful"})
        else:
                returnString = '{"redirect":"' + cmdOutputString  + '"}'
                return returnString

      	#	return json.dumps({"Update": "Failed"})
        #       return json.dumps(jsonInputData)
		#return "Admiral User Details"
   
class GetAdmiralUserDetails:
    def GET(self, userID):
        web.header('Content-Type', 'application/JSON')

        if not web.ctx.environ.has_key('HTTP_AUTHORIZATION') or  not web.ctx.environ['HTTP_AUTHORIZATION'].startswith('Basic '):
            return web.Unauthorized()
        else:
            hash = web.ctx.environ['HTTP_AUTHORIZATION'][6:]
            remoteUser, remotePasswd = base64.b64decode(hash).split(':')

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
        print "Web.data() = " + web.data()
        
        jsonInputData = json.loads(web.data())
        #jsonInputData = urlparse.parse_qs(web.data().replace('\n', "").replace('\r', ""), keep_blank_values=True)
        print "jsonInputData = " + repr(jsonInputData)
        #print "PUT : "  + jsonInputData
        UserID     =  jsonInputData["UserID"]
        FullName   =  jsonInputData["UserFullName"]
        Role       =  jsonInputData["UserRole"]
        RoomNumber =  jsonInputData["UserRoomNumber"]
        WorkPhone  =  jsonInputData["UserWorkPhone"]
        Password   =  jsonInputData["UserPassword"]
       # Operation  =  jsonInputData["UserOperation"]

        if not web.ctx.environ.has_key('HTTP_AUTHORIZATION') or  not web.ctx.environ['HTTP_AUTHORIZATION'].startswith('Basic '):
                return web.Unauthorized()
        else:
                hash = web.ctx.environ['HTTP_AUTHORIZATION'][6:]
                remoteUser, remotPasswd = base64.b64decode(hash).split(':')

        admiralUser = userID
        print "USAGE: admiralupdateuserinfo.sh  RemoteUserID UserID [FullName] [Role] [Room Number] [Work phone] [Password]"
        commandString = "/usr/local/sbin/admiralupdateuserinfo.sh" + " " + "'" + remoteUser + "'" + " " + "'" + admiralUser + "'" + " " + "'" + FullName + "'" + " " + "'" + Role + "'" + " " + "'" + RoomNumber + "'" +  " " + "'" + WorkPhone+ "'" +  " " + "'" + Password + "'" 
        print commandString
        logger.debug("commandString = " + repr(commandString))
        cmdOutput = subprocess.Popen(commandString, shell=True, stdout=subprocess.PIPE)
        cmdOutputString = cmdOutput.stdout.read()
        cmdOutputString = cmdOutputString.strip()

        if cmdOutputString.find("ADMIRAL SERVER ERROR") == -1 :
                #cmdOutputList = []
                #cmdOutputList = cmdOutputString.split("\n")
                #cmdOutputString = '{"' + cmdOutputString + '"}'
                #cmdOutputString = cmdOutputString.replace("\n", '","')
                #cmdOutputString = cmdOutputString.replace(":", '":"')
                #logger.debug("cmdOutputList = " + repr(cmdOutputList))
                #return json.dumps(ast.literal_eval(cmdOutputString))
                return json.dumps({"Update": "Successful"})
        else:
                #returnString = '{"redirect":"' + cmdOutputString  + '"}'
                #return returnString
                return json.dumps({"Update": "Failed"})

#       return json.dumps(jsonInputData)
        #return "Admiral User Details"
class DisplayAdmiralError:
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
