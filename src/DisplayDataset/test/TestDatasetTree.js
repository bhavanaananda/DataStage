/**
 * @fileoverview
 *  Test suite for 00-skeleton
 *  
 * @author Graham Klyne
 * @version $Id: test-00-skeleton.js 840 2010-06-18 09:50:42Z gk-google@ninebynine.org $
 * 
 * Coypyright (C) 2010, University of Oxford
 *
 * Licensed under the MIT License.  You may obtain a copy of the license at:
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
 * Test data values
 */

/**
 * Function to register tests
 */
TestDatasetTree = function()
{

    module("TestDatasetTree");

    test("testSegmentPaths", function ()
    {
        logtest("testSegmentPaths");

        var seg1 = admiral.segmentPaths(["a", "b", "c"]);
        same(seg1, [["a"], ["b"], ["c"]], "Single-segment paths");

        var seg2 = admiral.segmentPaths(["a/b", "b/c", "c/d"]);
        same(seg2, [["a","b"], ["b","c"], ["c","d"]], "2-segment paths");

        var seg3 = admiral.segmentPaths([]);
        same(seg3, [], "empty list of paths");

        var seg4 = admiral.segmentPaths([""]);
        same(seg4, [[]], "list with empty path");

        var seg5 = admiral.segmentPaths(["a","","b/c/d/e"]);
        same(seg5, [["a"], [], ["b","c","d","e"]], "list with empty path");

        //same(val, exp, "what");
        //ok(cond,"msg")
    });

};

// End
