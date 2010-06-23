/**
 * @fileoverview
 *  Test suite for AtomPub-based storage module.
 *  
 * @author Graham Klyne
 * @version $Id: test-shuffl-storage-existatom.js 813 2010-05-24 13:59:04Z gk-google@ninebynine.org $
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

// Figure AtomPub root URI based on page URI
var TestExistAtomStorage_pageUri = jQuery.uri().toString();
var TestExistAtomStorage_atomUri = null;
var TestExistAtomStorage_rootUri = null;
var TestExistAtomStorage_baseUri = null;
var TestExistAtomStorage_atomUri_list =
    [ "http://localhost:8080/exist/"
    , "http://zoo-samos.zoo.ox.ac.uk/exist/"
    , "http://tinos.zoo.ox.ac.uk/exist/"
    ];
for (i in TestExistAtomStorage_atomUri_list)
{
    var a =  TestExistAtomStorage_atomUri_list[i];
    if (shuffl.starts(a, TestExistAtomStorage_pageUri))
    {
        TestExistAtomStorage_atomUri = a+"atom/";
        TestExistAtomStorage_rootUri = a+"atom/edit/";
        TestExistAtomStorage_baseUri = a+"atom/edit/shuffltest/";
    }
}

var TestExistAtomStorage_test_csv =
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

var TestExistAtomStorage_test_csv_put =
    " , col1,col2,col3,col4\n"+
    "row1, a1 , b1 , c1 , d1\n"+
    "row2, a2 , b2 , c2 , d2\n"+ 
    "End.";

/**
 * Function to register tests
 */
TestExistAtomStorage = function()
{

    module("TestExistAtomStorage");

    test("NOTE: TestExistAtomStorage must be loaded from eXist AtomPub server", function ()
    {
        logtest("TestExistAtomStorage origin check");
        if (!TestExistAtomStorage_rootUri)
        {
            ok(false, "TestExistAtomStorage must be loaded from eXist AtomPub server");
            return;
        }
        ok(true, "TestExistAtomStorage running OK");
    });

    test("TestExistAtomStorage", function ()
    {
        logtest("TestExistAtomStorage");
        shuffl.resetStorageHandlers();
        shuffl.addStorageHandler(
            { uri:      TestExistAtomStorage_atomUri
            , name:     "ExistAtom"
            , factory:  shuffl.ExistAtomStorage
            });
        ok(true, "TestExistAtomStorage running OK");
    });

    test("Storage handler factory", function ()
    {
        logtest("Storage handler factory");
        expect(9);
        // Instatiate dummy handler for two URIs
        shuffl.addStorageHandler(
            { uri:      "http://localhost:8081/dummy1/"
            , name:     "Dummy1"
            , factory:  shuffl.ExistAtomStorage
            });
        shuffl.addStorageHandler(
            { uri:      "http://localhost:8081/dummy2/"
            , name:     "Dummy2"
            , factory:  shuffl.ExistAtomStorage
            });
        // Instantiate session for first handler
        var s1 = shuffl.makeStorageSession("http://localhost:8081/dummy1/foo/bar");
        equals(s1.getHandlerName(), "Dummy1", "s1.handlerName()");
        equals(s1.getRootUri(), "http://localhost:8081/dummy1/", "s1.getRootUri()");
        equals(s1.getBaseUri(), "http://localhost:8081/dummy1/foo/bar", "s1.getBaseUri()");
        // Instantiate session for second handler
        var s2 = shuffl.makeStorageSession("http://localhost:8081/dummy2/foo/bar");
        equals(s2.getHandlerName(), "Dummy2", "s2.handlerName()");
        equals(s2.getRootUri(), "http://localhost:8081/dummy2/", "s2.getRootUri()");
        equals(s2.getBaseUri(), "http://localhost:8081/dummy2/foo/bar", "s2.getBaseUri()");
        // Instantiate session for built-in handler
        var s3 = shuffl.makeStorageSession(TestExistAtomStorage_atomUri+"foo/bar");
        equals(s3.getHandlerName(), "ExistAtom", "s3.handlerName()");
        equals(s3.getRootUri(), TestExistAtomStorage_atomUri+"", "s3.getRootUri()");
        equals(s3.getBaseUri(), TestExistAtomStorage_atomUri+"foo/bar", "s3.getBaseUri()");
    });

    test("shuffl.ExistAtomStorage.resolve", function ()
    {
        logtest("shuffl.ExistAtomStorage.resolve");
        expect(25);
        this.rooturi = TestExistAtomStorage_rootUri.toString();
        shuffl.addStorageHandler(
            { uri:      this.rooturi
            , name:     "Test"
            , factory:  shuffl.ExistAtomStorage
            });
        var b  = jQuery.uri(TestExistAtomStorage_baseUri);
        var ss = shuffl.makeStorageSession(b.toString());
        equals(ss.resolve("http://localhost:8080/notest/a/b").uri, null, "Unresolved URI");
        equals(ss.resolve(b+"/a/b").uri, b+"/a/b", "Match absolute URI");
        equals(ss.resolve("a/b").uri, b.toString()+"a/b", "Match relative URI reference");
        equals(ss.resolve("?q").uri, b+"?q", "Match query URI reference");
        equals(ss.resolve("#f").uri, b+"#f", "Match fragment URI reference");
        equals(ss.getBaseUri(), this.rooturi+"shuffltest/", "ss.getBaseUri");
        equals(ss.resolve(this.rooturi+"a/b").relref, "../a/b", "ss.resolve("+this.rooturi+"a/b).relref");
        equals(ss.resolve(this.rooturi+"x/y").relref, "../x/y", "ss.resolve("+this.rooturi+"a/bx/y).relref");
        var s1 = shuffl.makeStorageSession(this.rooturi+"");
        equals(s1.getBaseUri(), this.rooturi+"", "s1.getBaseUri");
        equals(s1.resolve(this.rooturi+"a/b").relref, "a/b", "s1.resolve("+this.rooturi+"a/ba/b).relref");
        equals(s1.resolve(this.rooturi+"x/y").relref, "x/y", "s1.resolve("+this.rooturi+"a/bx/y).relref");
        var s2 = shuffl.makeStorageSession(this.rooturi+"a/");
        equals(s2.getBaseUri(), this.rooturi+"a/", "s2.getBaseUri");
        equals(s2.resolve(this.rooturi+"a/b").relref, "b",    "s2.resolve("+this.rooturi+"a/b).relref");
        equals(s2.resolve(this.rooturi+"x/y").relref, "../x/y", "s2.resolve("+this.rooturi+"x/y).relref");
        var s3 = shuffl.makeStorageSession(this.rooturi+"a/b");
        equals(s3.getBaseUri(), this.rooturi+"a/b", "s3.getBaseUri");
        equals(s3.resolve(this.rooturi+"a/b").relref, "",     "s3.resolve("+this.rooturi+"a/b).relref");
        equals(s3.resolve(this.rooturi+"a/c").relref, "c",    "s3.resolve("+this.rooturi+"a/c).relref");
        equals(s3.resolve(this.rooturi+"x/y").relref, "../x/y", "s3.resolve("+this.rooturi+"x/y).relref");
        var s4 = shuffl.makeStorageSession(this.rooturi+"p/q/a/");
        equals(s4.getBaseUri(), this.rooturi+"p/q/a/", "s4.getBaseUri");
        equals(s4.resolve(this.rooturi+"p/q/a/b").relref, "b",      "s4.resolve("+this.rooturi+"p/q/a/b).relref");
        equals(s4.resolve(this.rooturi+"p/q/x/y").relref, "../x/y", "s4.resolve("+this.rooturi+"p/q/x/y).relref");
        var s5 = shuffl.makeStorageSession(this.rooturi+"p/q/a/b");
        equals(s5.getBaseUri(), this.rooturi+"p/q/a/b", "s5.getBaseUri");
        equals(s5.resolve(this.rooturi+"p/q/a/b").relref, "",       "s5.resolve("+this.rooturi+"p/q/a/b).relref");
        equals(s5.resolve(this.rooturi+"p/q/a/c").relref, "c",      "s5.resolve("+this.rooturi+"p/q/a/c).relref");
        equals(s5.resolve(this.rooturi+"p/q/x/y").relref, "../x/y", "s5.resolve("+this.rooturi+"p/q/x/y).relref");
    });

    function createTestSession()
    {
        // Instatiate dummy handler
        this.rooturi = TestExistAtomStorage_rootUri.toString();
        shuffl.addStorageHandler(
            { uri:      this.rooturi
            , name:     "Test"
            , factory:  shuffl.ExistAtomStorage
            });
        // Instantiate session for first handler
        return shuffl.makeStorageSession(TestExistAtomStorage_baseUri);
    }

    function initializeTestCollections(atomuri, callback)
    {
        var m = new shuffl.AsyncComputation();
        m.eval(
            function (val, callback) {
                this.atompub = new shuffl.AtomPub(val);
                this.atompub.deleteFeed({path:"/shuffltest/data/"}, callback);
            });
        m.eval(
            function (val, callback) {
                ////same(val, {}, "deleteFeed returned result")
                this.atompub.deleteFeed({path:"/shuffltest/"}, callback);
            });
        m.eval(
            function (val, callback) {
                ////same(val, {}, "deleteFeed returned result")
                this.atompub.createFeed(
                    { base:"/", name:"shuffltest/"
                    , title:"Test feed: /shuffltest/"}, 
                    callback);
            });
        m.eval(
            function (val, callback) {
                equals(val.path, "/shuffltest/", "createFeed feed path returned");
                this.atompub.createFeed(
                    { base:"/shuffltest/", name:"data/"
                    , title:"Test feed: /shuffltest/data/"}, 
                    callback);
            });
        m.eval(
            function (val, callback) {
                equals(val.path, "/shuffltest/data/", "createFeed feed path returned");
                this.atompub.createItem(
                    { path:     "/shuffltest/data/"
                    , slug:     "test-csv.csv"
                    , title:    "Test item: /shuffltest/data/test-csv.csv"
                    , datatype: "text/csv"
                    , data:     TestExistAtomStorage_test_csv
                    },
                    callback);
            });
        m.exec(atomuri,
            function (val) {
                equals(val.datapath, "/shuffltest/data/test-csv.csv", 
                    "createItem data URI path returned");
                callback(val);
            });
    };

    test("shuffl.ExistAtomStorage.handlerInfo", function ()
    {
        logtest("shuffl.ExistAtomStorage.handlerInfo");
        expect(4);
        var ss = createTestSession();
        var hi = ss.handlerInfo();
        equals(hi.canList,   false, "hi.canList");
        equals(hi.canRead,   true,  "hi.canRead");
        equals(hi.canWrite,  true,  "hi.canWrite");
        equals(hi.canDelete, true,  "hi.canDelete");
        log.debug("----- test shuffl.ExistAtomStorage.handlerInfo end -----");
    });

    test("shuffl.ExistAtomStorage.info", function ()
    {
        logtest("shuffl.ExistAtomStorage.info");
        expect(23);
        log.debug("----- test shuffl.ExistAtomStorage.info start -----");
        var m  = new shuffl.AsyncComputation();
        var ss = createTestSession();
        m.eval(
            function (val, callback) {
                initializeTestCollections(val, callback)
            });
        m.eval(
            function (val, callback) {
                equals(val.data, undefined,
                    "createItem data returned");
                equals(val.dataref, "test-csv.csv", 
                    "createItem data reference returned");
                equals(val.datatype, "application/octet-stream", // TODO: "text/csv", 
                    "createItem data content-type returned");
                equals(val.datauri, "http://localhost:8080/exist/atom/edit/shuffltest/data/test-csv.csv", 
                    "createItem data URI returned");
                callback({});
            });
        m.eval(
            function (val, callback) {
                try
                {
                    ss.info("data/", callback);
                    ok(true, "shuffl.ExistAtomStorage.info no exception");
                }
                catch (e)
                {
                    log.debug("shuffl.ExistAtomStorage.info exception: "+e);
                    ok(false, "shuffl.ExistAtomStorage.info exception"+e);
                    callback(e);
                };
            });
        m.eval(
            function (val, callback) {
                equals(val.uri, TestExistAtomStorage_baseUri+"data/", "val.uri");
                equals(val.relref,    "data/", "val.relref");
                equals(val.type,      "collection", "val.type");
                equals(val.canList,   false, "val.canList");
                equals(val.canRead,   true,  "val.canRead");
                equals(val.canWrite,  true,  "val.canWrite");
                equals(val.canDelete, true,  "val.canDelete");
                callback(val);
            });
        m.eval(
            function (val, callback) {
                try
                {
                    ss.info("data/test-csv.csv", callback);
                    ok(true, "shuffl.ExistAtomStorage.info no exception");
                }
                catch (e)
                {
                    log.debug("shuffl.ExistAtomStorage.info exception: "+e);
                    ok(false, "shuffl.ExistAtomStorage.info exception"+e);
                    callback(e);
                };
            });
        m.eval(
            function (val, callback) {
                var b = TestExistAtomStorage_baseUri;
                equals(val.uri, TestExistAtomStorage_baseUri+"data/test-csv.csv", "val.uri");
                equals(val.relref,    "data/test-csv.csv", "val.relref");
                equals(val.type,      "item", "val.type");
                equals(val.canList,   false, "val.canList");
                equals(val.canRead,   true,  "val.canRead");
                equals(val.canWrite,  true,  "val.canWrite");
                equals(val.canDelete, true,  "val.canDelete");
                callback(val);
            });
        m.exec(TestExistAtomStorage_atomUri,
            function(val) {
                log.debug("----- test shuffl.ExistAtomStorage.info end -----");
                start();
            });
        stop(2000);
    });

    test("shuffl.ExistAtomStorage.info (non-existent resource)", function ()
    {
        logtest("shuffl.ExistAtomStorage.info");
        expect(5);
        log.debug("----- test shuffl.ExistAtomStorage.info (non-existent resource) start -----");
        var m = new shuffl.AsyncComputation();
        var ss = createTestSession();
        m.eval(
            function (val, callback) {
                initializeTestCollections(val, callback)
            });
        m.eval(
            function (val, callback) {
                try
                {
                    ss.info("data/test-csv.nodata", function (val) {
                        ok(true, "shuffl.ExistAtomStorage.info no exception");
                        callback(val);
                    });
                }
                catch (e)
                {
                    log.debug("shuffl.ExistAtomStorage.info exception: "+e);
                    ok(false, "shuffl.ExistAtomStorage.info exception"+e);
                    callback(e);
                }
            });
        m.exec(TestExistAtomStorage_atomUri,
            function(val) {
                equals(val.msg, "Request failed", "val.msg");
                log.debug("----- test shuffl.ExistAtomStorage.info (non-existent resource) end -----");
                start();
            });
        stop(2000);
    });

    test("shuffl.ExistAtomStorage.createCollection", function ()
    {
        logtest("shuffl.ExistAtomStorage.createCollection");
        expect(13);
        log.debug("----- test shuffl.ExistAtomStorage.createCollection start -----");
        var m = new shuffl.AsyncComputation();
        var ss = createTestSession();
        m.eval(
            function (val, callback) {
                initializeTestCollections(val, callback)
            });
        m.eval(
            function (val, callback) {
                try
                {
                    ss.createCollection(TestExistAtomStorage_baseUri, "test", function (val) {
                        ok(true, "shuffl.ExistAtomStorage.createCollection no exception");
                        callback(val);
                    });
                }
                catch (e)
                {
                    log.debug("shuffl.ExistAtomStorage.createCollection exception: "+e);
                    ok(false, "shuffl.ExistAtomStorage.createCollection exception"+e);
                    callback(e);
                }
            });
        m.eval(
            function (val, callback) {
                // Check return values
                equals(val.uri, TestExistAtomStorage_baseUri+"test/", "val.uri");
                equals(val.relref, "test/", "val.relref");
                // Get info
                ss.info(val.uri, callback);
            });
        m.eval(
            function (val, callback) {
                // Check info return values
                equals(val.uri, TestExistAtomStorage_baseUri+"test/", "val.uri");
                equals(val.relref,    "test/", "val.relref");
                equals(val.type,      "collection", "val.type");
                equals(val.canList,   false, "val.canList");
                equals(val.canRead,   true,  "val.canRead");
                equals(val.canWrite,  true,  "val.canWrite");
                equals(val.canDelete, true,  "val.canDelete");
                callback(val);
            });
        m.exec(TestExistAtomStorage_atomUri,
            function(val) {
                log.debug("----- test shuffl.ExistAtomStorage.createCollection end -----");
                start();
            });
        stop(2000);
    });

    test("shuffl.ExistAtomStorage.listCollection", function ()
    {
        logtest("shuffl.ExistAtomStorage.listCollection");
        expect(2);
        log.debug("----- test shuffl.ExistAtomStorage.listCollection start -----");
        var ss = createTestSession();
        try
        {
            ss.listCollection("a/b/", shuffl.noop);
            ok(false, "shuffl.ExistAtomStorage.listCollection exception expected");
        }
        catch (e)
        {
            log.debug("shuffl.ExistAtomStorage.listCollection exception: "+e);
            ok(true, "shuffl.ExistAtomStorage.listCollection exception expected");
            ok(e.toString().match(/not implemented/), "Not implemented");
        }
    });

    test("shuffl.ExistAtomStorage.removeCollection", function ()
    {
        logtest("shuffl.ExistAtomStorage.removeCollection");
        expect(9);
        log.debug("----- test shuffl.ExistAtomStorage.removeCollection start -----");
        var m = new shuffl.AsyncComputation();
        var ss = createTestSession();
        m.eval(
            function (val, callback) {
                initializeTestCollections(val, callback)
            });
        m.eval(
            function (val, callback) {
                try
                {
                    ss.createCollection(TestExistAtomStorage_baseUri, "test", function (val) {
                        ok(true, "shuffl.ExistAtomStorage.createCollection no exception");
                        callback(val);
                    });
                }
                catch (e)
                {
                    log.debug("shuffl.ExistAtomStorage.createCollection exception: "+e);
                    ok(false, "shuffl.ExistAtomStorage.createCollection exception"+e);
                    callback(e);
                }
            });
        m.eval(
            function (val, callback) {
                // Check return values
                equals(val.uri, TestExistAtomStorage_baseUri+"test/", "val.uri");
                equals(val.relref, "test/", "val.relref");
                callback(val);
            });
        m.eval(
            function (val, callback) {
                try
                {
                    ss.removeCollection(TestExistAtomStorage_baseUri+"test/", function (val) {
                        ok(true, "shuffl.ExistAtomStorage.removeCollection no exception");
                        callback(val);
                    });
                }
                catch (e)
                {
                    log.debug("shuffl.ExistAtomStorage.removeCollection exception: "+e);
                    ok(false, "shuffl.ExistAtomStorage.removeCollection exception"+e);
                    callback(e);
                }
            });
        m.eval(
            function (val, callback) {
                // Check return values
                equals(val, null, "val");
                // Get info
                ss.info(TestExistAtomStorage_baseUri+"test/", callback);
            });
        m.eval(
            function (val, callback) {
                // Check info return values
                equals(val.uri,       null, "val.uri");
                callback(val);
            });
        m.exec(TestExistAtomStorage_atomUri,
            function(val) {
                log.debug("----- test shuffl.ExistAtomStorage.removeCollection end -----");
                start();
            });
        stop(2000);
    });

    test("shuffl.ExistAtomStorage.create", function ()
    {
        logtest("shuffl.ExistAtomStorage.create");
        expect(18);
        log.debug("----- test shuffl.ExistAtomStorage.create start -----");
        var m  = new shuffl.AsyncComputation();
        var ss = createTestSession();
        var coluri = TestExistAtomStorage_baseUri+"data/";
        m.eval(
            function (val, callback) {
                initializeTestCollections(val, callback)
            });
        m.eval(
            function (val, callback) {
                try
                {
                    ss.create(coluri, "test-csv.csv", 
                        TestExistAtomStorage_test_csv, 
                        function (val)
                        {
                            ok(true, "shuffl.ExistAtomStorage.create no exception");
                            callback(val);
                        });
                }
                catch (e)
                {
                    log.debug("shuffl.ExistAtomStorage.create exception: "+e);
                    ok(false, "shuffl.ExistAtomStorage.create exception"+e);
                    callback(e);
                }
            });
        m.eval(
            function (val, callback) {
                // Check return values
                ok(val instanceof shuffl.Error, "Error returned for existing resource");
                equals(val.msg, "AtomPub request failed", "val.msg");
                equals(val.HTTPstatus, 400, "val.HTTPstatus");
                equals(val.HTTPstatusText, 
                    "Resource+test%2Dcsv%2Ecsv+already+exists+in+collection+%2Fshuffltest%2Fdata", 
                    "val.HTTPstatusText");
                // Try again to create resource
                try
                {
                    ss.create(coluri, "test1-csv.csv", 
                        TestExistAtomStorage_test_csv, 
                        function (val)
                        {
                            ok(true, "shuffl.ExistAtomStorage.create no exception");
                            callback(val);
                        });
                }
                catch (e)
                {
                    log.debug("shuffl.ExistAtomStorage.create exception: "+e);
                    ok(false, "shuffl.ExistAtomStorage.create exception"+e);
                    callback(e);
                }
            });
        m.eval(
            function (val, callback) {
                // Check return values
                equals(val.uri, coluri+"test1-csv.csv", "val.uri");
                equals(val.relref, "data/test1-csv.csv", "val.relref");
                // Get info
                ss.info(val.uri, callback);
            });
        m.eval(
            function (val, callback) {
                // Check info return values
                equals(val.uri, coluri+"test1-csv.csv", "val.uri");
                equals(val.relref,    "data/test1-csv.csv", "val.relref");
                equals(val.type,      "item", "val.type");
                equals(val.canList,   false,  "val.canList");
                equals(val.canRead,   true,   "val.canRead");
                equals(val.canWrite,  true,   "val.canWrite");
                equals(val.canDelete, true,   "val.canDelete");
                callback(val);
            });
        m.exec(TestExistAtomStorage_atomUri,
            function(val) {
                log.debug("----- test shuffl.ExistAtomStorage.create end -----");
                start();
            });
        stop(2000);
    });

    test("shuffl.ExistAtomStorage.get", function ()
    {
        logtest("shuffl.ExistAtomStorage.get");
        expect(9);
        log.debug("----- test shuffl.ExistAtomStorage.get start -----");
        var m = new shuffl.AsyncComputation();
        var ss = createTestSession();
        m.eval(
            function (val, callback) {
                initializeTestCollections(val, callback)
            });
        m.eval(
            function (val, callback) {
                try
                {
                    ss.get("data/test-csv.csv", function (val) {
                        ok(true, "shuffl.ExistAtomStorage.get no exception");
                        callback(val);
                    });
                }
                catch (e)
                {
                    log.debug("shuffl.ExistAtomStorage.get exception: "+e);
                    ok(false, "shuffl.ExistAtomStorage.get exception: "+e);
                    callback(e);
                }
            });
        m.eval(
            function (val, callback) {
                equals(val.uri, TestExistAtomStorage_baseUri+"data/test-csv.csv", "val.uri");
                equals(val.relref, "data/test-csv.csv", "val.relref");
                equals(typeof val.data, typeof TestExistAtomStorage_test_csv, "typeof val.data");
                equals(val.data,        TestExistAtomStorage_test_csv,        "val.data");
                equals(jQuery.toJSON(val.data), jQuery.toJSON(TestExistAtomStorage_test_csv), "val.data");
                callback(val);
            });
        m.exec(TestExistAtomStorage_atomUri,
            function(val) {
                log.debug("----- test shuffl.ExistAtomStorage.get end -----");
                start();
            });
        stop(2000);
    });

    test("shuffl.ExistAtomStorage.put", function ()
    {
        logtest("shuffl.ExistAtomStorage.put");
        expect(11);
        log.debug("----- test shuffl.ExistAtomStorage.put start -----");
        var m = new shuffl.AsyncComputation();
        var ss = createTestSession();
        m.eval(
            function (val, callback) {
                initializeTestCollections(val, callback)
            });

        m.eval(
            function (val, callback) {
                try
                {
                    ss.put("data/test-csv.csv", 
                        TestExistAtomStorage_test_csv_put, 
                        function (val) 
                        {
                            ok(true, "shuffl.ExistAtomStorage.get no exception");
                            callback(val);
                        });
                }
                catch (e)
                {
                    log.debug("shuffl.ExistAtomStorage.get exception: "+e);
                    ok(false, "shuffl.ExistAtomStorage.get exception: "+e);
                    callback(e);
                }
            });
        m.eval(
            function (val, callback) {
                // Check return value from put
                equals(val.uri, TestExistAtomStorage_baseUri+"data/test-csv.csv", "val.uri");
                equals(val.relref, "data/test-csv.csv", "val.relref");
                // Read back data just written
                try
                {
                    ss.get("data/test-csv.csv", callback);
                }
                catch (e)
                {
                    log.debug("shuffl.ExistAtomStorage.get exception: "+e);
                    ok(false, "shuffl.ExistAtomStorage.get exception: "+e);
                    callback(e);
                }
            });
        m.eval(
            function (val, callback) {
                equals(val.uri, TestExistAtomStorage_baseUri+"data/test-csv.csv", "val.uri");
                equals(val.relref, "data/test-csv.csv", "val.relref");
                equals(typeof val.data, typeof TestExistAtomStorage_test_csv_put, "typeof val.data");
                equals(val.data,        TestExistAtomStorage_test_csv_put,        "val.data");
                equals(jQuery.toJSON(val.data), jQuery.toJSON(TestExistAtomStorage_test_csv_put), "val.data");
                callback(val);
            });
        m.exec(TestExistAtomStorage_atomUri,
            function(val) {
                log.debug("----- test shuffl.ExistAtomStorage.put end -----");
                start();
            });
        stop(2000);
    });

    notest("shuffl.ExistAtomStorage.remove", function ()
    {
        logtest("shuffl.ExistAtomStorage.remove");
        ok(false, "eXist AtomPub doesn't support deleting media resource");
        expect(13);
        log.debug("----- test shuffl.ExistAtomStorage.remove start -----");
        var m = new shuffl.AsyncComputation();
        var ss = createTestSession();
        m.eval(
            function (val, callback) {
                initializeTestCollections(val, callback)
            });
        m.eval(
            function (val, callback) {
                try
                {
                    ss.get("data/test-csv.csv", callback);
                }
                catch (e)
                {
                    log.debug("shuffl.ExistAtomStorage.get exception: "+e);
                    ok(false, "shuffl.ExistAtomStorage.get exception: "+e);
                    callback(e);
                }
            });
        m.eval(
            function (val, callback) {
                equals(val.uri, TestExistAtomStorage_baseUri+"data/test-csv.csv", "get: val.uri");
                equals(val.relref, "data/test-csv.csv", "get: val.relref");
                equals(typeof val.data, typeof TestExistAtomStorage_test_csv, "get: typeof val.data");
                equals(val.data,        TestExistAtomStorage_test_csv,        "get: val.data");
                callback(val);
            });
        m.eval(
            function (val, callback) {
                try
                {
                    ss.remove("data/test-csv.csv", function (val) {
                        ok(true, "shuffl.ExistAtomStorage.remove no exception");
                        callback(val);
                    });
                }
                catch (e)
                {
                    log.debug("shuffl.ExistAtomStorage.remove exception: "+e);
                    ok(false, "shuffl.ExistAtomStorage.remove exception"+e);
                    callback(e);
                }
            });
        m.eval(
            function (val, callback) {
                // Check return values
                equals(val, null, "remove: val");
                // Get info
                ss.info("data/test-csv.csv", callback);
            });
        m.eval(
            function (val, callback) {
                // Check info return values
                equals(val.uri, null, "info: val.uri");
                callback(val);
            });
        m.eval(
            function (val, callback) {
                try
                {
                    ss.get("data/test-csv.csv", function (val) {
                        ok(true, "shuffl.ExistAtomStorage.get no exception");
                        callback(val);
                    });
                }
                catch (e)
                {
                    log.debug("shuffl.ExistAtomStorage.get exception: "+e);
                    ok(false, "shuffl.ExistAtomStorage.get exception: "+e);
                    callback(e);
                }
            });
        m.eval(
            function (val, callback) {
                equals(val.uri, null, "val.uri");
                callback(val);
            });
        m.exec(TestExistAtomStorage_atomUri,
            function(val) {
                log.debug("----- test shuffl.ExistAtomStorage.remove end -----");
                start();
            });
        stop(2000);
    });

};

// End
