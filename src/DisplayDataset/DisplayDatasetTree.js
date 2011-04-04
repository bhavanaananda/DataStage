/**
 * @fileoverview
 *  ADMIRAL zzzzzz
 *  
 * @author sho
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
 * Convert a file segments tree structure into a jQuery nested directory 
 * list structure.
 * 
 * @param baseUri       a base URI for creating links to all files and directories
 *                      in the dataset.
 * @param tree          a tree structure (a list of branches).
 * @return              a jQuery element containing a nested structure of
 *                      unordered lists reflecting the tree.
 */
admiral.nestedListBuilder = function (baseUri, tree)
{
    //log.debug("admiral.nestedListBuilder "+jQuery.toJSON(tree));
    if (baseUri.slice(-1) == "/")
    {
        // trim off trailing '/'
        baseUri = baseUri.slice(0,-1);
    }
    function appendTree(tree, jelem, rebuiltBaseUri)
    {
  	    for (var i = 0 ; i < tree.length ; i++)
  	    {
            var fileName = tree[i].segment;
    	    	if (tree[i].subtree == null)
    	    	{
            		var href = fileName;
            		if (fileName != "")
            		{
            		    href = "<a href=\""+rebuiltBaseUri+"/"+fileName+"\">"+fileName+"</a>";
            		}
                jelem.append("<li><span class='file'>"+href+"</span></li>");
    	    	}
                else
    	    	{
            		// New branch here == new directory level
                href = "<a href=\""+rebuiltBaseUri+"/"+fileName+"/\">"+fileName+"</a>";
                jelem.append("<li><span class='folder'>"+href+"</span><ul/></li>");
                appendTree(tree[i].subtree, jelem.find("li:last > ul"), rebuiltBaseUri + "/" + fileName);
    	    	}
  	    }
    }
    // Start witjh empty list
    var jelem = jQuery("<ul class='filetree' />");
    // Append tree to list
    appendTree(tree, jelem, baseUri);
    return jelem;
};

// End.
