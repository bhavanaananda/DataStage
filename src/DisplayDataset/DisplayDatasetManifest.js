/**
 * @fileoverview
 *  Read an RDFDatabank manifest, and display in a supplied jQuery object.
 *  
 * @author Ben Weaver
 * @version $Id: $
 * 
 * Coypyright (C) 2010, University of Oxford
 *
 * Licensed under the MIT License.  You may obtain a copy of the License at:
 *
 *     http://www.opensource.org/licenses/mit-license.php
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

if (typeof admiral == "undefined")
{
	admiral = {};
}

/**
 * Read an RDFDatabank manifest, and display in a supplied jQuery object.
 * 
 * @param datasetPath   String containing the URI path of the dataset to be displayed.
 * @param callback      callback function invoked when the dataset status has been read and displayed.
 */
admiral.displayDatasetManifest = function (datasetPath, datasetName, callback)
{
    log.debug("admiral.displayDatasetManifest "+datasetPath+", "+datasetName);
    var m = new admiral.AsyncComputation();

    // Read manifest RDF/XML
    m.eval(function (val, callback)
    {
        jQuery(".manifest").text("Fetching manifest...");
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
                    jQuery("#pageLoadStatus").text("HTTP GET "+val+" failed: "+status+"; HTTP status: "+xhr.status+" "+xhr.statusText);
                    jQuery("#pageLoadStatus").addClass('error');
                },
            cache:        false
        });
    });

    // Create RDFquery databank
    m.eval(function (data, callback)
    {
        jQuery(".manifest").text("Decoding manifest...");
        try
        {
            var databank = jQuery.rdf.databank();
            databank.load(data);
            callback(jQuery.rdf({databank: databank}));
        } 
        catch(e)
        {
            jQuery("#pageLoadStatus").text("Databank decode: "+e);
            jQuery("#pageLoadStatus").addClass('error');
        }
    });

    // Display results from databank
    m.eval(function (rq, callback)
    {
        rq = rq.where('?s ?p ?o');

        jQuery("#datasetLink").attr("href", rq[0].s.value);

        var baseUri           = "";
        var subdate           = "";
        var fileAbsolutePaths = new Array();
        var fileRelativePaths = new Array();

        rq.each(function ()
        {
            if (this.p.value.toString()=="http://purl.org/dc/terms/isVersionOf")
            {
				jQuery("#derivedFrom > a").text(this.o.value.toString());
				jQuery("#derivedFrom > a").attr("href", this.o.value.toString());
            } 
            
            else if (this.p.value.toString()=="http://purl.org/dc/terms/title")
            {
                jQuery("#title").text(this.o.value.toString());
            }
            
            else if (this.p.value.toString()=="http://purl.org/dc/terms/description")
            {
                jQuery("#description").text(this.o.value.toString());
            }
            
            else if (this.p.value.toString()=="http://purl.org/dc/terms/modified")
            {
                baseUri = this.s.value.toString();
                subdate = this.o.value.match(/\d\d\d\d-\d\d-\d\d/)[0];
                jQuery("#lastModified").text(subdate);
            }
            else if (this.p.value.toString()=="http://www.openarchives.org/ore/terms/aggregates")
            {
                fileAbsolutePaths.push(this.o.value.toString());
                fileRelativePaths.push(jQuery.uri.relative(this.o.value, this.s.value).toString());
            }
        });
 
        var seglists = admiral.segmentPaths(fileRelativePaths.sort());
        var segtree  = admiral.segmentTreeBuilder(seglists);
        var seghtml  = admiral.nestedListBuilder(baseUri, segtree);
        jQuery(".manifest").text("");
        jQuery(".manifest").append(seghtml);
        seghtml.treeview();
    });
    // Kick off access to manifest data
    m.exec(datasetPath, callback);
};

// End.
