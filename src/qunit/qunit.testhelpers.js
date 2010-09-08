/**
 * @fileoverview
 *  Test helpers for use with jQuery qunit testing framework.
 *  
 * @author Graham Klyne
 * @version $Id: qunit.testhelpers.js 855 2010-07-13 10:14:35Z gk-google@ninebynine.org $
 * 
 * Coypyright (C) 2009, University of Oxford
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
 *  Add logging functions to global namespace, for convenience
 */
if (typeof log == "undefined")
{
    log = {};
    log.debug = MochiKit.Logging.logDebug   ;
    log.info  = MochiKit.Logging.log    ;
    log.warn  = MochiKit.Logging.logWarning ;
    log.error = MochiKit.Logging.logError   ;
};

/**
 * Test case counter
 */
var testnum = 1;

/**
 * Count and log test case
 */
function logtest(name) {
    log.info("----------");
    log.info((testnum++)+". "+name);
}

/**
 * Skip test function (change 'test' to 'notest' and leave the body intact)
 */
function notest(name, fn) {
    test("SKIPPED TEST: "+name, function() {
        ok(true, "SKIPPED TEST: "+name);
        logtest("SKIPPED: "+name);
    });
}

/**
 * Test for value in given range
 */
function range(val, lo, hi, message) {
  var result = (val>=lo) && (val<=hi);
  message = message || (result ? "okay" : "failed");
  if (typeof val == "string") { val = parseFloat(val); };
  QUnit.ok( result, 
      ( result 
          ? message + ": " + val 
          : message + ", value " + val + " not in range ["+lo+".."+hi+"]"
      ));
}

// End.
