/**
 * $Id: $
 *
 * Javascript code to read and display an RDFDatabank manifest in a supplied jQuery object.
 */

if (typeof RDFManifest == "undefined")
{
    RDFManifest = {};
}

RDFManifest.display = function (jelem)
{
    var m = new shuffl.AsyncComputation();
    // Read manifest RDF/XML
    m.eval(function (val, callback)
    {
        jelem.text("Fetching manifest...");
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
                    jelem.text("HTTP GET "+val+" failed: "+status+"; HTTP status: "+xhr.status+" "+xhr.statusText);
                    jelem.css('color', 'red');
                },
            cache:        false
        });
    });

    // Create RDFquery databank
    m.eval(function (data, callback)
    {
        jelem.text("Decoding manifest...");
        try
        {
            var databank = jQuery.rdf.databank();
            databank.load(data);
            callback(jQuery.rdf({databank: databank}));
        } 
        catch(e)
        {
            jelem.text("Databank decode: "+e);
            jelem.css('color', 'red');
        }
    });

    // Display results from databank
    m.eval(function (rq, callback)
    {
        rq = rq.where('?s ?p ?o');
        jelem.html("<p>Manifest contains "+rq.length+" triples (<a href=\""+rq[0].s.value+"/manifest.rdf\">show manifest</a>)</p>");
/*        jelem.append("<div style=\"display: none;\">");
        jelem.append("<table");
        jelem.append("<tr style=\"display: none;\"><td><strong>Subject</strong></td><td><strong>Property</strong></td><td><strong>Object</strong></td></tr>");

        rq.each(function ()
        {
            jelem.append("<tr><td>"+this.s.value+"</td><td>"+this.p.value+"</td><td>"+this.o.value+"</td></tr>"); 
        });
        jelem.append("</table>");
        jelem.append("</div>");*/
/*        while (i<rq.length) {
            jelem.append("<p>"+rq.eq(i).dump({format:'application/json', serialize: true})+"</p>");
            i++;
        }*/
        rq.each(function ()
        {
            if(this.p.value.toString()=="http://purl.org/dc/terms/isVersionOf") {
                jelem.append("<p>Dataset derived from " + this.o.value + "</p>");
            } else if(this.p.value.toString()=="http://purl.org/dc/terms/modified") {
                jelem.append("<p>Dataset last modified at " + this.o.value + "</p>");
            }
        });
        jelem.append("<h3>Dataset contents</h3>");
        jelem.append("<table>");
        jelem.append("<tr><td><strong>Dataset</strong></td><td><strong>Filename</strong></td></tr>");
        rq.each(function ()
        {
             if(shuffl.starts(this.s.value.toString(), this.o.value.toString())) {
               jelem.append("<tr><td>"+this.s.value+"</td><td><a href=\""+this.o.value+"\">"+jQuery.uri.relative(this.o.value, this.s.value).toString()+"</a></td></tr>");
            }
        });
        jelem.append("</table>");
    });

    m.exec("http://163.1.127.173/admiral-test/datasets/apps", shuffl.noop);
};

