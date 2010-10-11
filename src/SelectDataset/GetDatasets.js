/**
 * @fileoverview
 *  ADMIRAL function to get datasets
 *  
 * @author 
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
 * Get datasets to prepare page element containing a list of hyperlinked datasets in a silo
 * 
 * @param host      Databank hostname to query for list of datasets
 * @param silo      name of Databank silo to query for list of datasets
 * @param callback  function called with a new jQuery element containing the
 *                  HTML page data with dataset names hyperlinked to the 
 *                  corresponding viewer page.
 */
admiral.getDatasetList = function (host,siloName,callback)
{
    // Mock result until Databank API is confirmed
    // callback(["apps", "test"]);
    var dataseturl = host+"/"+siloName+"/"+"datasets";
    log.debug("Get datasets for "+ dataseturl);
    jQuery("#pageLoadStatus").text("Fetching dataset information...");
    //log.debug("Fetching dataset information...");
    jQuery.ajax({
        type:         "GET",
        url:          dataseturl,
        username:     "admiral",
        password:     "admiral",
        dataType:     "json",
        beforeSend:   function (xhr)
            {
                xhr.setRequestHeader("Accept", "text/plain");
            },
        success:      function (data, status, xhr)
            {  var datasets = [];
               for (name in data)
               {          
                  datasets.push(name);                
               }
               log.debug("Dataset list: "+datasets);  
               callback(datasets);
            },
        error:        function (xhr, status) 
            { 
                jQuery("#pageLoadStatus").text("HTTP GET "+ "/admiral-test/datasets"+" failed: "+status+"; HTTP status: "+xhr.status+" "+xhr.statusText);
                jQuery("#pageLoadStatus").addClass('error');
            },
        cache:        false
    });
}

