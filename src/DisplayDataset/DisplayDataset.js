/**
 * @fileoverview
 *  ADMIRAL zzzzzz
 *  
 * @author zzz
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


admiral.loadDisplay = function (url)
{
    dirUrl      =   url.split("#");
    dir         =   dirUrl[0].split("=")[1];
    reviseURL   =  "../../SubmitDatasetUI/html/SubmitDatasetDetails.html?dir="+dir
    jQuery("#revise").attr('href', reviseURL);      

    var datasetName = dirUrl[1];
    if( datasetName.length <= 1)
    {
         jQuery("#pageLoadStatus").text('No dataset name specified');
         jQuery("#pageLoadStatus").addClass('error');
    }
    else
    {
        var dataSetPath = "/"+admiral.databanksilo+"/datasets/"+datasetName;
        var unpackedLink = "/"+admiral.databanksilo+"/datasets/"+datasetName;
        var packedLink = "/"+admiral.databanksilo+"/datasets/"+datasetName+"-packed";
        jQuery("#unpackedLink").attr('href', unpackedLink);  
        jQuery("#packedLink").attr('href', packedLink);  
        jQuery("#datasetPackedName").text(datasetName+"-packed");  
        jQuery("#datasetUnpackedName").text(datasetName);          

        var m = new admiral.AsyncComputation();
        
        m.eval(function (val, callback)
        {  jQuery(".manifest").text("Fetching manifest...");
           admiral.datasetManifestDictionary(dataSetPath,datasetName, callback);
        });
        
        m.eval(function (datasetdetails, callback)
        {   
            jQuery("#pageLoadStatus").text("");
            jQuery("#datasetName").text(datasetdetails.datasetName);
            jQuery("#createdBy").text(datasetdetails.createdBy);
            jQuery("#currentVersion").text(datasetdetails.currentVersion);
            jQuery("#embargoExpiryDate").text(datasetdetails.embargoExpiryDate);
            jQuery("#lastModified").text(datasetdetails.lastModified);
            jQuery(".manifest").text("");
            // Display or hide values absent for packed datasets
            if (datasetdetails.derivedFrom)
            {
                jQuery("#title").text(datasetdetails.title);
                jQuery("#description").text(datasetdetails.description);
                jQuery("#derivedFrom > a").text(datasetdetails.derivedFrom);
                jQuery("#derivedFrom > a").attr("href", datasetdetails.derivedFrom);
            }
            else
            {
                jQuery("tr:has(#title)").hide();
                jQuery("tr:has(#description)").hide();
                jQuery("tr:has(#derivedFrom)").hide();
            };
            callback(datasetdetails);        
        });
        m.eval(function(datasetdetails, callback)
        {
            var seglists = admiral.segmentPaths(datasetdetails.fileRelativePaths.sort());
            var segtree  = admiral.segmentTreeBuilder(seglists);
            var seghtml  = admiral.nestedListBuilder(datasetdetails.baseUri, segtree);
            jQuery(".manifest").append(seghtml);
            seghtml.treeview({ collapsed: true }); 
        });
        m.exec(null, admiral.noop);
    }
};
    
    
/**
 * .....
 * 
 * @param aaaa      zzzzzz
 * @param bbbb      zzzzzz
 * @return          zzzzzz
 */
admiral.ffffff = function (aaaa, bbbb)
{
    ////log.debug("admiral.ffffff "+aaaa+", "+bbbb);
    throw new admiral.Error("admiral.ffffff not implemented");
};

/**
 * .....
 * 
 * @constructor
 * @param aaaa      zzzzzz
 * @param bbbb      zzzzzz
 * @return          zzzzzz
 */
admiral.cccccc = function (aaaa, bbbb)
{
    ////log.debug("admiral.cccccc "+aaaa+", "+bbbb);
    throw new admiral.Error("admiral.cccccc not implemented");
};

//// admiral.cccccc.prototype = new prototypeclass(....);

/**
 * .....
 * 
 * @param aaaa      zzzzzz
 * @param bbbb      zzzzzz
 * @return          zzzzzz
 */
admiral.cccccc.prototype.ffffff = function (aaaa, bbbb)
{
    ////log.debug("admiral.cccccc.prototype.ffffff "+aaaa+", "+bbbb);
    throw new admiral.Error("admiral.cccccc.prototype.ffffff not implemented");
};

// End.
