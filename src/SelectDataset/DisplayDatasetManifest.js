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
    //log.debug("admiral.displayDatasetManifest "+datasetPath+", "+datasetName);
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
                    log.debug(data);
                    callback(data);
                },
            error:        function (xhr, status) 
                {   //log.debug("HTTP GET "+val+" failed: "+status+"; HTTP status: "+xhr.status+" "+xhr.statusText);
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
        {   //log.debug("Error: Databank decode: "+e);
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

        rq.each(function ()
        { //log.debug(this.p.value.toString());
            if (this.p.value.toString()=="http://purl.org/dc/terms/modified")
            {  
                subdate = this.o.value.match(/\d\d\d\d-\d\d-\d\d/)[0];
			    //log.debug(subdate);
            }
        });
        callback(subdate);
    });
    // Kick off access to manifest data
    m.exec(datasetPath, callback);
};

// End.
