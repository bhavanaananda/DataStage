/**
 * $Id: $
 *
 * Javascript code to read and display an RDFDatabank manifest in a supplied jQuery object.
 */


Array.prototype.contains = function(o) {
for(var i = 0; i < this.length; i++)
   if(this[i] === o)
     return true;
return false;
}




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
        rq.each(function ()
        {
            jelem.text("");
            if(this.p.value.toString()=="http://purl.org/dc/terms/isVersionOf") {
//                jelem.append("<p>Dataset derived from " + this.o.value + "</p>");
                  jQuery("#derivedFrom > a").text(this.o.value.toString());
                  jQuery("#derivedFrom > a").attr("href", this.o.value);
            } else if(this.p.value.toString()=="http://purl.org/dc/terms/modified") {
                jQuery("#lastModified").text(this.o.value);
 
            }
        });
        jelem.append("<h3>Contents of Dataset </h3>");
        jQuery("#datasetLink").attr("href", rq[0].s.value);

        var newText = "";
        var fileAbsolutePaths = new Array();

        
        rq.each(function ()
        {
             if(shuffl.starts(this.s.value.toString(), this.o.value.toString())) {
				 newText = newText + "<a href=\""+this.o.value+"\">"+jQuery.uri.relative(this.o.value, this.s.value).toString()+"</a><br />";
				 
				 fileAbsolutePaths.push(jQuery.uri.relative(this.o.value, this.s.value).toString());
            }
        });
 
    	jelem.append("<div style=\"border-color:#600;border-width: 1px 1px 1px 1px;border-style:solid;width:700px;height:100px;background-color: #FFE;overflow:auto;\" >" + newText + "</div>");


             
 
    	 
 //   	  jelem.append('div')
 //   	    .css('border-color','#600')
 //  	    .css('border-width', '1px 1px 1px 1px')
 //   	    .css('border-style', 'solid')
 //   	    .css('width', '700px')
 //   	    .css( 'height', '100px')
 //   	    .css('background-color', '#FFE')
 //   	    .css('overflow', 'auto');
 //   	  jelem.html(newText);
    	 
    });

    m.exec("/admiral-test/datasets/apps", shuffl.noop);
};

