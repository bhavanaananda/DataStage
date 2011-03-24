/**
 * @fileoverview
 *  Read an RDFDatabank manifest, and construct a dictionary.
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
 * Read an RDFDatabank manifest, , and construct a dictionary.
 * 
 * @param datasetPath   String containing the URI path of the dataset to be displayed.
 * @param datasetName   String dataset identifier of the dataset to be displayed.
 * @param callback      callback function invoked when the dataset status has been read and displayed.
 */
admiral.datasetManifestDictionary = function (datasetPath, datasetName, callback)
{
    //log.debug("admiral.datasetManifestDictionary datasetPath="+datasetPath+",   datasetName="+datasetName);
    var m = new admiral.AsyncComputation();
    var datasetdetails = {};

    // Read manifest RDF/XML
    m.eval(function (val, callback)
    {
        jQuery.ajax({
            type:         "GET",
            url:           val,
            //username:     "admiral",
            //password:     "admiral",
            dataType:     "text",
            beforeSend:   function (xhr)
                {
                    xhr.setRequestHeader("Accept", "application/rdf+xml");
                },
            success:      function (data, status, xhr)
                {   //log.debug("still loading...");
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

    // Collect dictionary of results from databank
    m.eval(function (rq, callback)
    {
        rq = rq.where('?s ?p ?o');
        jQuery("#datasetLink").attr("href", rq[0].s.value);
        //TODO: localize mention of baseuri to handler for ore:aggregates?
        var baseUri            = "";
        var subdate            = "";
        var fileAbsolutePaths  = new Array();
        var fileRelativePaths  = new Array();
        rq.each(function () 
        {
            if (this.p.value.toString()=="http://purl.org/dc/terms/identifier")
            { 
                baseUri = this.s.value.toString();
                datasetdetails.datasetName = this.o.value.toString();              
            } 
            if (this.p.value.toString()=="http://purl.org/dc/terms/creator")
            { 
                datasetdetails.createdBy = this.o.value.toString();                  
            } 
            if (this.p.value.toString()=="http://purl.org/dc/terms/isVersionOf")
            {
                datasetdetails.derivedFrom = this.o.value.toString();     
            } 
            if (this.p.value.toString()=="http://vocab.ox.ac.uk/dataset/schema#currentVersion")
            {
                datasetdetails.currentVersion = this.o.value.toString();                
            }
            if (this.p.value.toString()=="http://vocab.ox.ac.uk/dataset/schema#embargoedUntil")
            {
                subdate = this.o.value.match(/\d\d\d\d-\d\d-\d\d/)[0];
                datasetdetails.embargoExpiryDate= subdate;            
            }
            else if (this.p.value.toString()=="http://purl.org/dc/terms/title")
            {
                datasetdetails.title = this.o.value.toString();  
            }
            else if (this.p.value.toString()=="http://purl.org/dc/terms/description")
            {
                datasetdetails.description = this.o.value.toString();  
            }
            else if (this.p.value.toString()=="http://purl.org/dc/terms/modified")
            {
                subdate = this.o.value.match(/\d\d\d\d-\d\d-\d\d/)[0];
                datasetdetails.lastModified = subdate;  
            }
            else if (this.p.value.toString()=="http://www.openarchives.org/ore/terms/aggregates")
            { 
              baseUri = this.s.value.toString();
              fileAbsolutePaths.push(this.o.value.toString());
              fileRelativePaths.push(jQuery.uri.relative(this.o.value, this.s.value).toString());
              datasetdetails.baseUri           = baseUri;
              datasetdetails.fileAbsolutePaths = fileAbsolutePaths;
              datasetdetails.fileRelativePaths = fileRelativePaths;
            }
        }); 
        callback(datasetdetails);
    });

    // Kick off access to manifest data
    m.exec(datasetPath, callback);
};

// End.
