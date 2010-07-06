/**
 * @fileoverview
 *  Test suite for shuffl-storage-common
 *  
 * @author Graham Klyne
 * @version $Id$
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
 * Test data values
 */

/**
 * Constructor for a dummy storage handler "class" derived from the 
 * common handler.
 */
TestStorageCommon_DummyStorage = function (baseuri, rooturi, hname)
{
    // Invoke common initializer
    TestStorageCommon_DummyStorage.prototype.constructor.call(this, baseuri, rooturi, hname);
};

TestStorageCommon_DummyStorage.prototype      = new shuffl.StorageCommon(null, null, null);
TestStorageCommon_DummyStorage.prototype.name = "TestStorageCommon_DummyStorage";    

TestStorageCommon_DummyStorage.prototype.capInfo =
    { canList:    false
    , canRead:    true
    , canWrite:   false
    , canDelete:  false
    } ;

var TestStorageCommon_rooturi = jQuery.uri(".");
var TestStorageCommon_baseuri = jQuery.uri(".");

var TestStorageCommon_test_csv =
    "rowlabel,col1,col2,col3,col4\n"+
    "row1,a1,b1,c1,d1\n"+
    " row2 , a2 , b2 , c2 , d2 \n"+ 
    " row3 , a3 3a , b3 3b , c3 3c , d3 3d \n"+
    " ' row4 ' , ' a4 ' , ' b4 ' , ' c4 ' , ' d4 ' \n"+ 
    ' " row5 " , " a5 " , " b5 " , " c5 " , " d5 " \n'+
    " 'row6' , 'a6,6a' , 'b6,6b' , 'c6,6c' , 'd6,6d' \n"+
    " 'row7' , 'a7''7a' , 'b7''7b' , 'c7''7c' , 'd7''7d' \n"+
    " 'row8' , 'a8'', 8a' , 'b8'', 8b' , 'c8'', 8c' , 'd8'', 8d' \n"+
    "End.";

var TestStorageCommon_test_json =
    { 'shuffl:id':        'test-shuffl-loadworkspace'
    , 'shuffl:class':     'shuffl:Workspace'
    , 'shuffl:version':   '0.1'
    , 'shuffl:base-uri':  '#'
    , 'shuffl:uses-prefixes':
      [ { 'shuffl:prefix':  'shuffl',  'shuffl:uri': 'http://purl.org/NET/Shuffl/vocab#' }
      , { 'shuffl:prefix':  'rdf',     'shuffl:uri': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' }
      , { 'shuffl:prefix':  'rdfs',    'shuffl:uri': 'http://www.w3.org/2000/01/rdf-schema#' }
      , { 'shuffl:prefix':  'owl',     'shuffl:uri': 'http://www.w3.org/2002/07/owl#' }
      , { 'shuffl:prefix':  'xsd',     'shuffl:uri': 'http://www.w3.org/2001/XMLSchema#' }
      ]
    , 'shuffl:workspace':
      { 'shuffl:stockbar':
          [ { 'id': 'stockpile_1', 'class': 'stock-yellow',  'label': 'Ye', 'type': 'shuffl-freetext-yellow'  }
          , { 'id': 'stockpile_2', 'class': 'stock-blue',    'label': 'Bl', 'type': 'shuffl-freetext-blue'    }
          , { 'id': 'stockpile_3', 'class': 'stock-green',   'label': 'Gr', 'type': 'shuffl-freetext-green'   }
          , { 'id': 'stockpile_4', 'class': 'stock-orange',  'label': 'Or', 'type': 'shuffl-freetext-orange'  }
          , { 'id': 'stockpile_5', 'class': 'stock-pink',    'label': 'Pi', 'type': 'shuffl-freetext-pink'    }
          , { 'id': 'stockpile_6', 'class': 'stock-purple',  'label': 'Pu', 'type': 'shuffl-freetext-purple'  }
          ]
      , 'shuffl:layout':
          [ { 'id': 'card_1', 'class': 'stock_1', 'data': 'test-shuffl-loadworkspace-card_1.json', 'pos': {left:100, top:30} }
          , { 'id': 'card_2', 'class': 'stock_2', 'data': 'test-shuffl-loadworkspace-card_2.json', 'pos': {left:150, top:60} }
          , { 'id': 'card_3', 'class': 'stock_3', 'data': 'test-shuffl-loadworkspace-card_3.json', 'pos': {left:200, top:90} }
          ]
      }
    };

/**
 * Function to register tests
 */
TestStorageCommon = function()
{

    module("TestStorageCommon");

    test("TestStorageCommon", function ()
    {
        logtest("TestStorageCommon");
        shuffl.resetStorageHandlers();
        ok(true, "TestStorageCommon running OK");
    });

    test("Storage handler registry", function ()
    {
        logtest("Storage handler registry");
        expect(3);
        // Instatiate dummy handler for two URIs
        shuffl.addStorageHandler(
            { uri:      "file://dummy1/"
            , name:     "Dummy1"
            , factory:  TestStorageCommon_DummyStorage
            });
        shuffl.addStorageHandler(
            { uri:      "file://dummy2/"
            , name:     "Dummy2"
            , factory:  TestStorageCommon_DummyStorage
            });
        // List registered storage handlers
        var shlist = shuffl.listStorageHandlers()
        equals(shlist.length, 2, "Storage handler list length");
        var h1 =
            { uri:        "file://dummy1/"
            , name:       "Dummy1"
            , canList:    false
            , canRead:    true
            , canWrite:   false
            , canDelete:  false
            };
        same(shlist[0], h1, "First handler added");
        var h2 =
            { uri:        "file://dummy2/"
            , name:       "Dummy2"
            , canList:    false
            , canRead:    true
            , canWrite:   false
            , canDelete:  false
            };
        same(shlist[1], h2, "Second handler added");
    });

    test("Storage handler factory", function ()
    {
        logtest("Storage handler factory");
        expect(6);
        // Instatiate dummy handler for two URIs
        shuffl.addStorageHandler(
            { uri:      "file://dummy1/"
            , name:     "Dummy1"
            , factory:  TestStorageCommon_DummyStorage
            });
        shuffl.addStorageHandler(
            { uri:      "file://dummy2/"
            , name:     "Dummy2"
            , factory:  TestStorageCommon_DummyStorage
            });
        // Instantiate session for first handler
        var s1 = shuffl.makeStorageSession("file://dummy1/foo/bar");
        equals(s1.getHandlerName(), "Dummy1", "s1.handlerName()");
        equals(s1.getRootUri(), "file://dummy1/", "s1.getRootUri()");
        equals(s1.getBaseUri(), "file://dummy1/foo/bar", "s1.getBaseUri()");
        // Instantiate session for second handler
        var s2 = shuffl.makeStorageSession("file://dummy2/foo/bar");
        equals(s2.getHandlerName(), "Dummy2", "s2.handlerName()");
        equals(s2.getRootUri(), "file://dummy2/", "s2.getRootUri()");
        equals(s2.getBaseUri(), "file://dummy2/foo/bar", "s2.getBaseUri()");
    });

    function createTestSession()
    {
        // Instatiate dummy handlers
        shuffl.addStorageHandler(
            { uri:      "file://test/"
            , name:     "Test"
            , factory:  TestStorageCommon_DummyStorage
            });
        shuffl.addStorageHandler(
            { uri:      TestStorageCommon_rooturi
            , name:     "getData"
            , factory:  TestStorageCommon_DummyStorage
            });
        // Instantiate session for first handler
        return shuffl.makeStorageSession("file://test/base/path?query");
    }

    test("shuffl.StorageCommon.resolve", function ()
    {
        logtest("shuffl.StorageCommon.resolve");
        expect(20);
        var ss = createTestSession();
        equals(ss.resolve("file://notest/a/b").uri, null, "Unresolved URI");
        equals(ss.resolve("file://test/a/b").uri, "file://test/a/b", "Match absolute URI");
        equals(ss.resolve("/a/b").uri, "file://test/a/b", "Match URI reference");
        equals(ss.resolve("a/b").uri, "file://test/base/a/b", "Match relative URI reference");
        equals(ss.resolve("?q").uri, "file://test/base/path?q", "Match query URI reference");
        equals(ss.resolve("#f").uri, "file://test/base/path?query#f", "Match fragment URI reference");
        equals(ss.resolve("file://test/a/b").relref, "/a/b", "ss.resolve(a/b).relref");
        equals(ss.resolve("file://test/x/y").relref, "/x/y", "ss.resolve(x/y).relref");
        var s1 = shuffl.makeStorageSession("file://test/");
        equals(s1.resolve("file://test/a/b").relref, "/a/b", "s1.resolve(a/b).relref");
        equals(s1.resolve("file://test/x/y").relref, "/x/y", "s1.resolve(x/y).relref");
        var s2 = shuffl.makeStorageSession("file://test/a/");
        equals(s2.resolve("file://test/a/b").relref, "b",    "s2.resolve(a/b).relref");
        equals(s2.resolve("file://test/x/y").relref, "/x/y", "s2.resolve(x/y).relref");
        var s3 = shuffl.makeStorageSession("file://test/a/b");
        equals(s3.resolve("file://test/a/b").relref, "",      "s3.resolve(a/b).relref");
        equals(s3.resolve("file://test/a/c").relref, "c",      "s3.resolve(a/c).relref");
        equals(s3.resolve("file://test/x/y").relref, "/x/y", "s3.resolve(x/y).relref");
        var s4 = shuffl.makeStorageSession("file://test/p/q/a/");
        equals(s4.resolve("file://test/p/q/a/b").relref, "b",      "s4.resolve(p/q/a/b).relref");
        equals(s4.resolve("file://test/p/q/x/y").relref, "../x/y", "s4.resolve(p/q/x/y).relref");
        var s5 = shuffl.makeStorageSession("file://test/p/q/a/b");
        equals(s5.resolve("file://test/p/q/a/b").relref, "",       "s5.resolve(p/q/a/b).relref");
        equals(s5.resolve("file://test/p/q/a/c").relref, "c",      "s5.resolve(p/q/a/c).relref");
        equals(s5.resolve("file://test/p/q/x/y").relref, "../x/y", "s5.resolve(p/q/x/y).relref");
    });

    test("shuffl.StorageCommon.handlerInfo", function ()
    {
        logtest("shuffl.StorageCommon.handlerInfo");
        expect(4);
        var ss = createTestSession();
        var hi = ss.handlerInfo();
        equals(hi.canList,   false, "hi.canList");
        equals(hi.canRead,   true,  "hi.canRead");
        equals(hi.canWrite,  false, "hi.canWrite");
        equals(hi.canDelete, false, "hi.canDelete");
        log.debug("----- test shuffl.StorageCommon.handlerInfo end -----");
    });

    test("shuffl.StorageCommon.info", function ()
    {
        logtest("shuffl.StorageCommon.info");
        var ss = createTestSession();
        try
        {
            ss.info("a/b", shuffl.noop);
            ok(false, "shuffl.StorageCommon.info exception expected");
        }
        catch (e)
        {
            log.debug("shuffl.StorageCommon.info exception: "+e.toString());
            ok(true, "shuffl.StorageCommon.info exception expected");
            ok(e.toString().match(/not implemented/), "Not implemented");
        }
    });

    test("shuffl.StorageCommon.createCollection", function ()
    {
        logtest("shuffl.StorageCommon.createCollection");
        var ss = createTestSession();
        try
        {
            ss.createCollection("a/b/", "c", shuffl.noop);
            ok(false, "shuffl.StorageCommon.createCollection exception expected");
        }
        catch (e)
        {
            log.debug("shuffl.StorageCommon.createCollection exception: "+e);
            ok(true, "shuffl.StorageCommon.createCollection exception expected");
            ok(e.toString().match(/not implemented/), "Not implemented");
        }
    });

    test("shuffl.StorageCommon.listCollection", function ()
    {
        logtest("shuffl.StorageCommon.listCollection");
        var ss = createTestSession();
        try
        {
            ss.listCollection("a/b/", shuffl.noop);
            ok(false, "shuffl.StorageCommon.listCollection exception expected");
        }
        catch (e)
        {
            log.debug("shuffl.StorageCommon.listCollection exception: "+e);
            ok(true, "shuffl.StorageCommon.listCollection exception expected");
            ok(e.toString().match(/not implemented/), "Not implemented");
        }
    });

    test("shuffl.StorageCommon.removeCollection", function ()
    {
        logtest("shuffl.StorageCommon.removeCollection");
        var ss = createTestSession();
        try
        {
            ss.removeCollection("a/b/", shuffl.noop);
            ok(false, "shuffl.StorageCommon.removeCollection exception expected");
        }
        catch (e)
        {
            log.debug("shuffl.StorageCommon.removeCollection exception: "+e);
            ok(true, "shuffl.StorageCommon.removeCollection exception expected");
            ok(e.toString().match(/not implemented/), "Not implemented");
        }
    });

    test("shuffl.StorageCommon.create", function ()
    {
        logtest("shuffl.StorageCommon.create");
        var ss = createTestSession();
        try
        {
            ss.create("a/b/", "c", "data for new item", shuffl.noop);
            ok(false, "shuffl.StorageCommon.create exception expected");
        }
        catch (e)
        {
            log.debug("shuffl.StorageCommon.create exception: "+e);
            ok(true, "shuffl.StorageCommon.create exception expected");
            ok(e.toString().match(/not implemented/), "Not implemented");
        }
    });


    test("shuffl.StorageCommon.get", function ()
    {
        logtest("shuffl.StorageCommon.get");
        var ss = createTestSession();
        try
        {
            ss.get("a/b/", shuffl.noop);
            ok(false, "shuffl.StorageCommon.get exception expected");
        }
        catch (e)
        {
            log.debug("shuffl.StorageCommon.get exception: "+e);
            ok(true, "shuffl.StorageCommon.get exception expected");
            ok(e.toString().match(/not implemented/), "Not implemented");
        }
    });

    test("shuffl.StorageCommon.put", function ()
    {
        logtest("shuffl.StorageCommon.put");
        var ss = createTestSession();
        try
        {
            ss.put("a/b/", "data for replaced item", shuffl.noop);
            ok(false, "shuffl.StorageCommon.put exception expected");
        }
        catch (e)
        {
            log.debug("shuffl.StorageCommon.put exception: "+e);
            ok(true, "shuffl.StorageCommon.put exception expected");
            ok(e.toString().match(/not implemented/), "Not implemented");
        }
    });

    test("shuffl.StorageCommon.remove", function ()
    {
        logtest("shuffl.StorageCommon.remove");
        var ss = createTestSession();
        try
        {
            ss.remove("a/b/", shuffl.noop);
            ok(false, "shuffl.StorageCommon.remove exception expected");
        }
        catch (e)
        {
            log.debug("shuffl.StorageCommon.remove exception: "+e);
            ok(true, "shuffl.StorageCommon.remove exception expected");
            ok(e.toString().match(/not implemented/), "Not implemented");
        }
    });

    test("shuffl.StorageCommon.getData(text)", function ()
    {
        logtest("shuffl.StorageCommon.getData(text)");
        expect(6);
        log.debug("----- test shuffl.StorageCommon.getData(text) start -----");
        var m = new shuffl.AsyncComputation();
        createTestSession();
        log.debug("- rootUri "+TestStorageCommon_rooturi.toString())
        log.debug("- baseUri "+TestStorageCommon_baseuri.toString())
        var ss = shuffl.makeStorageSession(TestStorageCommon_baseuri);
        m.eval(
            function (val, callback) {
                try
                {
                    ss.getData("data/test-csv.csv", "text", function (val) {
                        ok(true, "shuffl.StorageCommon.getData(text) no exception");
                        callback(val);
                    });
                }
                catch (e)
                {
                    log.debug("shuffl.StorageCommon.getData(text) exception: "+e);
                    ok(false, "shuffl.StorageCommon.getData(text) exception: "+e);
                    callback(e);
                }
            });
        m.eval(
            function (val, callback) {
                var b = TestStorageCommon_baseuri;
                equals(val.uri,    b.resolve("data/test-csv.csv").toString(), "val.uri");
                equals(val.relref, "data/test-csv.csv", "val.relref");
                equals(typeof val.data, typeof TestStorageCommon_test_csv, "typeof val.data");
                equals(val.data,        TestStorageCommon_test_csv,        "val.data");
                equals(jQuery.toJSON(val.data), jQuery.toJSON(TestStorageCommon_test_csv), "val.data");
                callback(val);
            });
        m.exec({},
            function(val) {
                log.debug("----- test shuffl.StorageCommon.get end -----");
                start();
            });
        stop(2000);
    });

    test("shuffl.StorageCommon.getData(json)", function ()
    {
        logtest("shuffl.StorageCommon.getData(json)");
        expect(9);
        log.debug("----- test shuffl.StorageCommon.getData(json) start -----");
        var m = new shuffl.AsyncComputation();
        createTestSession();
        log.debug("- rootUri "+TestStorageCommon_rooturi.toString())
        log.debug("- baseUri "+TestStorageCommon_baseuri.toString())
        var ss = shuffl.makeStorageSession(TestStorageCommon_baseuri);
        m.eval(
            function (val, callback) {
                try
                {
                    ss.getData("data/test-storage-getData.json", "json", function (val) {
                        ok(true, "shuffl.StorageCommon.getData(json) no exception");
                        callback(val);
                    });
                }
                catch (e)
                {
                    log.debug("shuffl.StorageCommon.getData(json) exception: "+e);
                    ok(false, "shuffl.StorageCommon.getData(json) exception: "+e);
                    callback(e);
                }
            });
        m.eval(
            function (val, callback) {
                if (val instanceof shuffl.Error)
                {
                    log.error(val.toString());
                    callback(val);
                    return;
                }
                var b = TestStorageCommon_baseuri;
                equals(val.uri,    b.resolve("data/test-storage-getData.json").toString(), "val.uri");
                equals(val.relref, "data/test-storage-getData.json", "val.relref");
                equals(typeof val.data, typeof TestStorageCommon_test_json, "typeof val.data");
                same(val.data, TestStorageCommon_test_json, "val.data");
                callback(val);
            });
        m.eval(
            function (val, callback) {
                try
                {
                    ss.getData("data/test-csv.csv", "json", function (val) {
                        ok(true, "shuffl.StorageCommon.getData(json) no exception");
                        callback(val);
                    });
                }
                catch (e)
                {
                    log.debug("shuffl.StorageCommon.getData(json) exception: "+e);
                    ok(false, "shuffl.StorageCommon.getData(json) exception: "+e);
                    callback(e);
                }
            });
        m.eval(
            function (val, callback) {
                ok(val instanceof shuffl.Error, "Error value returned");
                equals(val.msg, "Invalid JSON", "val.msg");
                equals(val.status, "parsererror", "val.status");
                callback(true);
            });
        m.exec({},
            function(val) {
                log.debug("----- test shuffl.StorageCommon.getData(json) end -----");
                start();
            });
        stop(2000);
    });

};

// End
