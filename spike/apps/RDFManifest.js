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
        jelem.html("<p>Manifest displays here: "+rq.length+" triples</p>");
        jelem.append("<p>"+rq.eq(0).dump({format:'application/json', serialize: true})+"</p>");
        var s = rq.eq(0).node('?s');
        var p = rq.eq(0).node('?p');
        var o = rq.eq(0).node('?o');        
    });

    m.exec("http://163.1.127.173/admiral-test/datasets/apps", shuffl.noop);
};

