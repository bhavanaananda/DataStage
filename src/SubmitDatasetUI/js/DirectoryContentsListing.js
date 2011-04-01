/**
 * @fileoverview
 * Provide directory contents listing
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
 * Make a call to the ADMIRAL directory contents listing handler to provide a listing of the directory contents  
 */
 
 
admiral.directoryContentsListing = function (directorySelected, callback)
{
    urlval = "../../SubmitDatasetHandler/cgi-bin/DirectoryContentsListingHandler.py?datdir="+directorySelected
    jQuery.ajax({
                    type:         "GET",
                    url:           urlval,
                    dataType:     "json",
                    beforeSend:   function (xhr)
                        {
                            xhr.setRequestHeader("Accept", "application/JSON");
                        },
                    success:      function (data, status, xhr)
                        {   
                            //log.debug("Display Directories: " + jQuery.toJSON(data));
                            callback(data || []);
                        },
                    error:        function (xhr, status) 
                        { 
                            jQuery("#pageLoadStatus").text("HTTP GET "+urlval+" failed: "+status+"; HTTP status: "+xhr.status+" "+xhr.statusText);
                            jQuery("#pageLoadStatus").addClass('error');
                        },
                    cache:        false
              });
}