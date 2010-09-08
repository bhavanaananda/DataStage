/**
 * @fileoverview
 *  ADMIRAL error / exception class
 *  
 * @author Graham Klyne
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
 * Error class for Admiral
 */
admiral.Error = function(msg, val) 
{
    this.msg = this.message = msg;
    this.val = val;
};

admiral.Error.prototype = new Error("(admiral)");

admiral.Error.prototype.toString = function () 
{
    var s = "admiral error: "+this.msg;
    if (this.val) {
        s += " ("+this.val.toString()+")";
    }
    return s;
};

// End.
