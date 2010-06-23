/**
 * @fileoverview
 *  Test suite for 00-skeleton
 *  
 * @author Graham Klyne
 * @version $Id$
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
 * Test suite for workspace loading function
 * 
 * Dependencies:
 *  data/test-shuffl-loadworkspace-layout.json
 *  data/test-shuffl-loadworkspace-card_1.json
 *  data/test-shuffl-loadworkspace-card_2.json
 *  data/test-shuffl-loadworkspace-card_3.json
 *  data/test-shuffl-loadworkspace-linked-layout.json
 *  data/test-shuffl-loadworkspace-linked-card_1.json
 *  data/test-shuffl-loadworkspace-linked-card_2.json
 */

var NaN = Number.NaN;

/**
 * Function to register tests
 */

TestLoadWorkspace = function() {
    
    module("TestLoadWorkspace");

    test("TestLoadWorkspace(init)", function ()
    {
        logtest("TestLoadWorkspace(init)");
        shuffl.resetStorageHandlers();
        shuffl.addStorageHandler( 
            { uri:      "file:///"
            , name:     "LocalFile"
            , factory:  shuffl.LocalFileStorage
            });
        shuffl.addStorageHandler( 
            { uri:      "http://localhost:8080/exist/shuffl/"
            , name:     "ExistFile"
            , factory:  shuffl.LocalFileStorage
            });
        shuffl.addStorageHandler( 
            { uri:      "http://localhost/webdav/shuffl/"
            , name:     "ExistFile"
            , factory:  shuffl.LocalFileStorage
            });
        shuffl.addStorageHandler(
            { uri:      "http://zoo-samos.zoo.ox.ac.uk/webdav/shuffl/"
            , name:     "ExistFile"
            , factory:  shuffl.LocalFileStorage
            });
        ok(true, "TestLoadWorkspace running OK");
    });

    test("shuffl.LoadWorkspace", function () {
        expect(6);
        logtest("shuffl.LoadWorkspace");
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            try
            {
                shuffl.loadWorkspace("data/test-shuffl-loadworkspace-layout.json", callback);
                ok(true, "No exception");
            }
            catch (e)
            {
                ok(false, "Exception thrown: "+e.toString());
            }
        });
        m.eval(function(val,callback) {
            ok(!(val instanceof shuffl.Error), "Error returned: "+val.toString());
            var u = jQuery.uri().resolve("data/test-shuffl-loadworkspace-layout.json");
            equals(jQuery('#workspace').data('location'), u.toString(), "location");
            var w = jQuery("#workspace_status"); 
            equals(w.text(), u.toString(), '#workspace_status');
            ok(!w.hasClass("shuffl-error"), "shuffl-error class");
            //Done
            callback(true);
        });        
        m.exec({}, start);
        ok(true, "shuffl.LoadWorkspace initiated");
        stop(2000);
    });

    test("shuffl.LoadWorkspace (check data)", function () {
        expect(55);
        logtest("shuffl.LoadWorkspace (check data)");
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            shuffl.loadWorkspace("data/test-shuffl-loadworkspace-layout.json", callback);
        });
        m.eval(function(val,callback) {
            var u = jQuery.uri().resolve("data/test-shuffl-loadworkspace-layout.json");
            equals(jQuery('#workspace').data('location'), u.toString(), "location");
            var w = jQuery("#workspace_status"); 
            equals(w.text(), u.toString(), '#workspace_status');
            ok(!w.hasClass("shuffl-error"), "shuffl-error class");
            //1
            var c1 = jQuery("#id_1");
            ok(c1 != undefined,                                         "card id_1 defined");
            equals(c1.attr('id'), "id_1",                               "card 1 id attribute");
            ok(c1.hasClass('shuffl-card'),                              "card 1 shuffl card class");
            ok(c1.hasClass('stock-yellow'),                             "card 1 CSS class");
            equals(c1.find("cident").text(), "id_1",                    "card 1 id field");
            equals(c1.find("cclass").text(), "shuffl-freetext-yellow",  "card 1 class/type field");
            equals(c1.find("ctitle").text(), "Card 1 title",            "card 1 title field");
            equals(c1.find("ctags").text(),  "card_1_tag,yellowtag",    "card 1 tags field");
            equals(c1.data('shuffl:id'),    "id_1",                     "card 1 data id");
            equals(c1.data('shuffl:type' ), "shuffl-freetext-yellow",   "card 1 data class/type");
            equals(c1.data('shuffl:dataref'), 
                "test-shuffl-loadworkspace-card_1.json",                "card 1 shuffl:dataref");          
            equals(c1.data('shuffl:datauri'), 
                jQuery.uri("test-shuffl-loadworkspace-card_1.json", u), "card 1 shuffl:datauri");          
            equals(c1.data('shuffl:datamod'), false,                    "card 1 shuffl:datamod");          
            equals(c1.data('shuffl:dataRW'),  false,                    "card 1 shuffl:dataRW");          
            var p1 = c1.position();
            range(p1.left, 99, 101,                                     "card 1 position-left");
            range(p1.top,  29,  31,                                     "card 1 position-top");
            equals(c1.css("zIndex"), "11",                              "card 1 zIndex");
            //2
            var c2 = jQuery("#id_2");
            ok(c2 != undefined,                                         "card id_2 defined");
            equals(c2.attr('id'), "id_2",                               "card 2 id attribute");
            ok(c2.hasClass('shuffl-card'),                              "card 2 shuffl card class");
            ok(c2.hasClass('stock-blue'),                               "card 2 CSS class");
            equals(c2.find("cident").text(), "id_2",                    "card 2 id field");
            equals(c2.find("cclass").text(), "shuffl-freetext-blue",    "card 2 class/type field");
            equals(c2.find("ctitle").text(), "Card 2 title",            "card 2 title field");
            equals(c2.find("ctags").text(),  "card_2_tag,bluetag",      "card 2 tags field");
            equals(c2.data('shuffl:id'),    "id_2",                     "card 2 data id");
            equals(c2.data('shuffl:type' ), "shuffl-freetext-blue",     "card 2 data class/type");
            equals(c2.data('shuffl:dataref'), 
                "test-shuffl-loadworkspace-card_2.json",                "card 2 shuffl:dataref");          
            equals(c2.data('shuffl:datauri'), 
                jQuery.uri("test-shuffl-loadworkspace-card_2.json", u), "card 2 shuffl:datauri");          
            equals(c2.data('shuffl:datamod'), false,                    "card 2 shuffl:datamod");          
            equals(c2.data('shuffl:dataRW'),  false,                    "card 2 shuffl:dataRW");          
            var p2 = c2.position();
            range(p2.left, 149, 151,                                    "card 2 position-left");
            range(p2.top,   59,  61,                                    "card 2 position-top");
            equals(c2.css("zIndex"), "12",                              "card 2 zIndex");
            //3 (third case mainly intended to check z-index values)
            var c3 = jQuery("#id_3");
            ok(c3 != undefined,                                         "card id_3 defined");
            equals(c3.attr('id'), "id_3",                               "card 3 id attribute");
            ok(c3.hasClass('shuffl-card'),                              "card 3 shuffl card class");
            ok(c3.hasClass('stock-green'),                              "card 3 CSS class");
            equals(c3.find("cident").text(), "id_3",                    "card 3 id field");
            equals(c3.find("cclass").text(), "shuffl-freetext-green",   "card 3 class/type field");
            equals(c3.find("ctitle").text(), "Card 3 title",            "card 3 title field");
            equals(c3.find("ctags").text(),  "card_3_tag,greentag",     "card 3 tags field");
            equals(c3.data('shuffl:id'),    "id_3",                     "card 3 data id");
            equals(c3.data('shuffl:type' ), "shuffl-freetext-green",    "card 3 data class/type");
            equals(c3.data('shuffl:dataref'), 
                "test-shuffl-loadworkspace-card_3.json",                "card 3 shuffl:dataref");          
            equals(c3.data('shuffl:datauri'), 
                jQuery.uri("test-shuffl-loadworkspace-card_3.json", u), "card 3 shuffl:datauri");          
            equals(c3.data('shuffl:datamod'), false,                    "card 3 shuffl:datamod");          
            equals(c3.data('shuffl:dataRW'),  false,                    "card 3 shuffl:dataRW");          
            var p3 = c3.position();
            range(p3.left, 199, 201,                                    "card 3 position-left");
            range(p3.top,   89,  91,                                    "card 3 position-top");
            equals(c3.css("zIndex"), "13",                              "card 3 zIndex");
            //Done
            callback(true);
        });        
        m.exec({}, start);
        ok(true, "shuffl.LoadWorkspace (check data) initiated");
        stop(2000);
    });

    test("shuffl.LoadWorkspace (non-existent feed/directory)", function () {
        expect(6);
        logtest("shuffl.LoadWorkspace (non-existent feed)");
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            shuffl.loadWorkspace("dataz/test-shuffl-loadworkspace-layout.json", callback);
        });
        m.eval(function(val,callback) {
            log.debug("shuffl.LoadWorkspace return: "+shuffl.objectString(val));
            ok(val instanceof shuffl.Error, "Error value returned");
            equals(val.toString(), "shuffl error: Request failed (error; HTTP status: 404 Not Found)", "Error message returned");
            equals(val.response, "404 Not Found", "Ajax HTTP response details");
            var w = jQuery("#workspace_status"); 
            equals(w.text(), "shuffl error: Request failed (error; HTTP status: 404 Not Found)", "#workspace_status text");
            ok(w.hasClass("shuffl-error"), "shuffl-error class");
            callback(true);
        });        
        m.exec({}, start);
        ok(true, "shuffl.LoadWorkspace initiated");
        stop(2000);
    });

    test("shuffl.LoadWorkspace (non-existent layout file)", function () {
        expect(6);
        logtest("shuffl.LoadWorkspace (non-existent layout file)");
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            shuffl.loadWorkspace("data/test-shuffl-loadworkspace-layout.NOFILE", callback);
        });
        m.eval(function(val,callback) {
            log.debug("shuffl.LoadWorkspace return: "+shuffl.objectString(val));
            ok(val instanceof shuffl.Error, "Error value returned");
            equals(val.toString(), "shuffl error: Request failed (error; HTTP status: 404 Not Found)", "Error message returned");
            equals(val.response, "404 Not Found", "Ajax HTTP response details");
            var w = jQuery("#workspace_status"); 
            equals(w.text(), "shuffl error: Request failed (error; HTTP status: 404 Not Found)", "#workspace_status text");
            ok(w.hasClass("shuffl-error"), "shuffl-error class");
            callback(true);
        });        
        m.exec({}, start);
        ok(true, "shuffl.LoadWorkspace initiated");
        stop(2000);
    });

    test("shuffl.LoadWorkspace (missing card file)", function () {
        expect(6);
        logtest("shuffl.LoadWorkspace (missing card file)");
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            shuffl.loadWorkspace("data/test-shuffl-loadworkspace-layout-missingcard.json", callback);
        });
        m.eval(function(val,callback) {
            log.debug("shuffl.LoadWorkspace return: "+shuffl.objectString(val));
            ok(val instanceof shuffl.Error, "Error value returned");
            equals(val.toString(), "shuffl error: Request failed (error; HTTP status: 404 Not Found)", "Error message returned");
            equals(val.response, "404 Not Found", "Ajax HTTP response details");
            var w = jQuery("#workspace_status"); 
            equals(w.text(), "shuffl error: Request failed (error; HTTP status: 404 Not Found)", "#workspace_status text");
            ok(w.hasClass("shuffl-error"), "shuffl-error class");
            callback(true);
        });        
        m.exec({}, start);
        ok(true, "shuffl.LoadWorkspace initiated");
        stop(2000);
    });
    
    test("shuffl.ResetWorkspace", function () {
        logtest("shuffl.ResetWorkspace");
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            shuffl.loadWorkspace("data/test-shuffl-loadworkspace-layout.json", callback);
        });
        m.eval(function(val,callback) {
            log.debug("Test workspace reloaded");
            var u = jQuery.uri().resolve("data/test-shuffl-loadworkspace-layout.json");
            equals(jQuery('#workspace_status').text(), u.toString(), '#workspace_status');
            equals(jQuery('#workspace').data('location'), u.toString(), "location");
            equals(jQuery('#workspace').data('wsname'), "test-shuffl-loadworkspace-layout.json", "wsname");
            equals(jQuery('#workspace').data('wsdata')['shuffl:base-uri'], "#", "shuffl:base-uri");
            // Reset workspace
            shuffl.resetWorkspace(callback);
        });        
        m.eval(function(val,callback) {
            log.debug("Workspace reset")
            equals(jQuery('#workspace_status').text(), "", '#workspace_status');
            equals(jQuery('#workspace').data('location'), null, "location");
            equals(jQuery('#workspace').data('wsname'), null, "wsname");
            equals(jQuery('#workspace').data('wsdata'), null, "wsdata");
            equals(jQuery('.shuffl-stockpile').length, 0, "empty stockbar");
            equals(jQuery("#stockbar").children().length, 1, "initial entries in stockbar");
            // Empty workspace?
            equals(jQuery("#layout").children().length, 0, "no cards in workspace");
            // Done
            callback(true);
        });        
        m.exec({}, start);
        ok(true, "shuffl.ResetWorkspace initiated");
        stop(2000);
    });
    
    test("shuffl.ResetWorkspace then shuffl.loadWorkspace", function () {
        logtest("shuffl.ResetWorkspace then shuffl.loadWorkspace");
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            shuffl.resetWorkspace(callback);
        });
        m.eval(function(val,callback) {
            log.debug("Workspace reset")
            equals(jQuery('#workspace_status').text(), "", '#workspace_status');
            equals(jQuery('#workspace').data('location'), null, "location");
            equals(jQuery('#workspace').data('wsname'), null, "wsname");
            equals(jQuery('#workspace').data('wsdata'), null, "wsdata");
            // Done
            callback(true);
        });        
        m.eval(function(val,callback) {
            shuffl.loadWorkspace("data/test-shuffl-loadworkspace-layout.json", callback);
        });
        m.eval(function(val,callback) {
            var u = jQuery.uri().resolve("data/test-shuffl-loadworkspace-layout.json");
            equals(jQuery('#workspace').data('location'), u.toString(), "location");
            var w = jQuery("#workspace_status"); 
            equals(w.text(), u.toString(), '#workspace_status');
            ok(!w.hasClass("shuffl-error"), "shuffl-error class");
            var c1 = jQuery("#id_1");
            equals(c1.attr('id'), "id_1",                               "card 1 id attribute");
            var c2 = jQuery("#id_2");
            ok(c2 != undefined,                                         "card id_2 defined");
            equals(c2.attr('id'), "id_2",                               "card 2 id attribute");
            //3
            var c3 = jQuery("#id_3");
            ok(c3 != undefined,                                         "card id_3 defined");
            equals(c3.attr('id'), "id_3",                               "card 3 id attribute");
            //Done
            callback(true);
        });        
        m.exec({}, start);
        ok(true, "shuffl.ResetWorkspace then shuffl.loadWorkspace initiated");
        stop(2000);
    });
    
    test("shuffl.LoadWorkspace (linked cards)", function () {
        logtest("shuffl.LoadWorkspace (linked cards)");
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            shuffl.loadWorkspace("data/test-shuffl-loadworkspace-linked-layout.json", callback);
        });
        m.eval(function(val,callback) {
            log.debug("Test workspace reloaded");
            var u = jQuery.uri().resolve("data/test-shuffl-loadworkspace-linked-layout.json");
            equals(jQuery('#workspace_status').text(), u.toString(), '#workspace_status');
            equals(jQuery('#workspace').data('location'), u.toString(), "location");
            this.c1 = jQuery("#id_1");
            equals(this.c1.model('shuffl:title'), "Data table card", "c2[shuffl:title]");
            same(this.c1.model('shuffl:table')[0], [ "",      "col1",  "col2",  "col3" ], "c1[shuffl:table][0]");
            same(this.c1.model('shuffl:table')[1], [ "row_1", "1.11",  "1.22",  "1.33" ], "c1[shuffl:table][1]");
            same(this.c1.model('shuffl:table')[2], [ "row_2", "2.11",  "2.22",  "2.33" ], "c1[shuffl:table][2]");
            this.c2 = jQuery("#id_2");
            equals(this.c2.model('shuffl:title'), "Data graph card (Data table card)", "c2[shuffl:title]");
            same(this.c2.model('shuffl:labels'), ["col1",  "col2",  "col3"], "c2[shuffl:labels]");
            same(this.c2.model('shuffl:series')[0], [ [NaN, 1.11], [NaN, 2.11], [NaN, NaN] ], "c2[shuffl:series][0]");
            same(this.c2.model('shuffl:series')[1], [ [NaN, 1.22], [NaN, 2.22], [NaN, NaN] ], "c2[shuffl:series][1]");
            same(this.c2.model('shuffl:series')[2], [ [NaN, 1.33], [NaN, 2.33], [NaN, NaN] ], "c2[shuffl:series][2]");
            callback(true);
        });        
        m.eval(function(val,callback) {
            // Change source title
            this.c1.model("shuffl:title", "Update table title");
            equals(this.c1.model('shuffl:title'), "Update table title", "c2[shuffl:title] (2)");
            equals(this.c2.model('shuffl:title'), "Data graph card (Update table title)", "c2[shuffl:title] (2)");
            // Change source table
            var newtable =
                [ [ "", "ccc1", "ccc2", "ccc3" ]
                , [  1, 11.11,  11.22,  11.33  ]
                , [  2, 12.11,  12.22,  12.33  ]
                ]
            this.c1.model("shuffl:table", newtable);
            same(this.c2.model('shuffl:labels'), ["ccc1",  "ccc2",  "ccc3"], "c2[shuffl:labels] (3)");
            same(this.c2.model('shuffl:series')[0], [ [1, 11.11], [2, 12.11] ], "c2[shuffl:series][0] (3)");
            same(this.c2.model('shuffl:series')[1], [ [1, 11.22], [2, 12.22] ], "c2[shuffl:series][1] (3)");
            same(this.c2.model('shuffl:series')[2], [ [1, 11.33], [2, 12.33] ], "c2[shuffl:series][2] (3)");
            // Done
            callback(true);
        });
        m.exec({}, start);
        stop(2000);
    });

};

// End
