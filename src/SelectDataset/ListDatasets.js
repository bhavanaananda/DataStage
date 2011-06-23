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

function callbackFunc(a,b)
{
   return (a.datasetname < b.datasetname) ? -1 : 1;
 }



/**
 * Prepare page element containing a list of hyperlinked datasets in a silo
 * 
 * @param host      Databank hostname to query for list of datasets
 * @param silo      name of Databank silo to query for list of datasets
 * @param getlist   function to call to retrieve a list of datasets, called
 *                  as 'getlist(host, silo, callback)', where callback is invoked with
 *                  a list of dictionary objects containing 
 *                  {datasetname: (name), ...} for each existing dataset,
 *                  when the data is available.
 * @param callback  function called with a new jQuery element containing the
 *                  HTML page datawith dataset names hyperlinked to the 
 *                  corresponding viewer page.
 */
admiral.listDatasets = function (host, silo, getlist, callback)
{
    // log.debug("admiral.listDatasets "+ host +", "+silo);
    var m = new admiral.AsyncComputation();
    m.eval(function(val,callback)
    {
        //log.debug("admiral.listDatasets calling getlist");
        var datasets = getlist(host, silo, callback);
    });
    m.eval(function(datasets,callback)
    {
        //log.debug("admiral.listDatasets getlist result: "+datasets);
  	    // Build display with links to datasets
  	    var tablediv= jQuery("<div><table/></div>");
  	    var tableelem = tablediv.find("table");
        tableelem.append(
      	        "<thead>"+
                "  <tr>"+
                "    <th> Dataset identifier </th>"+
                "    <th> Version            </th>"+
                "    <th> Submitted on       </th>"+
                "    <th> Submitted by       </th>"+
                "  </tr>"+
                "</thead>"
                );

       if(datasets!=null)
       { 
        datasets.sort(callbackFunc);
  	    for (var i in datasets)
  	    {
  	        var datasetname = datasets[i].datasetname;
  	        var newhtml = admiral.interpolate(
  	             "<tr>"+
  	             "<td><a href=\"%(datasetlink)s\">%(datasetname)s</a></td>"+
  	             "<td>%(datasetvers)s</td>"+
  	             "<td>%(datasetsubmittedon)s</td>"+
  	             "<td>%(datasetsubmittedby)s</td>"+
  	             "</tr>",
  	             { datasetlink: "../../DisplayDataset/html/DisplayDataset.html#"+datasetname
  	             , datasetname: datasetname
  	             , datasetvers: datasets[i].version
  	             , datasetsubmittedon: datasets[i].submittedon
  	             , datasetsubmittedby: datasets[i].submittedby 
  	             });
  	        var newelem = jQuery(newhtml);
  	        tableelem.append(newelem);
  	    }
       }
  	    //log.debug("admiral.listDatasets final callback");
  	    callback(tablediv);
    });
    m.exec(null,callback);
};

// End.
