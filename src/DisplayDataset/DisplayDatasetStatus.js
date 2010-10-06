/**
 * @fileoverview
 * Read information about a RDFDatabank dataset status, and display in a supplied jQuery object.
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
 * Read information about a RDFDatabank dataset status, and display in a supplied jQuery object.
 * 
 * @param dataSetPath   String containing the URI path of the dataset to be displayed.
 * @param callback      callback function invoked when the dataset status has been read and displayed.
 */
admiral.displayDatasetStatus = function (dataSetPath, callback)
{
    log.debug("admiral.displayDatasetStatus");
    var m = new admiral.AsyncComputation();

    // Read dataset information
    m.eval(function (val, callback)
    {
        jQuery("#pageLoadStatus").text("Fetching dataset information...");
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
                    jQuery("#pageLoadStatus").text("HTTP GET "+val+" failed: "+status+"; HTTP status: "+xhr.status+" "+xhr.statusText);
                    jQuery("#pageLoadStatus").addClass('error');
                },
            cache:        false
        });
    });

    // Extract JSON information and display in page
    m.eval(function (data, callback)
    {
        jQuery("#pageLoadStatus").text("Interpreting information...");
        try
        {
             embargo = data.state.metadata.embargoed;
             var jsondata = jQuery.toJSON(data);
             jQuery("#pageLoadStatus").text("");
             jQuery("#submissionIdentifier").text(data.state.item_id);
             jQuery("#datasetName").text(data.state.item_id);
             jQuery("#createdBy").text(data.state.metadata.createdby);
             jQuery("#currentVersion").text(data.state.currentversion);
             //lastModified populated by DataSetManifest.js
             jQuery("#isEmbargoed").text(embargo);
             if (embargo == true) {
                jQuery("#embargoExpiryDate").text(data.state.metadata.embargoed_until);
             }
             //<td> element "derivedFrom" in dataSet table populated by DataSetManifest.js
 
             callback(null);
        } 
        catch(e)
        {
            jQuery("#pageLoadStatus").text("JSON decode: "+e);
        }
    });

    // Kick it off
    
    m.exec(dataSetPath, callback);
};

// End.
