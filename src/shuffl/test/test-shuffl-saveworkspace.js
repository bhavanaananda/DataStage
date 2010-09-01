/**
 * @fileoverview
 *  Test suite for 00-skeleton
 *  
 * @author Graham Klyne
 * @version $Id: test-shuffl-saveworkspace.js 840 2010-06-18 09:50:42Z gk-google@ninebynine.org $
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
 * @fileoverview
 * Test suite for workspace saving functions
 *  
 * @author Graham Klyne
 * @version $Id: test-shuffl-saveworkspace.js 840 2010-06-18 09:50:42Z gk-google@ninebynine.org $
 * 
 * Coypyright (C) 2009, University of Oxford
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
 * Dependencies:
 *  test-shuffl-saveworkspace-layout.json
 *  eXist server running at localhost:8080
 *  The test page must be loaded from the eXist server for the test to run
 *  (due to same-origin security restriction).
 */

/**
 * Function to register tests
 */

TestSaveWorkspace = function() {
    
    module("TestSaveWorkspace");

    // Figure base URI based on page URI
    var pageuri = jQuery.uri().toString();
    var baseuri = null;
    var baseuri_list =
        [ "http://localhost/webdav/"
        , "http://zoo-samos.zoo.ox.ac.uk/webdav/"
        , "http://localhost:8080/exist/"
        ];
    for (i in baseuri_list)
    {
        var b = baseuri_list[i];
        if (shuffl.starts(b, pageuri))
        {
            baseuri = b;
        }
    }

    // Check we have a suitable base URI
    test("NOTE: this test must be run from the web server used to store shuffl workspace data", function ()
    {
        logtest("TestSaveWorkspace source check");
        if (!baseuri)
        {
            ok(baseuri, "TestSaveWorkspace must be served from exist/atom or WebDAV location");
            throw "TestSaveWorkspace must be served from exist/atom or WebDAV location";
        }
    });

    // Figure out collection URI with special handling for eXist (AtomPub):
    var coluri     = baseuri+"shuffltest/";
    var nocoluri   = baseuri+"shuffltest_nofeed/";
    if (shuffl.ends("exist/", baseuri))
    {
        coluri   = baseuri + "atom/edit/shuffltest/";
        nocoluri = baseuri + "atom/edit/shuffltest_nofeed/";
    }
    // Set up rekmaining URIs
    var baduri     = baseuri+"shuffltest?bad#feed";
    var layoutname = "test-shuffl-saveworkspace-layout";
    var layoutcol  = coluri+layoutname+"/";
    var layoutref  = layoutname+".json";
    var layoutloc  = "data/test-shuffl-saveworkspace-layout.json";
    var layouturi  = jQuery.uri(layoutref, layoutcol);
    var initialuri = jQuery.uri(layoutloc);
    var card3ref   = "test-shuffl-loadworkspace-card_3.json";
    var card3uri   = jQuery.uri(card3ref, layoutcol);

    var shuffl_prefixes =
        [ { 'shuffl:prefix':  'shuffl', 'shuffl:uri': 'http://purl.org/NET/Shuffl/vocab#' }
        , { 'shuffl:prefix':  'rdf',    'shuffl:uri': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' }
        , { 'shuffl:prefix':  'rdfs',   'shuffl:uri': 'http://www.w3.org/2000/01/rdf-schema#' }
        , { 'shuffl:prefix':  'owl',    'shuffl:uri': 'http://www.w3.org/2002/07/owl#' }
        , { 'shuffl:prefix':  'xsd',    'shuffl:uri': 'http://www.w3.org/2001/XMLSchema#' }
        ];

    test("TestSaveWorkspace(init)", function ()
    {
        logtest("TestSaveWorkspace(init)");
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
            { uri:      "http://zoo-samos.zoo.ox.ac.uk/webdav/shuffl/"
            , name:     "ExistFile"
            , factory:  shuffl.LocalFileStorage
            });
        shuffl.addStorageHandler(
            { uri:      "http://localhost:8080/exist/atom/"
            , name:     "ExistAtom"
            , factory:  shuffl.ExistAtomStorage
            });
        shuffl.addStorageHandler(
            { uri:      "http://zoo-samos.zoo.ox.ac.uk/webdav/"
            , name:     "WebDAVsamos"
            , factory:  shuffl.WebDAVStorage
            });
        shuffl.addStorageHandler(
            { uri:      "http://localhost/webdav/"
            , name:     "WebDAVlocalhost"
            , factory:  shuffl.WebDAVStorage
            });
        log.debug("Storage handlers: "+jQuery.toJSON(shuffl.listStorageHandlers()));
        ok(true, "TestSaveWorkspace running OK");
    });
    
    test("shuffl.loadWorkspace (empty)", function ()
    {
        logtest("shuffl.loadWorkspace empty workspace");
        expect(36);
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            shuffl.loadWorkspace(layoutloc, callback);
        });
        m.eval(function(val,callback) {
            // Check empty workspace
            var u = jQuery.uri().resolve(layoutloc);
            equals(jQuery('#workspace_status').text(), u.toString(), '#workspace_status');
            equals(jQuery('#workspace').data('location'), u.toString(), "location");
            equals(jQuery('#workspace').data('wsname'), layoutref, "wsname");
            equals(jQuery('#workspace').data('wsdata')['shuffl:base-uri'], "#", "shuffl:base-uri");
            // More tests as needed
            var stockcolour=["yellow","blue","green","orange","pink","purple"];
            var stocklabel=["Ye","Bl","Gr","Or","Pi","Pu"];
            for (var i = 0; i<6; i++) {
                var s = jQuery('.shuffl-stockpile').eq(i);
                equals(s.attr('id'), "", "["+i+"] stock id ");  // No ID on stockpiles
                ok(s.hasClass('stock-'+stockcolour[i]), "["+i+"] stock-"+stockcolour[i]);
                equals(s.text(), stocklabel[i], "["+i+"] stock text "+stocklabel[i]);
                equals(s.data('CardType'), "shuffl-freetext-"+stockcolour[i], "["+i+"] stock CardType "+"shuffl-freetext-"+stockcolour[i]);
                ok(typeof s.data('makeCard') == "function", "["+i+"] stock makeCard");
            };
            // Empty workspace?
            equals(jQuery("#layout").children().length, 0, "no cards in workspace");
            // Done
            callback(true);
        });        
        m.exec({}, start);
        ok(true, "shuffl.LoadWorkspace (empty) initiated");
        stop(3000);
    });

    test("shuffl.saveNewWorkspace (empty)", function ()
    {
        logtest("shuffl.saveNewWorkspace (empty)");
        expect(7);
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            log.debug("Load empty workspace");
            shuffl.loadWorkspace(layoutloc, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Check workspace loaded");
            equals(jQuery('#workspace').data('location'), initialuri.toString(), "location");
            equals(jQuery('#workspace').data('wsname'), layoutref, "wsname");
            log.debug("Delete old workspace");
            shuffl.deleteWorkspace(layouturi, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Save empty workspace: "+layoutcol+", "+layoutname);
            shuffl.saveNewWorkspace(coluri, layoutname, callback);
        });
        m.eval(function(val,callback) {
            //log.debug("Check result from save: "+shuffl.objectString(val));
            log.debug("Check result from save: "+jQuery.toJSON(val));
            equals(val.wscoluri, layoutcol,  "val.wscoluri");
            equals(val.wsuri,    layouturi.toString(),  "val.wsuri");
            equals(val.wsref,    layoutref,  "val.wsref");
            equals(val.wsid,     layoutname, "val.wsid");
            log.debug("Reset workspace...");
            // Done
            callback(true);
        });        
        m.exec({}, start);
        ok(true, "shuffl.SaveNewWorkspace (empty) initiated");
        stop(3000);
    });

    test("shuffl.saveNewWorkspace (empty:check)", function ()
    {
        logtest("shuffl.saveNewWorkspace (empty:check)");
        expect(36);
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            log.debug("Reset workspace...");
            shuffl.resetWorkspace(callback);
        });
        m.eval(function(val,callback) {
            log.debug("Workspace is reset");
            log.debug("Reload empty workspace from AtomPub...");
            shuffl.loadWorkspace(layouturi, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Check reloaded workspace "+layouturi);
            var u = jQuery.uri(layouturi);
            equals(jQuery('#workspace_status').text(), u.toString(), '#workspace_status');
            equals(jQuery('#workspace').data('location'), u.toString(), "location");
            equals(jQuery('#workspace').data('wsname'), layoutref, "wsname");
            equals(jQuery('#workspace').data('wsdata')['shuffl:base-uri'], "#", "shuffl:base-uri");
            // More tests as needed
            var stockcolour=["yellow","blue","green","orange","pink","purple"];
            var stocklabel=["Ye","Bl","Gr","Or","Pi","Pu"];
            for (var i = 0; i<6; i++) {
                var s = jQuery('.shuffl-stockpile').eq(i);
                equals(s.attr('id'), "", "["+i+"] stock id ");  // No ID on stockpiles
                ok(s.hasClass('stock-'+stockcolour[i]), "["+i+"] stock-"+stockcolour[i]);
                equals(s.text(), stocklabel[i], "["+i+"] stock text "+stocklabel[i]);
                equals(s.data('CardType'), "shuffl-freetext-"+stockcolour[i], "["+i+"] stock CardType "+"shuffl-freetext-"+stockcolour[i]);
                ok(typeof s.data('makeCard') == "function", "["+i+"] stock makeCard");
            };
            // Empty workspace?
            equals(jQuery("#layout").children().length, 0, "no cards in workspace");
            // Done
            callback(true);
        });        
        m.exec({}, start);
        ok(true, "shuffl.SaveNewWorkspace (empty:check) initiated");
        stop(3000);
    });

    test("shuffl.saveCard", function ()
    {
        logtest("shuffl.saveCard");
        expect(26);
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            log.debug("Reset workspace...");
            shuffl.resetWorkspace(callback);
        });
        m.eval(function(val,callback) {
            log.debug("Workspace is reset");
            log.debug("Reload empty workspace from AtomPub...");
            shuffl.loadWorkspace(layouturi, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Get new card data");
            var session = shuffl.makeStorageSession(".");
            shuffl.readCard(session, "", "data/test-shuffl-loadworkspace-card_1.json", callback)
        });
        m.eval(function(val,callback) {
            log.debug("Check new card data");
            equals(val['shuffl:id'], 'id_1', "shuffl:id");
            equals(val['shuffl:type'], 'shuffl-freetext-yellow', "shuffl:type");
            equals(val['shuffl:version'], '0.1', "shuffl:version");
            equals(val['shuffl:base-uri'], '#', "shuffl:base-uri");
            for (var i = 0 ; i<shuffl_prefixes.length ; i++) {
                same(val['shuffl:uses-prefixes'][i], shuffl_prefixes[i], "shuffl:uses-prefixes["+i+"]");
            };
            equals(val['shuffl:data']['shuffl:title'], "Card 1 title",   'shuffl:data-title');
            same  (val['shuffl:data']['shuffl:tags'],  [ 'card_1_tag', 'yellowtag' ],   'shuffl:data-tags');
            equals(val['shuffl:data']['shuffl:text'],  "Card 1 free-form text here<br/>line 2<br/>line3<br/>yellow", 'shuffl:data-text (1)');
            log.debug("Save card data");
            var card    = shuffl.createCardFromData(val['shuffl:id'], val['shuffl:type'], val);
            var session = shuffl.makeStorageSession(layoutcol);
            shuffl.saveCard(session, "", val['shuffl:id']+".json", card, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Check shuffl.saveCard response "+shuffl.objectString(val));
            if (val instanceof shuffl.Error) 
            {
                log.error("shuffl.saveCard returns error "+val.toString());
                callback(val); 
                return;
            };
            equals(val, "id_1.json", "card relative URI");
            log.debug("Read back card "+val);
            var session = shuffl.makeStorageSession(layoutcol);
            shuffl.readCard(session, "", val, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Check card values "+shuffl.objectString(val));
            equals(val['shuffl:id'], 'id_1', "shuffl:id");
            equals(val['shuffl:type'], 'shuffl-freetext-yellow', "shuffl:type");
            equals(val['shuffl:version'], '0.1', "shuffl:version");
            equals(val['shuffl:base-uri'], '#', "shuffl:base-uri");
            for (var i = 0 ; i<shuffl_prefixes.length ; i++) {
                same(val['shuffl:uses-prefixes'][i], shuffl_prefixes[i], "shuffl:uses-prefixes["+i+"]");
            };
            equals(val['shuffl:data']['shuffl:title'], "Card 1 title",   'shuffl:data-title');
            same  (val['shuffl:data']['shuffl:tags'],  [ 'card_1_tag', 'yellowtag' ],   'shuffl:data-tags');
            equals(val['shuffl:data']['shuffl:text'],  "Card 1 free-form text here<br/>line 2<br/>line3<br/>yellow", 'shuffl:data-text (2)');
            callback({});
        });
        m.exec({}, start);
        ok(true, "shuffl.saveCard initiated");
        stop(3000);
    });

    // eXist won't delete a media resource
    notest("shuffl.deleteCard", function ()
    {
        logtest("shuffl.deleteCard");
        expect(3);
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            log.debug("Read back card again");
            var session = shuffl.makeStorageSession(layoutcol);
            shuffl.readCard(session, "", "id_1.json", callback);
        });
        m.eval(function(val,callback) {
            log.debug("Check card is read OK");
            equals(val['shuffl:id'], 'id_1', "shuffl:id");
            log.debug("Delete card");
            shuffl.deleteCard(jQuery.uri("id_1.json", layoutcol), callback);
        });
        m.eval(function(val,callback) {
            log.debug("deleteCard returns: "+val);
            same(val, null, "deleteCard return");
            callback(val);
        });
        m.exec({}, start);
        ok(true, "shuffl.deleteCard initiated");
        stop(3000);
    });

    // This "test" is run to remove the card saved previously.
    test("Recreate empty workspace", function()
    {
        logtest("Recreate empty workspace");
        expect(7);
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            log.debug("Load empty workspace");
            shuffl.loadWorkspace(layoutloc, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Delete old workspace");
            shuffl.deleteWorkspace(layouturi, callback);
        });
        m.eval(function(val,callback) {
            same(val, null, "shuffl.deleteWorkspace return");
            log.debug("Save empty workspace");
            shuffl.saveNewWorkspace(coluri, layoutname, callback);
        });        
        m.eval(function(val,callback) {
            ////log.debug("Check result from save: "+shuffl.objectString(val));
            log.debug("Check result from save: "+val.wsuri);
            equals(val.wscoluri, layoutcol,  "val.wscoluri");
            equals(val.wsuri,    layouturi,  "val.wsuri");
            equals(val.wsref,    layoutref,  "val.wsref");
            equals(val.wsid,     layoutname, "val.wsid");
            this.wsuri = val.wsuri;
            log.debug("Reset workspace...");
            shuffl.resetWorkspace(callback);
        });
        m.eval(function(val,callback) {
            log.debug("Reload empty workspace from AtomPub...");
            shuffl.loadWorkspace(this.wsuri, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Check reloaded workspace "+this.wsuri);
            var u = jQuery.uri(this.wsuri);
            equals(jQuery('#workspace_status').text(), u.toString(), '#workspace_status');
            callback(true);
        });
        m.exec({}, start);
        ok(true, "Reload empty workspace initiated");
        stop(3000);
    });

    // Add card to workspace, save workspace, read back, check content
    test("shuffl.saveNewWorkspace (with card)", function ()
    {
        logtest("shuffl.saveNewWorkspace (with card)");
        expect(72);
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            log.debug("Load empty workspace");
            shuffl.loadWorkspace(layoutloc, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Read card data from local file");
            // Note use of base URI so that dataref matches existing value in layout
            var session = shuffl.makeStorageSession(".");
            shuffl.readCard(session, "data/", "test-shuffl-loadworkspace-card_3.json", callback);
        });
        m.eval(function(val,callback) {
            //log.debug("readCard response: "+shuffl.objectString(val));
            equals(val['shuffl:id'],    "id_3",                     "new card shuffl:id");
            equals(val['shuffl:type'],  "shuffl-freetext-green",    "new card shuffl:type");
            equals(val['shuffl:dataref'], 
                "test-shuffl-loadworkspace-card_3.json",            "new card shuffl:dataref");          
            equals(val['shuffl:datauri'], 
                baseuri+"shuffl/static/test/data/test-shuffl-loadworkspace-card_3.json", 
                                                                    "new card shuffl:datauri");          
            //equals(val['shuffl:datamod'], undefined,                "new card shuffl:datamod");          
            equals(val['shuffl:dataRW'],  false,                    "new card shuffl:dataRW");
            log.debug("Add card to workspace");
            var layout = 
                { 'id': 'card_3'
                , 'class': 'stock_3'
                , 'data': 'test-shuffl-loadworkspace-card_3.json'
                , 'pos': {left:200, top:90}
                };
            shuffl.placeCardFromData(layout, val);
            log.debug("Check card added to workspace");
            var c3 = jQuery("#id_3");
            ok(c3 != undefined, "card id_3 defined");
            ok(c3.hasClass('shuffl-card'), "card 3 shuffl card class");
            equals(c3.find("ctitle").text(), "Card 3 title", "Card 3 title");
            equals(c3.data('shuffl:id'),    "id_3",                     "card 3 data id");
            equals(c3.data('shuffl:type' ), "shuffl-freetext-green",    "card 3 data class/type");
            equals(c3.data('shuffl:dataref'), 
                "test-shuffl-loadworkspace-card_3.json",                "card 3 shuffl:dataref");          
            equals(c3.data('shuffl:datauri'), 
                baseuri+"shuffl/static/test/data/test-shuffl-loadworkspace-card_3.json", 
                                                                        "card 3 shuffl:datauri");          
            equals(c3.data('shuffl:datamod'), false,                    "card 3 shuffl:datamod");          
            equals(c3.data('shuffl:dataRW'),  false,                    "card 3 shuffl:dataRW");          
            log.debug("Reset workspace...");
            var p3 = c3.position();
            range(p3.left, 199, 201, "position-left");
            range(p3.top,   89,  91,  "position-top");
            equals(c3.css("zIndex"), "11", "card zIndex");
            log.debug("Delete old workspace");
            shuffl.deleteWorkspace(layouturi, callback);
        });
        m.eval(function(val,callback) {
            same(val, null, "shuffl.deleteWorkspace return");
            log.debug("Save new workspace with card");
            shuffl.saveNewWorkspace(coluri, layoutname, callback);
        });        
        m.eval(function(val,callback) {
            //log.debug("Check result from save: "+shuffl.objectString(val));
            log.debug("Check result from save: "+val.uri);
            equals(val.wscoluri, layoutcol,  "val.wscoluri");
            equals(val.wsuri,    layouturi,  "val.wsuri");
            equals(val.wsref,    layoutref,  "val.wsref");
            equals(val.wsid,     layoutname, "val.wsid");
            this.wsuri = val.wsuri;
            log.debug("Reset workspace...");
            shuffl.resetWorkspace(callback);
        });
        m.eval(function(val,callback) {
            ok(true, "Workspace is reset: "+this.wsuri);
            log.debug("Workspace is reset");
            log.debug("Reload empty workspace from AtomPub...");
            shuffl.loadWorkspace(this.wsuri, callback);
        });
        m.eval(function(val,callback) {
            ok(true, "Workspace is reloaded: "+this.wsuri);
            log.debug("Check reloaded workspace "+this.wsuri);
            var u = jQuery.uri(this.wsuri);
            equals(jQuery('#workspace_status').text(), u.toString(), '#workspace_status');
            equals(jQuery('#workspace').data('location'), u.toString(), "location");
            equals(jQuery('#workspace').data('wsname'), layoutref, "wsname");
            equals(jQuery('#workspace').data('wsdata')['shuffl:base-uri'], "#", "shuffl:base-uri");
            // More tests as needed
            var stockcolour=["yellow","blue","green","orange","pink","purple"];
            var stocklabel=["Ye","Bl","Gr","Or","Pi","Pu"];
            for (var i = 0; i<6; i++) {
                var s = jQuery('.shuffl-stockpile').eq(i);
                equals(s.attr('id'), "", "["+i+"] stock id ");  // No ID on stockpiles
                ok(s.hasClass('stock-'+stockcolour[i]), "["+i+"] stock-"+stockcolour[i]);
                equals(s.text(), stocklabel[i], "["+i+"] stock text "+stocklabel[i]);
                equals(s.data('CardType'), "shuffl-freetext-"+stockcolour[i], "["+i+"] stock CardType "+"shuffl-freetext-"+stockcolour[i]);
                ok(typeof s.data('makeCard') == "function", "["+i+"] stock makeCard");
            };
            // Check card in workspace
            equals(jQuery("#layout").children().length, 1, "one card in workspace");
            var c3 = jQuery("#id_3");
            ok(c3 != undefined, "card id_3 defined")
            ok(c3.hasClass('shuffl-card'), "card 3 shuffl card class");
            equals(c3.find("ctitle").text(), "Card 3 title", "Card 3 title");
            equals(c3.data('shuffl:id'),    "id_3",                     "card 3 data id");
            equals(c3.data('shuffl:type' ), "shuffl-freetext-green",    "card 3 data class/type");
            equals(c3.data('shuffl:dataref'), 
                "test-shuffl-loadworkspace-card_3.json",                "card 3 shuffl:dataref");          
            equals(c3.data('shuffl:datauri'), 
                layoutcol+"test-shuffl-loadworkspace-card_3.json",      "card 3 shuffl:datauri");          
            equals(c3.data('shuffl:datamod'), false,                    "card 3 shuffl:datamod");          
            equals(c3.data('shuffl:dataRW'),  false,                    "card 3 shuffl:dataRW");          
            var p3 = c3.position();
            range(p3.left, 199, 202, "position-left");
            range(p3.top,   89,  92,  "position-top");
            equals(c3.css("zIndex"), "11", "card zIndex");
            // Done
            callback(true);
        });
        m.exec({}, start);
        ok(true, "shuffl.SaveNewWorkspace (with card) initiated");
        stop(3000);
    });

    // Update card in atom feed, re-read workspace, check content
    test("shuffl.updateCard", function ()
    {
        logtest("shuffl.updateCard");
        expect(51);
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            log.debug("Load workspace");
            // Read workspace from AtomPub service
            shuffl.loadWorkspace(layouturi, callback);
        });
        m.eval(function(val,callback) {
            // Check for card
            equals(jQuery("#layout").children().length, 1, "one card in workspace");
            var c3 = jQuery("#id_3");
            ok(c3 != undefined, "card id_3 defined")
            ok(c3.hasClass('shuffl-card'), "card 3 shuffl card class");
            equals(c3.find("ctitle").text(), "Card 3 title", "Card 3 title");
            // Update card in workspace
            c3.model("shuffl:title", "Card 3 updated");
            equals(c3.model('shuffl:dataref'), "test-shuffl-loadworkspace-card_3.json", "card 3 shuffl:dataref");          
            equals(c3.find("ctitle").text(), "Card 3 updated", "ctitle(c3) updated in DOM");
            var session = shuffl.makeStorageSession(layoutcol);
            shuffl.updateCard(session, "", c3, callback);
        });
        m.eval(function(val, callback) {
            log.debug("Card saved: "+shuffl.objectString(val));
            equals(val.carduri, card3uri, "updateCard URI returned");
            equals(val.cardref, card3ref, "updateCard ref returned");
            equals(val.cardid,  "id_3",   "updateCard id returned");
            log.debug("Reset workspace...");
            shuffl.resetWorkspace(callback);
        });
        m.eval(function(val,callback) {
            log.debug("Workspace is reset");
            log.debug("Reload empty workspace from AtomPub...");
            shuffl.loadWorkspace(layouturi, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Check reloaded workspace ");
            equals(jQuery('#workspace_status').text(), layouturi.toString(), '#workspace_status');
            equals(jQuery('#workspace').data('location'), layouturi.toString(), "location");
            equals(jQuery('#workspace').data('wsname'), layoutref, "wsname");
            equals(jQuery('#workspace').data('wsdata')['shuffl:base-uri'], "#", "shuffl:base-uri");
            // More tests as needed
            var stockcolour=["yellow","blue","green","orange","pink","purple"];
            var stocklabel=["Ye","Bl","Gr","Or","Pi","Pu"];
            for (var i = 0; i<6; i++) {
                var s = jQuery('.shuffl-stockpile').eq(i);
                equals(s.attr('id'), "", "["+i+"] stock id ");  // No ID on stockpiles
                ok(s.hasClass('stock-'+stockcolour[i]), "["+i+"] stock-"+stockcolour[i]);
                equals(s.text(), stocklabel[i], "["+i+"] stock text "+stocklabel[i]);
                equals(s.data('CardType'), "shuffl-freetext-"+stockcolour[i], "["+i+"] stock CardType "+"shuffl-freetext-"+stockcolour[i]);
                ok(typeof s.data('makeCard') == "function", "["+i+"] stock makeCard");
            };
            // Check card in workspace
            equals(jQuery("#layout").children().length, 1, "one card in workspace");
            var c3 = jQuery("#id_3");
            ok(c3 != undefined, "card id_3 defined")
            ok(c3.hasClass('shuffl-card'), "card 3 shuffl card class");
            equals(c3.find("ctitle").text(), "Card 3 updated", "Card 3 updated");
            var p3 = c3.position();
            range(p3.left, 199, 202, "position-left");
            range(p3.top,   89,  92,  "position-top");
            equals(c3.css("zIndex"), "11", "card zIndex");
            // Done
            callback(true);
        });        
        m.exec({}, start);
        ok(true, "shuffl.updateCard");
        stop(3000);
    });

    // Update and move card in workspace, save workspace, read back, check content
    test("shuffl.saveWorkspace (updated moved card)", function ()
    {
        logtest("shuffl.saveWorkspace (updated moved card)");
        expect(51);
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            log.debug("Load workspace");
            // Read workspace from AtomPub service
            shuffl.loadWorkspace(layouturi, callback);
        });
        m.eval(function(val,callback) {
            // Check for card
            equals(jQuery("#layout").children().length, 1, "one card in workspace");
            var c3 = jQuery("#id_3");
            ok(c3 != undefined, "card id_3 defined")
            ok(c3.hasClass('shuffl-card'), "card 3 shuffl card class");
            equals(c3.find("ctitle").text(), "Card 3 updated", "Card 3 title");
            // Update and move card in workspace
            c3.model("shuffl:title", "Card 3 updated and moved");
            equals(c3.find("ctitle").text(), "Card 3 updated and moved", "ctitle(c3) updated in DOM");
            c3.css({left:20, top:10});
            c3.data('shuffl:datamod', true);    // Note card has been updated
            // Save workspace
            log.debug("Save workspace with updated and moved card");
            shuffl.updateWorkspace(callback);
        });
        m.eval(function(val, callback) {
            log.debug("Check result from update: "+shuffl.objectString(val));
            this.wsuri = jQuery.uri(val.uri, val.itemuri).toString();
            equals(val.wscoluri, layoutcol,  "val.wscoluri");
            equals(val.wsuri,    layouturi,  "val.wsuri");
            equals(val.wsref,    layoutref,  "val.wsref");
            equals(val.wsid,     layoutname, "val.wsid");
            log.debug("Reset workspace...");
            shuffl.resetWorkspace(callback);
        });
        m.eval(function(val,callback) {
            log.debug("Workspace is reset");
            log.debug("Reload empty workspace from AtomPub...");
            shuffl.loadWorkspace(layouturi, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Check reloaded workspace ");
            equals(jQuery('#workspace_status').text(), layouturi.toString(), '#workspace_status');
            equals(jQuery('#workspace').data('location'), layouturi.toString(), "location");
            equals(jQuery('#workspace').data('wsname'), layoutref, "wsname");
            equals(jQuery('#workspace').data('wsdata')['shuffl:base-uri'], "#", "shuffl:base-uri");
            // More tests as needed
            var stockcolour=["yellow","blue","green","orange","pink","purple"];
            var stocklabel=["Ye","Bl","Gr","Or","Pi","Pu"];
            for (var i = 0; i<6; i++) {
                var s = jQuery('.shuffl-stockpile').eq(i);
                equals(s.attr('id'), "", "["+i+"] stock id ");  // No ID on stockpiles
                ok(s.hasClass('stock-'+stockcolour[i]), "["+i+"] stock-"+stockcolour[i]);
                equals(s.text(), stocklabel[i], "["+i+"] stock text "+stocklabel[i]);
                equals(s.data('CardType'), "shuffl-freetext-"+stockcolour[i], "["+i+"] stock CardType "+"shuffl-freetext-"+stockcolour[i]);
                ok(typeof s.data('makeCard') == "function", "["+i+"] stock makeCard");
            };
            // Check card in workspace
            equals(jQuery("#layout").children().length, 1, "one card in workspace");
            var c3 = jQuery("#id_3");
            ok(c3 != undefined, "card id_3 defined")
            ok(c3.hasClass('shuffl-card'), "card 3 shuffl card class");
            equals(c3.find("ctitle").text(), "Card 3 updated and moved", "Card 3 title");
            var p3 = c3.position();
            range(p3.left, 19, 22, "position-left");
            range(p3.top,   9, 12,  "position-top");
            equals(c3.css("zIndex"), "11", "card zIndex");
            // Done
            callback(true);
        });        
        m.exec({}, start);
        ok(true, "shuffl.SaveNewWorkspace (updated moved card) initiated");
        stop(3000);
    });
    
    // TODO: create workspace with mix of absolute and relative card references
    //       save workspace as new
    //       reload workspace
    //       check card URIs

    test("shuffl.saveCard (non-existent feed)", function ()
    {
        logtest("shuffl.saveCard (non-existent feed)");
        expect(3);
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            log.debug("Load empty workspace");
            shuffl.loadWorkspace(layouturi, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Get new card data");
            var session = shuffl.makeStorageSession(".");
            shuffl.readCard(session, "", "data/test-shuffl-loadworkspace-card_1.json", callback)
        });
        m.eval(function(val,callback) {
            log.debug("Check new card data");
            equals(val['shuffl:id'], 'id_1', "shuffl:id");
            log.debug("Attempt to aave card data");
            var card = shuffl.createCardFromData(val['shuffl:id'], val['shuffl:type'], val);
            var session = shuffl.makeStorageSession(layoutcol);
            shuffl.saveCard(session, nocoluri, val['shuffl:id']+".json", card, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Check shuffl.saveCard response");
            ok(val instanceof shuffl.Error, "Error value returned");
            callback(true);
        });
    m.exec({}, start);
        ok(true, "shuffl.saveCard (non-existent feed) initiated");
        stop(3000);
    });

    test("shuffl.saveNewWorkspace (forced error)", function ()
    {
        logtest("shuffl.saveNewWorkspace (forced error)");
        expect(5);
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            log.debug("Load empty workspace");
            shuffl.loadWorkspace(layoutloc, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Check workspace loaded");
            equals(jQuery('#workspace').data('location'), initialuri.toString(), "location");
            log.debug("Try to save workspace");
            shuffl.saveNewWorkspace(baduri, layoutname, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Check shuffl.saveNewWorkspace response ");
            ok(val instanceof shuffl.Error, "Error value returned");
            equals(val.toString(), 
                "shuffl error: shuffl.saveNewWorkspace: "+
                "invalid collection URI: "+baduri,
                "Error message returned");
            equals(val.response, undefined,
                "AtomPub HTTP response details");
            callback(true);
        });
        m.exec({}, start);
        ok(true, "shuffl.SaveNewWorkspace (forced error) initiated");
        stop(3000);
    });
    
};

// End
