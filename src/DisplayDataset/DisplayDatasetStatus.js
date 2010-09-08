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
 * @param jelem     jQuery element whose contents are replaced by the dataset status display.
 * @param callback  callback function invoked when the dataset status has been read and displayed.
 */
admiral.displayDatasetStatus = function (jelem, callback)
{
    log.debug("admiral.displayDatasetStatus");
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

    // Extract JSON information and display in page
    m.eval(function (data, callback)
    {
        jelem.text("Interpreting information...");
        try
        {
             embargo = data.state.metadata.embargoed;
             var jsondata = jQuery.toJSON(data);
             jelem.text("");
             jelem.append("<br /><table >");
             jelem.append("<tr ><td>Submission identifier &nbsp;</td><td id=\"submissionIdentifier\">" + data.state.item_id + "</td></tr>");
             jelem.append("<tr><td>Created by</td><td>" + data.state.metadata.createdby + "</td></tr>");
             jelem.append("<tr><td>Current version</td><td>" + data.state.currentversion + "</td></tr>");
             jelem.append("<tr><td>Last modified</td><td id=\"lastModified\">...</td></tr>");
             jelem.append("<tr><td>Embargoed?</td><td>" + embargo + "</td></tr>");
             if (embargo == true) {
                 jelem.append("<tr><td>Embargo expiry date</td><td>" + data.state.metadata.embargoed_until + "</td></tr>");
             }
             jelem.append("<tr><td>Derived from</td><td><span id=\"derivedFrom\"><a href=\"dummy\">...</a></span></td></tr>");
             jelem.append("</table>");
             jQuery("#datasetName").text(jQuery("#submissionIdentifier").text());
             callback(null);
        } 
        catch(e)
        {
            jelem.text("JSON decode: "+e);
        }
    });

    // Kick it off
    // TODO: replace hard-wired dataset name with parameter
    m.exec("/admiral-test/datasets/apps", callback);
};

// End.
