/**
 * @fileoverview
 * URI Helper Utility functions.
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
 * Converts the URI with unicode to a displayable string
 *  
 * @param string   URI/string that needs to be converted.
 */
admiral.unescapeURIString = function (string)
{
   return string.replace(/%([0-9a-fA-F][0-9a-fA-F])/g,unEscapeUnicodeChar);
}

/**
 * Converts a hexadecimal number to a char
 *  
 * @param string   string
 * @param num      number that needs to be converted to a char
 */
unEscapeUnicodeChar = function(str,num)
{   
   return String.fromCharCode(parseInt(num,16));    
}    