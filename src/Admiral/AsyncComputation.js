/**
 * @fileoverview
 * Class for controlling and composing asynchronous computations, inspired
 * by the monad convept used by Haskell and other functional programming 
 * languages.
 *  
 * @author Graham Klyne
 * @version $Id: AsyncComputation.js 545 2009-10-20 01:47:57Z gk-google@ninebynine.org $
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
 * Ensure admiral namespace is defined
 */
if (typeof admiral == "undefined") { admiral = {}; };

/**
 * @constructor
 */
admiral.AsyncComputation = function() {
    this.data = new Object();
    this.proc = [];
};

/**
 * Evaluate a function as pasrt of a sequence linked by callbacks.
 * 
 * The supplied function has signature fn(val, callback), 
 * where val is supplied by the previous callback function or start of the 
 * callback sequence, and callback is a function that is called with a single
 * value when the possibly asynchronous operation is complete.  'fn' is
 * invoked with 'this' set to a data object associated with this computation
 */
admiral.AsyncComputation.prototype.eval = function(fn) {
    //log.debug("admiral.AsyncComputation.eval");
    this.proc.push(fn);
    return this;
};

/**
 * Initiate execution of an asynchronous computation with a supplied initial
 * parameter value.
 * 
 * When eecution of the sequence is complete, the supplied callback is called 
 * with 'this' set to the computation's data object, and a single parameter
 * that is the value supplied by the callback from the last function in the 
 * sequence.
 */
admiral.AsyncComputation.prototype.exec = function(val, callback) {
    //log.debug("admiral.AsyncComputation.exec");
    // Local function handles threading of asynchronous functions
    function eval_do(here, next, val) {
        function eval_done(val) {
            eval_do(here, next+1, val);
        }
        here.proc[next].call(here.data, val, eval_done);
    }
    // Local function returns callback chain-breaker 
    function eval_cb(here, callback) {
        function eval_chain_breaker(val, callback_ignored) {
            //log.debug("admiral.AsyncComputation: eval_chain_breaker "+val);
            callback.call(here.data, val);
        }
        return eval_chain_breaker; 
    }
    // Push chain-breaker to end of list
    this.proc.push(eval_cb(this, callback));
    // Initiate sequence
    eval_do(this, 0, val);
};

/**
 * Bind the result from the previous functionin the sequence to the named
 * variable in the computation's data object.
 */
admiral.AsyncComputation.prototype.bind = function(name) {
    // TODO: add diagnostic logic to detect multipleminvocations of callback
    function assign_fn(name) {
        function assign_do(val, callback) {
            //log.debug("admiral.AsyncComputation.bind "+name+" to "+val);
            this[name] = val;
            callback(val);
        }
        return assign_do;
    }
    this.eval(assign_fn(name));
    return this;
};

// End.constructor