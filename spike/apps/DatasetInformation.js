/**
 * $Id: $
 *
 * Javascript code to read and display information about a RDFDatabank dataset in a supplied jQuery object.
 */

if (typeof DatasetInformation == "undefined")
{
    DatasetInformation = {};
}

var base_dataset = "http://163.1.127.173/admiral-test/datasets/apps";

DatasetInformation.display = function (jelem)
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
             jelem.append("br /><center>" + data.state.item_id + "</center>" + "  the link to rdf datasetname " );
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
             callback(base_dataset);
        } 
        catch(e)
        {
            jelem.text("JSON decode: "+e);
            jelem.css('color', 'red');
        }
    });

    m.eval(function (val, callback)
    {
        jelem.append("Fetching manifest ...");
        jQuery.ajax({
            type:         "GET",
            url:          val,
            username:     "admiral",
            password:     "admiral",
            dataType:     "xml",
            beforeSend:   function (xhr)
                {
                    xhr.setRequestHeader("Accept", "application/rdf+xml");
                },
            success:      function (data, status, xhr)
                {
                    callback(data);
                },
            error:        function (xhr, status) 
                { 
                    jelem.append("HTTP GET "+val+" failed: "+status+"; HTTP status: "+xhr.status+" "+xhr.statusText);
                    jelem.css('color', 'red');
                },
            cache:        false
        });
    });

    // Create RDFquery databank
    m.eval(function (data, callback)
    {
        try
        {
            var databank = jQuery.rdf.databank();
            databank.load(data);
            callback(jQuery.rdf({databank: databank}));
        } 
        catch(e)
        {
            jelem.append("Databank decode: "+e);
            jelem.css('color', 'red');
        }
    });

    // Display results from databank
    m.eval(function (rq, callback)
    {
        rq = rq.where('?s ?p ?o');
        jelem.append("<p>Manifest displays here: "+rq.length+" triples</p>");
        var i = 0;
/*        while (i<rq.length) {
            jelem.append("<p>"+rq.eq(i).dump({format:'application/json', serialize: true})+"</p>");
            i++;
        }*/
        jelem.append("<table>");
        jelem.append("<tr><td><strong>Subject</strong></td><td><strong>Property</strong></td><td><strong>Object</strong></td></tr>");
        rq.each(function ()
        {
            jelem.append("<tr><td>"+this.s.value+"</td><td>"+this.p.value+"</td><td>"+jQuery.url.param(this.o.value)+"</td></tr>");
        });
        jelem.append("</table>");
    });

    m.exec(base_dataset, shuffl.noop);
};

