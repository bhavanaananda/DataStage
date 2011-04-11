jQuery(document).ready( function ()
{
   jQuery("#back").click( function()
   {   
        //alert("back button clicked");
        backURL = "AdminFrontPage.html";
        jQuery("#adminForm").attr('action', backURL); 
        return true;
   });
   
});