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
	function splitPath(path) {
		if (path.length == 0) {
			return [];
		}
		return path.split("/");
	}
    log.debug("admiral.segmentPaths "+jQuery.toJSON(listofpaths));
	return MochiKit.Base.map (splitPath, listofpaths);
	
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
