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
    //log.debug("admiral.segmentPaths "+jQuery.toJSON(listofpaths));
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
    // log.debug("admiral.segmentTreeBuilder "+jQuery.toJSON(segmentlists));
    // ---- Generate tree path from list of segments ----
    function generateTreePath(seglist, depth)
    {
      	if ( depth >= seglist.length ) return null;
      	var subtree = generateTreePath(seglist, depth+1);
      	return { segment: seglist[depth], subtree: (subtree != null ? [ subtree ] : null) };
    }
    // ---- Add or merge new branch; return resulting current branch ----
    function mergeBranch(tree, basebranch, newbranch)
    {
        if (!basebranch || (basebranch.segment != newbranch.segment))
        {
            tree.push( newbranch );
            basebranch = newbranch;
        }            
        else if(basebranch.subtree != null && newbranch.subtree != null) 
        {
            mergeBranch(
                basebranch.subtree, 
                basebranch.subtree[basebranch.subtree.length-1], 
                newbranch.subtree[0]);
        }
        else if ((basebranch.subtree == null) && (newbranch.subtree != null)) 
        {
            // New branch replaces existing leaf
            basebranch.subtree = newbranch.subtree;
        }
        else if ((basebranch.subtree != null) && (newbranch.subtree == null)) 
        {
            log.debug("incoming leaf at existing branch; nothing new to add");
        }
        else
        {
        	log.debug("duplicate branch; nothing new to add");
        }
        return basebranch;
    }
    // ---- Merge list of segment lists into tree ----
    var tree = [];
    var curbranch  = undefined;
    for (var i = 0 ; i < segmentlists.length ; i++)
    {
        var seglist = segmentlists[i];
        // log.debug("seglist: " + seglist);
        if (seglist.length == 0)
        {
            // Special case: empty path
            tree.push( { segment: '', subtree: null } );    		
        } 
        else
        {
            var newbranch = generateTreePath(seglist, 0);
            curbranch = mergeBranch(tree, curbranch, newbranch);
      	}
    }
    return tree;
};

// End.
