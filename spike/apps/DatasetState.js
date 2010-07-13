/**
 * $Id: $
 *
 * Javascript code to read and display information about a RDFDatabank dataset in a supplied jQuery object.
 */

if (typeof DatasetState == "undefined")
{
    DatasetState = {};
}

DatasetState.display = function (jelem)
{
    var m = new shuffl.AsyncComputation();
    // Read dataset information
    m.eval(function (val, callback)
    {
        jelem.text("Fetching dataset information...");
        jQuery.ajax({
            type:         "GET",
            url:          val,
            username:     "admiral",
            password:     "admiral",
            dataType:     "json",
            beforeSend:   function (xhr)
                {
                    xhr.setRequestHeader("Accept", "application/JSON");
                },
            success:      function (data, status, xhr)
                {
                    callback(data);
                },
            error:        function (xhr, status) 
                { 
                    jelem.text("HTTP GET "+val+" failed: "+status+"; HTTP status: "+xhr.status+" "+xhr.statusText);
                    jelem.css('color', 'red');
                },
            cache:        false
        });
    });

    // Extract and parse JSON information
    m.eval(function (data, callback)
    {
        jelem.text("Interpreting information...");
        try
        {
             embargo = data.state.metadata.embargoed;
             var jsondata = jQuery.toJSON(data);
             // jelem.append("<p>" + jsondata + "</p>");
             jelem.text("");
             jelem.append("<br /><table>");
             jelem.append("<tr><td><strong>Property</strong></td>" + "<td><strong>Value</strong></td></tr>");
             jelem.append("<tr><td>Submission identifier</td><td>" + data.state.item_id + "</td></tr>");
             jelem.append("<tr><td>Created by</td><td>" + data.state.metadata.createdby + "</td></tr>");
             jelem.append("<tr><td>Current version</td><td>" + data.state.currentversion + "</td></tr>");
             jelem.append("<tr><td>Embargoed?</td><td>" + embargo + "</td></tr>");
             if (embargo == true) {
                 jelem.append("<tr><td>Embargo expiry date</td><td>" + data.state.metadata.embargoed_until + "</td></tr>");
             }
             jelem.append("<tr><td>RDF file format</td><td>" + data.state.rdffileformat + "</td></tr>");
             jelem.append("<tr><td>RDF file name</td><td>" + data.state.rdffilename + "</td></tr>");
             jelem.append("</table>");
        } 
        catch(e)
        {
            jelem.text("JSON decode: "+e);
            jelem.css('color', 'red');
        }
    });

    m.exec("http://163.1.127.173/admiral-test/datasets/apps", shuffl.noop);
};

