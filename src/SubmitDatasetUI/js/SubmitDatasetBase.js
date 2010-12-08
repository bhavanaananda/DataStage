
jQuery(document).ready( function ()
{
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
            var here  = this;
            var n = new admiral.AsyncComputation();
    
            n.eval(function(directorySelected,callback)
            { 
              jQuery("#datDir").val(directorySelected);
              // Get the persisted informaton from the server for display for the directory selected from the list
              admiral.getMetadata(directorySelected,callback); 
            });
    
            // Populate the other fields with the value received
            n.eval(function(directoryValues,callback)
            {                                 
              jQuery("#datId").val(directoryValues["identifier"]);
              jQuery("#description").val(directoryValues["description"]);
              jQuery("#user").val(directoryValues["creator"]);
              jQuery("#title").val(directoryValues["title"]);
            });
            
            n.exec( jQuery(this).text(),admiral.noop);                  
        });
    }); 
                       
    m.exec(null,admiral.noop);
});                    