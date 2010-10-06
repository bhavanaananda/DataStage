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
 * @param jelem     jQuery element whose contents are replaced by the dataset manifest display.
 * @param callback  callback function invoked when the dataset status has been read and displayed.
 */
admiral.displayDatasetManifest = function (jelem, callback)
{
    log.debug("admiral.displayDatasetManifest ");
    var m = new admiral.AsyncComputation();

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

        jQuery("#datasetLink").attr("href", rq[0].s.value);

        var fileAbsolutePaths = new Array();
        var fileRelativePaths = new Array();

        rq.each(function ()
        {
            if (this.p.value.toString()=="http://purl.org/dc/terms/isVersionOf")
            {
				jQuery("#derivedFrom > a").text(this.o.value.toString());
				jQuery("#derivedFrom > a").attr("href", this.o.value.toString());
            } 
            else if (this.p.value.toString()=="http://purl.org/dc/terms/modified")
            {
                jQuery("#lastModified").text(this.o.value);
            }
            else if (this.p.value.toString()=="http://www.openarchives.org/ore/terms/aggregates")
            {
                fileAbsolutePaths.push(this.o.value.toString());
                fileRelativePaths.push(jQuery.uri.relative(this.o.value, this.s.value).toString());
            }
        });
 
        var seglists = admiral.segmentPaths(fileRelativePaths.sort());
        var segtree  = admiral.segmentTreeBuilder(seglists);
        var seghtml  = admiral.nestedListBuilder(segtree);
        jelem.text("");
        jelem.append(seghtml);
        seghtml.treeview();
    });

    // TODO: replace hard-wired dataset with parameter
    m.exec("/admiral-test/datasets/apps", callback);
};

// End.
