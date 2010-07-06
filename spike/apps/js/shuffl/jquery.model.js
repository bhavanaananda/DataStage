/**
 * @fileoverview
 *  jQuery plugin to provide model and listener capabilities.
 *  
 * @author Graham Klyne
 * @version $Id: jquery.model.js 779 2010-05-06 08:25:42Z gk-google@ninebynine.org $
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
 * Logic copied from jQuery.data.  uuid is used to generate a unique value for
 * each object with which model events are associated.
 */
var uuid = 0;

/**
 * The 'model' method gets or sets a model value and, when setting a value, 
 * triggers any listeners.  Note that this method follows the style of jQuery's
 * .data method, and access the same values.
 * 
 * @param name      is a string that names a data value to be associated with 
 *                  this element, in the same way as jQuery(...).data.
 * @param value     is a value to be assigned to the model value, or
 *                  undefined if no value is to be assigned.
 * @return          the indicated model value from the first selected element
 *                  that was current just before calling this function, or
 *                  undefined.
 */
jQuery.fn.model = function (name, value)
{
    ////log.debug("jQuery.model "+name+", "+value);
    //var config = {'foo': 'bar'};
    //if (settings) jQuery.extend(config, settings);
    var retval = undefined;
    this.each(function()
    {
        var j = jQuery(this);
        var oldval = j.data(name);
        if (retval === undefined) {retval = oldval;};
        if (value !== undefined)
        {
            ////log.debug("jQuery.model newvalue "+shuffl.objectString(j));
            j.data(name, value);
            ////log.debug("model trigger event "+j.modelEvent(name));
            j.trigger(
                j.modelEvent(name), 
                {name:name, oldval:oldval, newval:value});
        };
    });
    return retval;
};

/**
 * Bind a model-change listener to a particular model value in all selected
 * elements.
 * 
 * The callback is invoked thus:
 *   fn(event, data) {
 *      // this  = jQuery object containing changed model variable
 *      // event = jQuery event object
 *      // data  = {name:modelvarname, oldval:oldval, newval:value}
 *   };
 */
jQuery.fn.modelBind = function (name, fn)
{
    this.each(function()
    {
        var j = jQuery(this);
        ////log.debug("modelBind event "+j.modelEvent(name));
        j.bind(j.modelEvent(name), fn);
    });
};

/**
 * Unbind a model-change listener from particular model value in all selected
 * elements.
 */
jQuery.fn.modelUnbind = function (name, fn)
{
    this.each(function()
    {
        var j = jQuery(this);
        j.unbind(j.modelEvent(name), fn);
    });
};

/**
 * Helper method returns model event name for the first element in the
 * current jQuery onject and supplied model value name.
 * 
 * The original design accessed the jQuery data cache id via this.data(""),
 * but that no longer works withj jQuery 1.4.2.  So we have to roll our own.
 */
jQuery.fn.modelEvent = function (name)
{
    var id = this.data("model_event_id");
    if (!id)
    {
        id = ++uuid;
        this.data("model_event_id", id);
    }
    return "model_"+id+"_"+name;
};

/**
 * Bind a function to a model-change event, then initiate some action that
 * should eventually result in the model value being updated.
 * 
 * This function takes two function parameters in the order that they are 
 * expected to execute - this is mainly a syntactic suguaring to make the
 * calling code more readable.
 * 
 * @param name      name of model value to bind
 * @param fexec     function to execute - jQuery object supplied
 * @param fhandler  event handler invoked when the model value is updated 
 */
jQuery.fn.modelBindExec = function (name, fexec, fhandler)
{
    this.each(function()
    {
        var j = jQuery(this);
        j.bind(j.modelEvent(name), fhandler);
        fexec(j);
    });
};

// End.
