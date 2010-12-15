/**
 * @fileoverview
 * Get the form field information from the ADMIRAL metadata.
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
 * Get the form field information from the ADMIRAL metadata.
 * Make a call to the ADMIRAL metadata handler.
 *  
 * @param directorySelected   Directory name for which the ADMIRAL metadata needs to be extracted.
 * @param callback            Callback function.
 */
 
admiral.getDatasetMetadata = function (directorySelected, callback)
{
    urlval = "../../SubmitDatasetHandler/cgi-bin/GetDatasetMetadataHandler.py?directory="+directorySelected
    jQuery.ajax({
                    type:         "GET",
                    url:           urlval,
                    dataType:     "json",
                    beforeSend:   function (xhr)
                        {
                            xhr.setRequestHeader("Accept", "application/json");
                        },
                    success:      function (data, status, xhr)
                        {   
                            log.debug("Get Metadata: " + jQuery.toJSON(data))                                   
                            callback(data);
                        },
                    error:        function (xhr, status) 
                        { 
                            jQuery("#pageLoadStatus").text("HTTP GET "+urlval+" failed: "+status+"; HTTP status: "+xhr.status+" "+xhr.statusText);
                            jQuery("#pageLoadStatus").addClass('error');
                        },
                    cache:        false
    });
}