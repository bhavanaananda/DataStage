/**
 * @fileoverview
 * Read from the admiral manifest if any exists and populate form fields and provide a directory listing for selection.
 * Create a manifest if one does not exist.
 * 
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

/**
 * Read from the admiral manifest if any exists and populate form fields and provide a directory listing for selection.
 */
 
 
if (typeof admiral == "undefined")
{
    admiral = {};
}

admiral.displayFormFieldsFromMetadata = function (directorySelected)
{
   
   if(directorySelected.length>1)
   {   
       // Display all the form fields associated with the directory supplied in the url
       displayValues(directorySelected);
   }
                           
   var m = new admiral.AsyncComputation();
   
   m.eval(function(value,callback)
   {   
       // Execute the dataset listing logic
       admiral.directoryListing(callback);           
   }); 
   
   m.eval(function(value,callback)
   {    var baseUri  = "";
        var seglists = admiral.segmentPaths(value.sort());
        var segtree  = admiral.segmentTreeBuilder(seglists);
        var seghtml  = admiral.nestedListBuilder(baseUri, segtree);
        jQuery("#dirtreelist").text("");
        jQuery("#dirtreelist").append(seghtml);     
        seghtml.children("li").addClass("open");
        seghtml.treeview({ collapsed: true });
        jQuery(".links").click( function()
        {  
           // Display all the form fields associated with the directory selected from the list           
           displayValues(jQuery(this).attr("href"), jQuery(this).text());
           return false;                              
        });
        callback(value);
   });   
   
   m.eval(function(value, callback)
   {
       // Set click handlers on directory items
       jQuery("#dirlist > .dirlistitem").click( function()
       { 
           // Display all the form fields associated with the directory selected from the list 
           displayValues(jQuery(this).text(),"");                    
       });
   });                       
   m.exec(null,admiral.noop);
}      


/**
 * Read from the admiral manifest and display the form fields.
 * 
 * @param directorySelected   Directory name for which the ADMIRAL metadata needs to be extracted.
 * @param callback            Callback function.
 */
function displayValues(directorySelected,defaultDatID,callback)
{       
      var n = new admiral.AsyncComputation(); 
      n.eval(function(directorySelected,callback)
      { 
           jQuery("#datDir").val(directorySelected);
           // Get the manifest informaton from the server for display
           admiral.getDatasetMetadata(directorySelected,callback); 
      });
     
      // Populate the other fields with the value received
      n.eval(function(formValues,callback)
      {                          
           if( formValues["identifier"] != undefined)              
             {
               jQuery("#datId").val(formValues["identifier"]);
               jQuery("#description").val(formValues["description"]);
               jQuery("#title").val(formValues["title"]); 
             }
           else
             { // Suggest Dataset default ID
               jQuery("#datId").val(defaultDatID);
               jQuery("#description").val("Description for dataset "+defaultDatID);
               jQuery("#title").val("Title for dataset "+defaultDatID);   
             }            
               
      });    
      
      n.exec( directorySelected,admiral.noop);          
}  
                                 