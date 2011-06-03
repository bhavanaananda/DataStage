if (typeof admiral == "undefined")
{
    admiral = {};
}

jQuery(document).ready( function ()
{
   jQuery("#userAddButton").click( function()
   {
      //alert("add button clicked");
      addURL = 'UserDetailsPage.html?operation=Add&user='
      jQuery("#adminForm").attr('action', addURL); 
      return true;
   });   
   
   jQuery("#userModifyButton").click( function()
   {
      //alert("add button clicked");
      addURL = "UserDetailsPage.html?operation=Modify&user="+jQuery("#selectedUser").val();
      jQuery("#adminForm").attr('action', addURL); 
      return true;
   }); 
   
   jQuery("#userDelButton").click( function()
   {
      //alert("add button clicked");
      addURL = "UserDetailsPage.html?operation=Delete&user="+jQuery("#selectedUser").val();
      jQuery("#adminForm").attr('action', addURL); 
      return true;
   }); 
   
   jQuery("#cancel").click( function()
   {   
      //alert("cancel button clicked");
      cancelURL = "/";
      jQuery("#adminForm").attr('action', cancelURL); del
      return true;
   });
   
   var m = new admiral.AsyncComputation();
            
   m.eval(function(value,callback)
   {  
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
    jQuery("#userList").empty();
    jQuery.each(list, function(key, value)
    {   
         jQuery("#userList").append(jQuery("<option class='userListItem'></option>").attr("value",key).text(value)); 
    }); 
    
   // Set click handler on user selected
   jQuery("#userList > .userListItem").click( function()
   { 
      jQuery("#selectedUser").val(jQuery(this).text());              
   });     
}  