/**
 * @fileoverview
 *  Test suite for WebDAV-based storage module.
 *  
 * @author Graham Klyne
 * @version $Id: test-shuffl-storage-webdav.js 841 2010-06-18 13:44:26Z gk-google@ninebynine.org $
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

// Figure root URI based on page URI
var TestWebDAVStorage_pageUri = jQuery.uri().toString();
var TestWebDAVStorage_rootUri = null;
var TestWebDAVStorage_rootUri_list =
    [ "http://localhost/webdav/"
    , "http://zoo-samos.zoo.ox.ac.uk/webdav/"
    , "http://tinos.zoo.ox.ac.uk/webdav/"
    ];
for (i in TestWebDAVStorage_rootUri_list)
{
    var r =  TestWebDAVStorage_rootUri_list[i];
    if (shuffl.starts(r, TestWebDAVStorage_pageUri))
    {
        TestWebDAVStorage_rootUri = r;
    }
}

var TestWebDAVStorage_baseUri = TestWebDAVStorage_rootUri+"shuffltest/";

var TestWebDAVStorage_test_csv =
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

var TestWebDAVStorage_test_csv_put =
    " , col1,col2,col3,col4\n"+
    "row1, a1 , b1 , c1 , d1\n"+
    "row2, a2 , b2 , c2 , d2\n"+ 
    "End.";

/**
 * Function to register tests
 */
TestWebDAVStorage = function()
{

    module("TestWebDAVStorage");

    test("NOTE: TestWebDAVStorage must be loaded from WebDAV server", function ()
    {
        logtest("TestWebDAVStorage origin check");
        if (!TestWebDAVStorage_rootUri)
        {
            ok(false, "TestWebDAVStorage must be loaded from WebDAV server");
            return;
        }
        ok(true, "TestWebDAVStorage running OK");
    });

    test("TestWebDAVStorage", function ()
    {
        logtest("TestWebDAVStorage");
        shuffl.resetStorageHandlers();
        shuffl.addStorageHandler(
            { uri:      TestWebDAVStorage_rootUri
            , name:     "WebDAV"
            , factory:  shuffl.WebDAVStorage
            });
        ok(true, "TestWebDAVStorage running OK");
    });

    test("Storage handler factory", function ()
    {
        logtest("Storage handler factory");
        expect(9);
        // Instatiate dummy handler for two URIs
        shuffl.addStorageHandler(
            { uri:      "http://localhost:8081/dummy1/"
            , name:     "Dummy1"
            , factory:  shuffl.WebDAVStorage
            });
        shuffl.addStorageHandler(
            { uri:      "http://localhost:8081/dummy2/"
            , name:     "Dummy2"
            , factory:  shuffl.WebDAVStorage
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
        var s3 = shuffl.makeStorageSession(TestWebDAVStorage_rootUri+"foo/bar");
        equals(s3.getHandlerName(), "WebDAV", "s3.handlerName()");
        equals(s3.getRootUri(), TestWebDAVStorage_rootUri+"", "s3.getRootUri()");
        equals(s3.getBaseUri(), TestWebDAVStorage_rootUri+"foo/bar", "s3.getBaseUri()");
    });

    test("shuffl.WebDAVStorage.resolve", function ()
    {
        logtest("shuffl.WebDAVStorage.resolve");
        expect(25);
        this.rooturi = TestWebDAVStorage_rootUri.toString();
        shuffl.addStorageHandler(
            { uri:      this.rooturi
            , name:     "Test"
            , factory:  shuffl.WebDAVStorage
            });
        var b  = jQuery.uri(TestWebDAVStorage_baseUri);
        var ss = shuffl.makeStorageSession(b.toString());
        equals(ss.resolve("http://localhost:8080/test/a/b").uri, null, "Unresolved URI");
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
        this.rooturi = TestWebDAVStorage_rootUri.toString();
        shuffl.addStorageHandler(
            { uri:      this.rooturi
            , name:     "Test"
            , factory:  shuffl.WebDAVStorage
            });
        return shuffl.makeStorageSession(TestWebDAVStorage_baseUri);
    }

    function initializeTestCollections(ss, rooturi, callback)
    {
        var m = new shuffl.AsyncComputation();
        m.eval(
            function (val, callback) {
                // Delete collection /shuffltest/data/
                ss.removeCollection(TestWebDAVStorage_rootUri+"shuffltest/data/", callback);
            });
        m.eval(
            function (val, callback) {
                // Delete collection /shuffltest/
                ss.removeCollection(TestWebDAVStorage_rootUri+"shuffltest/", callback);
            });
        m.eval(
            function (val, callback) {
                // Create collection /shuffltest/
                ss.createCollection(TestWebDAVStorage_rootUri, "shuffltest", callback);
            });
        m.eval(
            function (val, callback) {
                // Create collection /shuffltest/data/
                ss.createCollection(TestWebDAVStorage_rootUri+"shuffltest", "data", callback);
            });
        m.eval(
            function (val, callback) {
                // Create resource /shuffltest/data/test-csv.csv
                ss.create(TestWebDAVStorage_rootUri+"shuffltest/data", "test-csv.csv", TestWebDAVStorage_test_csv, callback);
            });
        m.eval(
            function (val, callback) {
                // Delay to allow creation to complete (???)
                log.debug("Start delay...");
                setTimeout(function() { log.debug("End delay..."); callback(val) }, 100);
                ////jQuery.timer(200, function() { log.debug("End delay..."); callback(val) });
            });
        m.exec(rooturi,
            function (val) {
                log.debug("initializeTestCollection "+shuffl.objectString(val));
                callback(val);
            });
    };

    test("shuffl.WebDAVStorage.handlerInfo", function ()
    {
        logtest("shuffl.WebDAVStorage.handlerInfo");
        expect(4);
        var ss = createTestSession();
        var hi = ss.handlerInfo();
        equals(hi.canList,   true,  "hi.canList");
        equals(hi.canRead,   true,  "hi.canRead");
        equals(hi.canWrite,  true,  "hi.canWrite");
        equals(hi.canDelete, true,  "hi.canDelete");
        log.debug("----- test shuffl.WebDAVStorage.handlerInfo end -----");
    });

    test("shuffl.WebDAVStorage.info", function ()
    {
        logtest("shuffl.WebDAVStorage.info");
        expect(18);
        log.debug("----- test shuffl.WebDAVStorage.info start -----");
        var m  = new shuffl.AsyncComputation();
        var ss = createTestSession();
        m.eval(
            function (val, callback) {
                initializeTestCollections(ss, val, callback)
            });
        m.eval(
            function (val, callback) {
                equals(val.uri, TestWebDAVStorage_baseUri+"data/test-csv.csv", "val.uri");
                equals(val.relref, "data/test-csv.csv", "val.relref");
                callback({});
            });
        m.eval(
            function (val, callback) {
                try
                {
                    ss.info("data/", callback);
                    ok(true, "shuffl.WebDAVStorage.info no exception");
                }
                catch (e)
                {
                    log.debug("shuffl.WebDAVStorage.info exception: "+e);
                    ok(false, "shuffl.WebDAVStorage.info exception"+e);
                    callback(e);
                };
            });
        m.eval(
            function (val, callback) {
                equals(val.uri, TestWebDAVStorage_baseUri+"data/", "val.uri");
                equals(val.relref,    "data/", "val.relref");
                equals(val.type,      "collection", "val.type");
                equals(val.canList,   true,  "val.canList");
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
                    ok(true, "shuffl.WebDAVStorage.info no exception");
                }
                catch (e)
                {
                    log.debug("shuffl.WebDAVStorage.info exception: "+e);
                    ok(false, "shuffl.WebDAVStorage.info exception"+e);
                    callback(e);
                };
            });
        m.eval(
            function (val, callback) {
                var b = TestWebDAVStorage_baseUri;
                equals(val.uri, TestWebDAVStorage_baseUri+"data/test-csv.csv", "val.uri");
                equals(val.relref,    "data/test-csv.csv", "val.relref");
                equals(val.type,      "item", "val.type");
                equals(val.canList,   true,  "val.canList");
                equals(val.canRead,   true,  "val.canRead");
                equals(val.canWrite,  true,  "val.canWrite");
                equals(val.canDelete, true,  "val.canDelete");
                callback(val);
            });
        m.exec(TestWebDAVStorage_rootUri,
            function(val) {
                log.debug("----- test shuffl.WebDAVStorage.info end -----");
                start();
            });
        stop(2000);
    });

    test("shuffl.WebDAVStorage.info (non-existent resource)", function ()
    {
        logtest("shuffl.WebDAVStorage.info");
        expect(3);
        log.debug("----- test shuffl.WebDAVStorage.info (non-existent resource) start -----");
        var m = new shuffl.AsyncComputation();
        var ss = createTestSession();
        m.eval(
            function (val, callback) {
                initializeTestCollections(ss, val, callback)
            });
        m.eval(
            function (val, callback) {
                try
                {
                    ss.info("data/test-csv.nodata", function (val) {
                        ok(true, "shuffl.WebDAVStorage.info no exception");
                        callback(val);
                    });
                }
                catch (e)
                {
                    log.debug("shuffl.WebDAVStorage.info exception: "+e);
                    ok(false, "shuffl.WebDAVStorage.info exception"+e);
                    callback(e);
                }
            });
        m.exec(TestWebDAVStorage_rootUri,
            function(val) {
                equals(val.msg, "Request failed", "val.msg");
                equals(val.HTTPstatus, 404, "HTTP status number");
                log.debug("val", shuffl.objectString(val));
                log.debug("----- test shuffl.WebDAVStorage.info (non-existent resource) end -----");
                start();
            });
        stop(3000);
    });

    test("shuffl.WebDAVStorage.createCollection", function ()
    {
        logtest("shuffl.WebDAVStorage.createCollection");
        expect(10);
        log.debug("----- test shuffl.WebDAVStorage.createCollection start -----");
        var m = new shuffl.AsyncComputation();
        var ss = createTestSession();
        m.eval(
            function (val, callback) {
                initializeTestCollections(ss, val, callback)
            });
        m.eval(
            function (val, callback) {
                try
                {
                    ss.createCollection(TestWebDAVStorage_baseUri, "test", function (val) {
                        ok(true, "shuffl.WebDAVStorage.createCollection no exception");
                        callback(val);
                    });
                }
                catch (e)
                {
                    log.debug("shuffl.WebDAVStorage.createCollection exception: "+e);
                    ok(false, "shuffl.WebDAVStorage.createCollection exception"+e);
                    callback(e);
                }
            });
        m.eval(
            function (val, callback) {
                // Check return values
                equals(val.uri, TestWebDAVStorage_baseUri+"test/", "val.uri");
                equals(val.relref, "test/", "val.relref");
                // Get info
                ss.info(val.uri, callback);
            });
        m.eval(
            function (val, callback) {
                // Check info return values
                equals(val.uri, TestWebDAVStorage_baseUri+"test/", "val.uri");
                equals(val.relref,    "test/", "val.relref");
                equals(val.type,      "collection", "val.type");
                equals(val.canList,   true,  "val.canList");
                equals(val.canRead,   true,  "val.canRead");
                equals(val.canWrite,  true,  "val.canWrite");
                equals(val.canDelete, true,  "val.canDelete");
                callback(val);
            });
        m.exec(TestWebDAVStorage_rootUri,
            function(val) {
                log.debug("----- test shuffl.WebDAVStorage.createCollection end -----");
                start();
            });
        stop(2000);
    });

    test("shuffl.WebDAVStorage.listCollection", function ()
    {
        logtest("shuffl.WebDAVStorage.listCollection");
        expect(12);
        log.debug("----- test shuffl.WebDAVStorage.listCollection start -----");
        var m = new shuffl.AsyncComputation();
        var ss = createTestSession();
        m.eval(
            function (val, callback) {
                initializeTestCollections(ss, val, callback)
            });
        m.eval(
            function (val, callback) {
                try
                {
                    ss.listCollection("", callback);
                }
                catch (e)
                {
                    log.debug("shuffl.WebDAVStorage.listCollection exception: "+e);
                    ok(false, "shuffl.WebDAVStorage.listCollection exception"+e);
                    callback(e);
                }
            });
        m.eval(
        	function (val, callback) {
        		log.debug("listCollection callback: val: "+shuffl.objectString(val));
        		equals(val.uri, TestWebDAVStorage_baseUri, "val.uri");
        		equals(val.relref, "", "val.relref");
        		equals(val.members.length, 1, "val.members.length");
        		equals(val.members[0].uri, TestWebDAVStorage_baseUri+"data/", "val.members[0].uri");
        		equals(val.members[0].relref, "data/", "val.members[0].relref");
        		equals(val.members[0].type, "collection", "val.members[0].type");
        		callback(val);
        	});    
        m.eval(
            function (val, callback) {
                try
                {
                    ss.listCollection("data/", callback);
                }
                catch (e)
                {
                    log.debug("shuffl.WebDAVStorage.listCollection exception: "+e);
                    ok(false, "shuffl.WebDAVStorage.listCollection exception"+e);
                    callback(e);
                }
            });
        m.eval(
        	function (val, callback) {
        		equals(val.uri, TestWebDAVStorage_baseUri+"data/", "val.uri");
        		equals(val.relref, "data/", "val.relref");
        		equals(val.members.length, 1, "val.members.length");
        		equals(val.members[0].uri, TestWebDAVStorage_baseUri+"data/test-csv.csv", "val.members[0].uri");
        		equals(val.members[0].relref, "data/test-csv.csv", "val.members[0].relref");
        		equals(val.members[0].type, "item", "val.members[0].type");
        		callback(val);
        	});
        m.exec(TestWebDAVStorage_rootUri,
            function(val) {
                log.debug("----- test shuffl.WebDAVStorage.listCollection end -----");
                start();
            });
        stop(3000);
    });

    test("shuffl.WebDAVStorage.removeCollection", function ()
    {
        logtest("shuffl.WebDAVStorage.removeCollection");
        expect(6);
        log.debug("----- test shuffl.WebDAVStorage.removeCollection start -----");
        var m = new shuffl.AsyncComputation();
        var ss = createTestSession();
        m.eval(
            function (val, callback) {
                initializeTestCollections(ss, val, callback)
            });
        m.eval(
            function (val, callback) {
                try
                {
                    ss.createCollection(TestWebDAVStorage_baseUri, "test", function (val) {
                        ok(true, "shuffl.WebDAVStorage.createCollection no exception");
                        callback(val);
                    });
                }
                catch (e)
                {
                    log.debug("shuffl.WebDAVStorage.createCollection exception: "+e);
                    ok(false, "shuffl.WebDAVStorage.createCollection exception"+e);
                    callback(e);
                }
            });
        m.eval(
            function (val, callback) {
                // Check return values
                equals(val.uri, TestWebDAVStorage_baseUri+"test/", "val.uri");
                equals(val.relref, "test/", "val.relref");
                callback(val);
            });
        m.eval(
            function (val, callback) {
                try
                {
                    ss.removeCollection(TestWebDAVStorage_baseUri+"test/", function (val) {
                        ok(true, "shuffl.WebDAVStorage.removeCollection no exception");
                        callback(val);
                    });
                }
                catch (e)
                {
                    log.debug("shuffl.WebDAVStorage.removeCollection exception: "+e);
                    ok(false, "shuffl.WebDAVStorage.removeCollection exception"+e);
                    callback(e);
                }
            });
        m.eval(
            function (val, callback) {
                // Check return values
                equals(val, null, "val");
                // Get info
                ss.info(TestWebDAVStorage_baseUri+"test/", callback);
            });
        m.eval(
            function (val, callback) {
                // Check info return values
                equals(val.uri,       null, "val.uri");
                callback(val);
            });
        m.exec(TestWebDAVStorage_rootUri,
            function(val) {
                log.debug("----- test shuffl.WebDAVStorage.removeCollection end -----");
                start();
            });
        stop(3000);
    });

    test("shuffl.WebDAVStorage.create", function ()
    {
        logtest("shuffl.WebDAVStorage.create");
        expect(15);
        log.debug("----- test shuffl.WebDAVStorage.create start -----");
        var m  = new shuffl.AsyncComputation();
        var ss = createTestSession();
        var coluri = TestWebDAVStorage_baseUri+"data/";
        m.eval(
            function (val, callback) {
                // Creates shuffltest/data/test-csv.csv ...
                initializeTestCollections(ss, val, callback)
            });
        m.eval(
            function (val, callback) {
                log.debug("***** create: "+coluri+", test-csv.csv");
                try
                {
                    ss.create(coluri, "test-csv.csv", 
                        TestWebDAVStorage_test_csv, 
                        function (val)
                        {
                            ok(true, "shuffl.WebDAVStorage.create no exception");
                            callback(val);
                        });
                }
                catch (e)
                {
                    log.debug("shuffl.WebDAVStorage.create exception: "+e);
                    ok(false, "shuffl.WebDAVStorage.create exception"+e);
                    callback(e);
                }
            });
        m.eval(
            function (val, callback) {
                log.debug("create result: "+shuffl.objectString(val));
                // Check return values
                ok(val instanceof shuffl.Error, "Error expected for existing resource "+shuffl.objectString(val));
                equals(val.msg, "Create failed: resource already exists", "val.msg");
                equals(val.HTTPstatus, 400, "val.HTTPstatus");
                equals(val.HTTPstatusText, 
                    "Resource already exists", 
                    "val.HTTPstatusText");
                // Try again to create resource
                try
                {
                    ss.create(coluri, "test1-csv.csv", 
                        TestWebDAVStorage_test_csv, 
                        function (val)
                        {
                            ok(true, "shuffl.WebDAVStorage.create no exception");
                            callback(val);
                        });
                }
                catch (e)
                {
                    log.debug("shuffl.WebDAVStorage.create exception: "+e);
                    ok(false, "shuffl.WebDAVStorage.create exception"+e);
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
                equals(val.canList,   true,   "val.canList");
                equals(val.canRead,   true,   "val.canRead");
                equals(val.canWrite,  true,   "val.canWrite");
                equals(val.canDelete, true,   "val.canDelete");
                callback(val);
            });
        m.exec(TestWebDAVStorage_rootUri,
            function(val) {
                log.debug("----- test shuffl.WebDAVStorage.create end -----");
                start();
            });
        stop(3000);
    });

    test("shuffl.WebDAVStorage.get", function ()
    {
        logtest("shuffl.WebDAVStorage.get");
        expect(6);
        log.debug("----- test shuffl.WebDAVStorage.get start -----");
        var m = new shuffl.AsyncComputation();
        var ss = createTestSession();
        m.eval(
            function (val, callback) {
                initializeTestCollections(ss, val, callback)
            });
        m.eval(
            function (val, callback) {
                try
                {
                    ss.get("data/test-csv.csv", function (val) {
                        ok(true, "shuffl.WebDAVStorage.get no exception");
                        callback(val);
                    });
                }
                catch (e)
                {
                    log.debug("shuffl.WebDAVStorage.get exception: "+e);
                    ok(false, "shuffl.WebDAVStorage.get exception: "+e);
                    callback(e);
                }
            });
        m.eval(
            function (val, callback) {
                equals(val.uri, TestWebDAVStorage_baseUri+"data/test-csv.csv", "val.uri");
                equals(val.relref, "data/test-csv.csv", "val.relref");
                equals(typeof val.data, typeof TestWebDAVStorage_test_csv, "typeof val.data");
                equals(val.data,        TestWebDAVStorage_test_csv,        "val.data");
                equals(jQuery.toJSON(val.data), jQuery.toJSON(TestWebDAVStorage_test_csv), "val.data");
                callback(val);
            });
        m.exec(TestWebDAVStorage_rootUri,
            function(val) {
                log.debug("----- test shuffl.WebDAVStorage.get end -----");
                start();
            });
        stop(3000);
    });

    test("shuffl.WebDAVStorage.put", function ()
    {
        logtest("shuffl.WebDAVStorage.put");
        expect(8);
        log.debug("----- test shuffl.WebDAVStorage.put start -----");
        var m = new shuffl.AsyncComputation();
        var ss = createTestSession();
        m.eval(
            function (val, callback) {
                initializeTestCollections(ss, val, callback)
            });
        m.eval(
            function (val, callback) {
                try
                {
                	log.debug("calling put");
                    ss.put("data/test-csv.csv", 
                        TestWebDAVStorage_test_csv_put, 
                        function (val) 
                        {
                            ok(true, "shuffl.WebDAVStorage.put no exception");
                            callback(val);
                        });
                }
                catch (e)
                {
                    log.debug("shuffl.WebDAVStorage.put exception: "+e);
                    ok(false, "shuffl.WebDAVStorage.put exception: "+e);
                    callback(e);
                }
            });
        m.eval(
            function (val, callback) {
                // Check return value from put
                equals(val.uri, TestWebDAVStorage_baseUri+"data/test-csv.csv", "val.uri");
                equals(val.relref, "data/test-csv.csv", "val.relref");
                // Read back data just written
                try
                {
                    ss.get("data/test-csv.csv", callback);
                }
                catch (e)
                {
                    log.debug("shuffl.WebDAVStorage.put exception: "+e);
                    ok(false, "shuffl.WebDAVStorage.put exception: "+e);
                    callback(e);
                }
            });
        m.eval(
            function (val, callback) {
                equals(val.uri, TestWebDAVStorage_baseUri+"data/test-csv.csv", "val.uri");
                equals(val.relref, "data/test-csv.csv", "val.relref");
                equals(typeof val.data, typeof TestWebDAVStorage_test_csv_put, "typeof val.data");
                equals(val.data,        TestWebDAVStorage_test_csv_put,        "val.data");
                equals(jQuery.toJSON(val.data), jQuery.toJSON(TestWebDAVStorage_test_csv_put), "val.data");
                callback(val);
            });
        m.exec(TestWebDAVStorage_rootUri,
            function(val) {
                log.debug("----- test shuffl.WebDAVStorage.put end -----");
                start();
            });
        stop(3000);
    });

    test("shuffl.WebDAVStorage.remove", function ()
    {
        logtest("shuffl.WebDAVStorage.remove");
        expect(9);
        log.debug("----- test shuffl.WebDAVStorage.remove start -----");
        var m = new shuffl.AsyncComputation();
        var ss = createTestSession();
        m.eval(
            function (val, callback) {
                initializeTestCollections(ss, val, callback)
            });
        m.eval(
            function (val, callback) {
                try
                {
                    ss.get("data/test-csv.csv", callback);
                }
                catch (e)
                {
                    log.debug("shuffl.WebDAVStorage.get exception: "+e);
                    ok(false, "shuffl.WebDAVStorage.get exception: "+e);
                    callback(e);
                }
            });
        m.eval(
            function (val, callback) {
                equals(val.uri, TestWebDAVStorage_baseUri+"data/test-csv.csv", "get: val.uri");
                equals(val.relref, "data/test-csv.csv", "get: val.relref");
                equals(typeof val.data, typeof TestWebDAVStorage_test_csv, "get: typeof val.data");
                equals(val.data,        TestWebDAVStorage_test_csv,        "get: val.data");
                callback(val);
            });
        m.eval(
            function (val, callback) {
                try
                {
                    ss.remove("data/test-csv.csv", function (val) {
                        ok(true, "shuffl.WebDAVStorage.remove no exception");
                        callback(val);
                    });
                }
                catch (e)
                {
                    log.debug("shuffl.WebDAVStorage.remove exception: "+e);
                    ok(false, "shuffl.WebDAVStorage.remove exception"+e);
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
                        ok(true, "shuffl.WebDAVStorage.get no exception");
                        callback(val);
                    });
                }
                catch (e)
                {
                    log.debug("shuffl.WebDAVStorage.get exception: "+e);
                    ok(false, "shuffl.WebDAVStorage.get exception: "+e);
                    callback(e);
                }
            });
        m.eval(
            function (val, callback) {
                equals(val.uri, null, "val.uri");
                callback(val);
            });
        m.exec(TestWebDAVStorage_rootUri,
            function(val) {
                log.debug("----- test shuffl.WebDAVStorage.remove end -----");
                start();
            });
        stop(3000);
    });

};

// End
