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
       jQuery("#userID").val(user);
       jQuery("#userID").attr("disabled",true);
    }
        
    
   jQuery("#back").click( function()
   {   
        //alert("back button clicked");
        backURL = "AdminFrontPage.html";
        jQuery("#adminForm").attr('action', backURL); 
        return true;
   });
   
});