if (typeof admiral == "undefined")
{
    admiral = {};
}


admiral.displayDirectories = function (callback)
{
       val = "../../SubmitDatasetHandler/cgi-bin/DirectoryListingHandler.py"
       jQuery.ajax({
            type:         "GET",
            url:           val,
            dataType:     "json",
            beforeSend:   function (xhr)
                {
                    xhr.setRequestHeader("Accept", "application/JSON");
                },
            success:      function (data, status, xhr)
                {   //log.debug("Display Directories: " + jQuery.toJSON(data))
                    callback(data);
                },
            error:        function (xhr, status) 
                { 
                    jQuery("#pageLoadStatus").text("HTTP GET "+val+" failed: "+status+"; HTTP status: "+xhr.status+" "+xhr.statusText);
                    jQuery("#pageLoadStatus").addClass('error');
                },
            cache:        false
                   });

}