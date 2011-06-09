if (typeof admiral == "undefined")
{
    admiral = {};
}

jQuery(document).ready( function ()
{
    // Get Dir value from the url to know what type of user operation is being requested Add/Modify/Del
    url = document.URL;
    var keyvaluepairs = url.split("=");
    var str = keyvaluepairs[1].split("&");
    var operation = str[0];
    if(operation.length>0 && (operation=="Add"|| operation=="Modify"||operation=="Delete"))
    {  
       var user = keyvaluepairs[2];
       jQuery("#userOperation").val(operation);
       jQuery("#userOperation").text(operation);
       jQuery("#userID").val(user);
       if (operation!="Add")
        { 
          jQuery("#userID").attr("disabled",true);
        }
    }
    
  
   //Set defaults for password
   jQuery("#userpass").val("");
   jQuery("#changepass").attr("checked",false);
   if (jQuery('#changepass').is(':checked')) { jQuery("#userpass").attr("disabled",false); } else { jQuery("#userpass").attr("disabled",true); }
   
    
   var m = new admiral.AsyncComputation();
   
   if (operation!="Add")
   {
     m.eval(function(value,callback)
     { 
       var userID= jQuery("#userID").val();
       admiral.userDetails(userID,callback); 
     }); 
         
     m.eval(function(details,callback)
     {
       displayValues(details);
     });
   
     m.exec(null,admiral.noop);
   } 
   else
   {  jQuery('#changepass').hide();
      jQuery('#changepasswordtext').hide();
      jQuery("#userpass").attr("disabled",false);
   }
   
   jQuery('#changepass').click(function()
   {
       jQuery("#userpass").attr("disabled",!this.checked);
   });
     
   jQuery("#back").click( function()
   {   
       //alert("back button clicked");
       backURL = "AdminFrontPage.html";
       jQuery("#adminForm").attr('action', backURL); 
       return true;
   });
   
   jQuery("#userOperation").click( function()
   {  
       var m = new admiral.AsyncComputation();
       m.eval(function(value,callback)
       { 
         var userID= jQuery("#userID").val();
         var userFullName= jQuery("#fullName").val();
         var userRole= jQuery("#role").val();
         var userRoomNumber= jQuery("#roomNumber").val();
         var userWorkPhone= jQuery("#workPhone").val();        
         var userPassword="";
         var userOperation=jQuery("#userOperation").val();
         //operURL = "/admin";
         //jQuery("#adminForm").attr('action', operURL); 

         // Update the password only if the change password checkbox is checked
         if (jQuery('#changepass').is(':checked') || operation=="Add" ) 
         { 
           userPassword=jQuery("#userpass").val();
         }
         
         //if(jQuery("#userOperation").val() == "Modify")
         //{
           admiral.adminUserOperation(userID,userFullName,userRole,userRoomNumber,userWorkPhone,userPassword, userOperation, callback); 
         //}
         
       }); 
             
       m.eval(function(operationDetails,callback)
       {
        // displayValues(operationDetails);
       });      
          m.exec(null,admiral.noop); 
   });
    
   // Set click handler on user selected
   jQuery("#userList > .userListItem").click( function()
   { 
      jQuery("#selectedUser").val(jQuery(this).text());              
   });     

});

   /**
* Read from the details received and display the user details for the selected user.
* 
* @param userDetails ADMIRAL User Details.
* @param callback    Callback function.
*/
function displayValues(userDetails,callback)
{   
    jQuery.each(userDetails, function(key, value)
    {
        if(key=="FullName")
        {   jQuery("#fullName").val(value);
        }
        
       if(key=="RoomNumber")
        {   jQuery("#roomNumber").val(value);
        }
        if(key=="WorkPhone")
        {   jQuery("#workPhone").val(value);
        }
        if(key=="UserRole")
        {   jQuery("#role").val(value);
        }
    }); 

}