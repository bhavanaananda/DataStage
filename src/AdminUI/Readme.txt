ADMIRAL SERVER:

1> Install web.py : http://webpy.org/install
2> Install smbldap-tools using apt-get
3> Run the RESTful application:
   $ python  \googlecode-admiral-jiscmrd\src\AdminUIHandler\services\AdminUIHandler.py
     http://0.0.0.0:8080/
     
     
4> (proxy... modwsgi replaces proxy, may be)
     ...
5> Access the Admin UI interface from the browser:

   The following lists all the Admiral users in json format:
   ex: http://zoo-admiral-ibrg.zoo.ox.ac.uk/users
   
   The following lists the Admiral user details in json format:
   ex: http://zoo-admiral-ibrg.zoo.ox.ac.uk/user/TestUser1

______________________________________________________________________________________________
Note: 
Default port for webpy :8080

\googlecode-admiral-jiscmrd\admiral-base - Contains scripts (.sh files)
\googlecode-admiral-jiscmrd\src\AdminUI  - Contains UI (html, css, js)
\googlecode-admiral-jiscmrd\src\AdminUIHandler - Contains RESTful services ( .py ) ....

The following .sh files are added to admiral-base to help the Admin UI Interface
1> listAdmiralUsers.sh 
   # $1 RemoteUserID ex: TestUser1
   # $2 FolderPath ex: /home/data/private

2> admiraluserinfo.sh
   # $1 RemoteUserID requesting the UserID details
   # $2 UserID  whose details are being requested by RemoteUserID

3> admiralupdateuserinfo.sh
   # $1 RemoteUserID trying to update the UserID details
   # $2 UserID for whose details are being updated
   # $3 FullName Updated FullName of the Admiral User with ID=UserID
   # $4 Role Updated Role of the Admiral User with ID=UserID
   # $5 RoomNumber Updated Room Number of the Admiral User with ID=UserID
   # $6 WorkPhone Updated Work Phone Number of the Admiral User with ID=UserID
   # $7 Password Updated Password for the Admiral User with ID=UserID

To Do : ( look at authentication issues for remote user ID)
