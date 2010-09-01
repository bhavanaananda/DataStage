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

RDFManifest.myFunction = function(jelem, fileAbsolutePaths)
{
	
	/*
	tree creation routine
	basic idea:
	if term is new at level n, create it
	if term is not new at level n, 
		create it if entire path leading to it and including it ( = 'prior path') is unique
		* 	for example: given apps/x/y/z    y has prior path =jjv apps/x/y  
		the whole path must be checked
	an array of paths must be created for each level, including the term at that level
	if an array of paths does not yet exist for a level 
		1. create it
		2. push it onto the array of arrays, in which it will occupy a position equal to its level
			example: if there are a maximum of 8 arrays for a data set, the arrayOfArrays will eventually have 8 members, each of which records all prior paths that have so far been created for that level 
	for each term,
		the array of paths must be searched
	
	
	*/
	
	/*
	 * simpler way
	 * for each absolutePath
	 * split
	 * process each segment
	 * 	for each segment
	 * 		reconstruct the inclusive path
	 * 		if inclusivePath not already in pathsCreated array
	 * 			create
	 * 		else do not create
	 */


	var inclusivePathsAlreadyCreated = new Array();
	
	for(i = 0; i < fileAbsolutePaths.length; i++){
//		jelem.append("<br />" + fileAbsolutePaths[i]); 
		var pathSegments = fileAbsolutePaths[i].split("/");
		var previousLevel = "";
		var currentLevel = "";
		//process each segment
		for (j = 0;j < pathSegments.length; j++){
			//reconstruct inclusive path for each successive term
			if (j < pathSegments.length-1) {
				currentLevel += pathSegments[j];
				currentLevel += "/";
			}
			else {
				currentLevel += pathSegments[j];
			}
			//check to see if this inclusivePath has already been created
			if (! inclusivePathsAlreadyCreated.contains(currentLevel)) {
				//create
				//add the node to previousLevel (j - 1)
				RDFManifest.addNode(pathSegments[j]);
			}
			previousLevel += pathSegments[j];
			
		}
	}

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
//        jelem.append('div')
//         .html("Manifest contains "+rq.length+" triples (<a href=\""+rq[0].s.value+"/manifest.rdf\">show manifest</a>");
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
        jelem.append("<h3>Contents of Dataset " + "<br /><br />" + "<a href=\""+rq[0].s.value+"\">" + rq[0].s.value + "</a></h3>");

        var newText = "";
        var fileAbsolutePaths = new Array();

        
        rq.each(function ()
        {
             if(shuffl.starts(this.s.value.toString(), this.o.value.toString())) {
//               jelem.append("<tr><td>"+this.s.value+"</td><td><a href=\""+this.o.value+"\">"+jQuery.uri.relative(this.o.value, this.s.value).toString()+"</a></td></tr>");
//				 jelem.append("<a href=\""+this.o.value+"\">"+jQuery.uri.relative(this.o.value, this.s.value).toString()+"</a>");
//				 jelem.append("\n");
				 newText = newText + "<a href=\""+this.o.value+"\">"+jQuery.uri.relative(this.o.value, this.s.value).toString()+"</a><br />";
				 
				 fileAbsolutePaths.push(jQuery.uri.relative(this.o.value, this.s.value).toString());
            }
        });
    //    jelem.append("</table>");
    	 
    	  jelem.append("<div style=\"border-color:#600;border-width: 1px 1px 1px 1px;border-style:solid;width:700px;height:100px;background-color: #FFE;overflow:auto;\" >" + newText + "</div>");
 

		  RDFManifest.myFunction(jelem, fileAbsolutePaths);
             
 
    	 
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

    m.exec("http://163.1.127.173/admiral-test/datasets/apps", shuffl.noop);
};

