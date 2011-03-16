/**
 * @fileoverview
 * Read information about a RDFDatabank dataset details.
 *  
 * @author Bhavana Ananda
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
 * Read information about a RDFDatabank dataset details.
 * 
 * @param dataSetPath   String containing the URI path of the dataset whose details need to be extracted.
 * @param callback      callback function invoked when the dataset status has been read and displayed.
 */
admiral.getDatasetDetails = function (dataSetPath, callback)
{
    ////log.debug("admiral.getDatasetDetails "+dataSetPath);
    var m = new admiral.AsyncComputation();

    // Read dataset information
    m.eval(function (val, callback)
    {
        jQuery("#pageLoadStatus").text("Fetching dataset information...");
        jQuery.ajax({
            type:         "GET",
            url:          val,
            //username:     "admiral",
            //password:     "admiral",
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


    // Kick it off
    
    m.exec(dataSetPath, callback);
};

// End.
