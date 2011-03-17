/**
 * @fileoverview
 *  ADMIRAL function to get list of datasets in a Databank silo
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
 * @param callback  function called with a list of dictonary objects, each
 *                  containing: {datasetname: (name), ...}
 */
admiral.getDatasetList = function (host,silo,callback)
{
    // Mock result until Databank API is confirmed
    // callback(["apps", "test"]);
    var dataseturl = host+"/"+silo+"/"+"datasets";
    //log.debug("Get datasets for "+ dataseturl);
    jQuery("#pageLoadStatus").text("Fetching dataset information...");
    //log.debug("Fetching dataset information...");
    var m = new admiral.AsyncComputation();
    m.eval(function(val,callback)
    {
        // Retrieve list of dataset names
        log.debug("getDatasetList "+dataseturl);
        jQuery.ajax({
            type:         "GET",
            url:          dataseturl,
            //username:     "admiral",
            //password:     "admiral",
            dataType:     "json",
            beforeSend:   function (xhr)
                {
                    //TODO: change to application/JSON when Databank handles this properly
                    xhr.setRequestHeader("Accept", "text/plain");
                },
            success:      function (data, status, xhr)
                {  
                   log.debug("Dataset list: "+data);  
                   var datasets = [];
                   for (var name in data)
                   {          
                      datasets.push({ datasetname: name });                
                   }
                   callback(datasets);
                },
            error:        function (xhr, status) 
                { 
                    jQuery("#pageLoadStatus").text("HTTP GET "+dataseturl+" failed: "+status+"; HTTP status: "+xhr.status+" "+xhr.statusText);
                    jQuery("#pageLoadStatus").addClass('error');
                },
            cache:        false
        });
    });
    m.eval(function(val,callback)
    {   var jsondata = jQuery.toJSON(val);
        //log.debug("Dataset list: "+jsondata);  
        // Retrieve associated values
        var datasetdetailsList = []
        var m2 = new admiral.AsyncComputation();
        for (var i in val)
        {
            function fnGetDatasetDetails(datasetname)
            {
                function doGetDatasetDetails(v, callback)
                {
                    var datasetPath = "/"+admiral.databanksilo+"/datasets/"+datasetname;
                    log.debug("Dataset path: "+datasetPath);
                    admiral.datasetManifestDictionary(datasetPath, datasetname, callback);
                }
                
                return doGetDatasetDetails;
            }
            function fnSaveDatasetDetails(datasetdetails)
            {
                function doSaveDatasetDetails(v, callback)
                {   //log.debug(datasetdetails);
                    datasetdetailsList = datasetdetails;
                    datasetdetailsList.version = v.currentVersion;
                    datasetdetailsList.submittedon= v.lastModified;
                    datasetdetailsList.submittedby = v.createdBy;
                    callback(val);
                }
                return doSaveDatasetDetails;
            }
            //log.debug("DatasetName = "+val[i].datasetname);
            m2.eval(fnGetDatasetDetails(val[i].datasetname))
            m2.eval(fnSaveDatasetDetails(val[i]))
        }
        m2.exec(null, callback);
    });
    m.exec(null, callback);
};

// End.
