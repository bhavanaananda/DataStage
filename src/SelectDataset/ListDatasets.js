/**
 * @fileoverview
 *  ADMIRAL function to format a web page containing a list of datasets in a Databank silo
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
 * Prepare page element containing a list of hyperlinked datasets in a silo
 * 
 * @param host      Databank hostname to query for list of datasets
 * @param silo      name of Databank silo to query for list of datasets
 * @param getlist   function to call to retrieve a list of datasets, called
 *                  as 'getlist(host, silo, callback)', where callback is invoked with
 *                  a list of datset name strings when the data is available.
 * @param callback  function called with a new jQuery element containing the
 *                  HTML page datawith dataset names hyperlinked to the 
 *                  corresponding viewer page.
 */
admiral.listDatasets = function (host, silo, getlist, callback)
{
    log.debug("admiral.listDatasets "+host+", "+silo);
    var m = new admiral.AsyncComputation();
    m.eval(function(val,callback)
    {
        log.debug("admiral.listDatasets calling getlist");
        var datasets = getlist(host, silo, callback);
    });
    m.eval(function(datasets,callback)
    {
        log.debug("admiral.listDatasets getlist result: "+datasets);
	    // Build display with links to datasets
	    var tablediv= jQuery("<div><table/></div>");
	    var tableelem = tablediv.find("table");
	    for (var i in datasets)
	    {
	        var dataset = datasets[i];
	        var newhtml = admiral.interpolate(
	             "<tr><td><a href=\"%(datasetlink)s\">%(datasetname)s</a></td></tr>",
	             { datasetlink: "../../DisplayDataset/html/DisplayDataset.html#"+dataset
	             , datasetname: dataset
	             });
	        var newelem = jQuery(newhtml);
	        tableelem.append(newelem);
	    }
	    log.debug("admiral.listDatasets final callback");
	    callback(tablediv);
    });
    m.exec(null,callback);
};

// End.
