
jQuery(document).ready( function ()
{
   url = document.URL;
   // Get Dir value from the url to display as default and get metadata information for the dataset dir
   var dir = url.split("=");
   if(dir.length>1)
   { 
       displayValues(dir[1]);
   }
   jQuery("#submitForm").submit( function()
   {   data = "The following values were entered . Click Ok to confirm submit or Cancel to return.  \n\n"
       data = data +"Dataset Dir = "+ jQuery("#datDir").val()+"\nDataset ID  = "+ jQuery("#datId").val()+"\nTitle            = "+jQuery("#title").val()+"\nDescription = "+jQuery("#description").val() ;
       confirmValue =  confirm(data);
       if (confirmValue)
        return true;
       else
        return false;
   });
                           
   var m = new admiral.AsyncComputation();
   m.eval(function(value,callback)
   {    // Execute the desired dataset listing logic
        admiral.displayDirectories(callback);           
   });
    
   m.eval(function(value,callback)
   {                    
        // Populate directory listing box with results received
        jQuery("#dirlist").empty();
        for (i=0; i<value.length; i++)
        {  
           newjelem='<span class="dirlistitem">'+value[i]+'</span>';
           jQuery("#dirlist").append(newjelem);
        }
        callback(value);
   });    
   
   m.eval(function(value, callback)
   {
        // Set click handlers on directory items
        jQuery("#dirlist > .dirlistitem").click( function()
        {   
           displayValues(jQuery(this).text());                    
        });
    }); 
                       
    m.exec(null,admiral.noop);
});       


function displayValues(directorySelected,callback)
{       
      var n = new admiral.AsyncComputation(); 
      n.eval(function(directorySelected,callback)
      { 
       jQuery("#datDir").val(directorySelected);
       // Get the persisted informaton from the server for display for the directory selected from the list
       admiral.getMetadata(directorySelected,callback); 
      });
     
      // Populate the other fields with the value received
      n.eval(function(formValues,callback)
      {                                 
       jQuery("#datId").val(formValues["identifier"]);
       jQuery("#description").val(formValues["description"]);
       jQuery("#user").val(formValues["creator"]);
       jQuery("#title").val(formValues["title"]);
      });    
      n.exec( directorySelected,admiral.noop);          
}            
                             