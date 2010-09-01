/**
 * @fileoverview
 *  Test suite for 00-skeleton
 *  
 * @author Graham Klyne
 * @version $Id: test-jquery.model.js 840 2010-06-18 09:50:42Z gk-google@ninebynine.org $
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
 * Test suite for jquery.model plugin
 */

/**
 * Function to register tests
 */
TestJqueryModel = function() {

    module("TestJqueryModel");

    test("set and get data values", function ()
    {
        logtest("TestJqueryModel: set and get data values");
        var j = jQuery("<element><sub1 /><sub2 /></element>");
        j.data("v1",1);
        j.data("v2","2");
        equals(j.data("v1"), 1, "v1");
        equals(j.data("v2"), "2", "v2");
    });

    test("set and get model values", function () 
    {
        logtest("TestJqueryModel: set and get model values");
        var j = jQuery("<element><sub1 /><sub2 /></element>");
        j.model("v1",1);
        j.model("v2","2");
        equals(j.model("v1"), 1, "v1");
        equals(j.model("v2"), "2", "v2");
        equals(j.data("v1"), 1, "v1");
        equals(j.data("v2"), "2", "v2");
    });

    test("event subscription", function ()
    {
        logtest("TestJqueryModel: event subscription");
        var j = jQuery("<element><sub1 /><sub2 /></element>");
        var save = [];
        function saver(event, data) {
            ////log.debug("saver event: "+shuffl.objectString(event));
            ////log.debug("saver data:  "+shuffl.objectString(data));
            save.push(data);
        };
        j.model("v1",1);
        j.model("v2",2);
        equals(j.model("v1"), 1, "v1");
        equals(j.model("v2"), 2, "v2");
        j.modelBind("v1", saver);
        j.modelBind("v3", saver);
        j.model("v1",11);
        j.model("v2",22);
        j.model("v3",[[]]);
        equals(j.model("v1"), 11, "v1");
        equals(j.model("v2"), 22, "v2");
        same(j.model("v3"), [[]], "v3");
        equals(save.length, 2, "save.length");
        same(save[0], { "name": "v1", "oldval": 1, "newval": 11 }, "save[0]");
        same(save[1], { "name": "v3", "oldval": undefined, "newval": [[]] }, "save[1]");
        j.modelBind('shuffl:table', saver);
        j.model('shuffl:table', [[]]);
        equals(save.length, 3, "save.length (3)");
        same(j.model('shuffl:table'), [[]], 'shuffl:table');
        same(save[2], { "name": "shuffl:table", "oldval": undefined, "newval": [[]] }, "save[2]");
    });

    test("event unsubscription", function ()
    {
        logtest("TestJqueryModel: event unsubscription");
        var j = jQuery("<element><sub1 /><sub2 /></element>");
        var save = [];
        function saver(event, data) {
            save.push(data);
        };
        j.model("v1",1);
        j.model("v2",2);
        equals(j.model("v1"), 1, "v1");
        equals(j.model("v2"), 2, "v2");
        j.modelBind("v1", saver);
        j.model("v1",11);
        j.model("v2",22);
        equals(j.model("v1"), 11, "v1");
        equals(j.model("v2"), 22, "v2");
        equals(save.length, 1, "save.length");
        same(save[0], { "name": "v1", "oldval": 1, "newval": 11 }, "save[0]");
        j.modelUnbind("v1", saver);
        j.modelBind("v2", saver);
        j.model("v1",111);
        j.model("v2",222);
        equals(j.model("v1"), 111, "v1");
        equals(j.model("v2"), 222, "v2");
        equals(save.length, 2, "save.length");
        same(save[0], { "name": "v1", "oldval": 1, "newval": 11 }, "save[0]");
        same(save[1], { "name": "v2", "oldval": 22, "newval": 222 }, "save[1]");
    });

    test("multiple elements selected", function ()
    {
        logtest("TestJqueryModel: multiple elements selected");
        var j = jQuery("<element><sub/><sub/></element>").find("sub");
        var save = [];
        function saver(event, data) {
            save.push(data);
        };
        j.model("v1",1);
        j.model("v2",2);
        equals(j.model("v1"), 1, "v1");
        equals(j.model("v2"), 2, "v2");
        j.modelBind("v1", saver);
        j.model("v1",11);
        j.model("v2",22);
        equals(j.model("v1"), 11, "v1");
        equals(j.model("v2"), 22, "v2");
        equals(save.length, 2, "save.length");
        same(save[0], { "name": "v1", "oldval": 1, "newval": 11 }, "save[0]");
        same(save[1], { "name": "v1", "oldval": 1, "newval": 11 }, "save[1]");
        j.modelUnbind("v1", saver);
        j.modelBind("v2", saver);
        j.model("v1",111);
        j.model("v2",222);
        equals(j.model("v1"), 111, "v1");
        equals(j.model("v2"), 222, "v2");
        equals(save.length, 4, "save.length (4)");
        same(save[1], { "name": "v1", "oldval": 1, "newval": 11 }, "save[1]");
        same(save[2], { "name": "v2", "oldval": 22, "newval": 222 }, "save[2]");
        same(save[3], { "name": "v2", "oldval": 22, "newval": 222 }, "save[3]");
    });

    test("event subscription on empty div", function ()
    {
        logtest("TestJqueryModel: event subscription");
        var j = jQuery("<div/>");
        var save = [];
        function saver(event, data) {
            ////log.debug("saver event: "+shuffl.objectString(event));
            ////log.debug("saver data:  "+shuffl.objectString(data));
            save.push(data);
        };
        j.model("v1",1);
        j.model("v2",2);
        equals(j.model("v1"), 1, "v1");
        equals(j.model("v2"), 2, "v2");
        j.modelBind("v1", saver);
        j.modelBind("v3", saver);
        j.model("v1",11);
        j.model("v2",22);
        j.model("v3",[[]]);
        equals(j.model("v1"), 11, "v1");
        equals(j.model("v2"), 22, "v2");
        same(j.model("v3"), [[]], "v3");
        equals(save.length, 2, "save.length");
        same(save[0], { "name": "v1", "oldval": 1, "newval": 11 }, "save[0]");
        same(save[1], { "name": "v3", "oldval": undefined, "newval": [[]] }, "save[1]");
        j.modelBind('shuffl:table', saver);
        j.model('shuffl:table', [[]]);
        equals(save.length, 3, "save.length (3)");
        same(j.model('shuffl:table'), [[]], 'shuffl:table');
        same(save[2], { "name": "shuffl:table", "oldval": undefined, "newval": [[]] }, "save[2]");
    });

};

// End
