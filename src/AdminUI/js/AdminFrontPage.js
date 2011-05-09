if (typeof admiral == "undefined")
{
    admiral = {};
}

jQuery(document).ready( function ()
{
   jQuery("#userAddButton").click( function()
   {
      //alert("add button clicked");
      addURL = "UserDetailsPage.html";
      jQuery("#adminForm").attr('action', addURL); 
      return true;
   });   
 
   jQuery("#cancel").click( function()
   {   
      //alert("cancel button clicked");
      cancelURL = "/";
      jQuery("#adminForm").attr('action', cancelURL); 
      return true;
   });
   
   var m = new admiral.AsyncComputation();
            
   m.eval(function(value,callback)
   {  
//     jQuery.getJSON('http://localhost:8080/users', function(result) {
//                alert(jQuery.toJSON(result));
//            }); 
     admiral.listUsers(callback); 
   }); 
         
   m.eval(function(list,callback)
   {
     displayValues(list);
   });
   
   m.exec(null,admiral.noop); 
});
      
/**
* Read from the list received and display the list of users.
* 
* @param userList   ADMIRAL Users List.
* @param callback   Callback function.
*/
function displayValues(list,callback)
{   
    jQuery.each(list, function(key, value)
    {   
         jQuery("#userList").append(jQuery("<option></option>").attr("value",key).text(value)); 
    }); 
    
    //jQuery("#userList").append(jQuery("<option></option>").attr("value","user5").text("User5"));                   
}  