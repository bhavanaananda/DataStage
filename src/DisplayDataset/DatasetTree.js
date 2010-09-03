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
 * Convert list of paths into a list of lists of path segments.
 * 
 * @param listofpaths	array containing a list of paths to be segmented
 * @return          	an array of arays, each of which contains a list of
 * 						segments in the corresponding input path.
 */
admiral.segmentPaths = function (listofpaths)
{
	function splitPath(path) 
	{
		if (path.length == 0) 
		{
			return [];
		}
		return path.split("/");
	}
    log.debug("admiral.segmentPaths "+jQuery.toJSON(listofpaths));
	return MochiKit.Base.map (splitPath, listofpaths);
};

/**
 * Convert array of segment arrays (as returned by admiral.segmentPaths) into
 * a traversable tree structure.
 * 
 * In the returned tree value, each tree nodes is a list of branches or 
 * leaf nodes, where each branch is an object (structure) with members 
 * 'segment' and 'subtree', and a leaf node is similar except that the 
 * 'subtree' member is null.
 * 
 * NOTE: input segment array are assumed to be ordered such that common
 * leading segment subsequences appear adjacent in the array of arrays.
 * 
 * @param segmentlists  an array of arays, each of which contains an
 *                      array of segments in an input path.
 * @return              a tree structure reflecing the branching.
 */
admiral.segmentTreeBuilder = function (segmentlists)
{
    log.debug("admiral.segmentTreeBuilder "+jQuery.toJSON(segmentlists));
    function generateTreePath(seglist, depth)
    {
    	if ( depth >= seglist.length ) return null;
    	var subtree = generateTreePath(seglist, depth+1);
    	return { segment: seglist[depth], subtree: (subtree != null ? [ subtree ] : null) };
    }
    var tree = [];
    var cursegment = undefined;
    var curbranch  = undefined;
    for (var i = 0 ; i < segmentlists.length ; i++)
    {
    	var seglist = segmentlists[i];
    	if (seglist.length == 0)
    	{
            tree.push( { segment: '', subtree: null } );    		
    	} 
    	else
    	{
            if (seglist[0] != cursegment)
            {
                cursegment = seglist[0];
            	curbranch = { segment: cursegment, subtree: null }
            	tree.push( curbranch );
            }            
    		var branch = generateTreePath(seglist, 0);
            if (curbranch.subtree == null)
            {
            	curbranch.subtree = branch.subtree;
            }
            else
            {
                curbranch.subtree.push(branch.subtree[0]);
            }
    	}
    }
    return tree;
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
    throw new shuffl.Error("admiral.cccccc not implemented");
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
    throw new shuffl.Error("admiral.cccccc.prototype.ffffff not implemented");
};

// End.
