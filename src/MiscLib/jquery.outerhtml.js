/**
 * @fileoverview
 *  jQuery plugin for .outerhtml(), which returns HTML for a complete jQuery element.
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

/**
 *  Return full HTML for the current element
 */
jQuery.fn.outerhtml = function ()
{
    return jQuery("<wrap/>").append(jQuery(this).eq(0).clone()).html();
};

// See also, this from http://yelotofu.com/2008/08/jquery-outerhtml/
//
//jQuery.fn.outerHTML = function(s) {
//return (s)
//? this.before(s).remove()
//: jQuery("<p>").append(this.eq(0).clone()).html();
//}

// End.
