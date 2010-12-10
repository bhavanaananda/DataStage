/**
 * @fileoverview
 * Populate the form fields from the ADMIRAL metadata and submit the dataset to the databank.
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
 * Populate the form fields from the ADMIRAL metadata and submit the dataset to the databank.
 */
jQuery(document).ready( function ()
{         
   url = document.URL;
   // Get Dir value from the url to display as default and get metadata information for the dataset dir
   
   var dir = url.split("=");
   if(dir.length>1)
   { 
       displayValues(dir[1]);
   }
                  
   jQuery("#cancel").click( function()
   {   
       cancelURL = "SubmitDataset.html?dir="+ jQuery("#datDir").val();
       jQuery("#confirmForm").attr('action',cancelURL); 
       return true;
   });
});


/**
 * Get the form field information from the ADMIRAL metadata.
 * Make a call to the ADMIRAL metadata handler to get the ADMIRAL metadata.
 *  
 * @param directorySelected   Directory name for which the ADMIRAL metadata needs to be extracted.
 * @param callback            Callback function.
 */
function displayValues(directorySelected,callback)
{       
       var n = new admiral.AsyncComputation(); 
       
       n.eval(function(directorySelected,callback)
       { 
           jQuery("#datDir").val(directorySelected);
           // Get the persisted informaton from the server for display for the directory selected from the list
           admiral.getMetadata(directorySelected,callback); 
       });
     
       // Populate the other form  fields with the value received
       n.eval(function(formValues,callback)
       {                                   
           jQuery("#datId").val(formValues["identifier"]);
           jQuery("#description").val(formValues["description"]);
           jQuery("#title").val(formValues["title"]);
           jQuery("#user").val(formValues["creator"]);
           
           var displayTextnames = ["datasetDir", "datasetId", "datasetTitle", "datasetDescription"];
           var inputValues      = ["datDir", "datId", "title", "description"];
           
           for( i=0; i< inputValues.length; i++)
           {  
              value =  jQuery("#"+inputValues[i]).val();        
              jQuery("#"+displayTextnames[i]).text(value);
           }
       });
           
       n.exec( directorySelected,admiral.noop);          
}  

