/**
 * @fileoverview
 *  Test suite for shuffl-ajax
 *  
 * @author Graham Klyne
 * @version $Id: test-shuffl-ajax.js 840 2010-06-18 09:50:42Z gk-google@ninebynine.org $
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

var TestShufflAjax_JSONdata =
    { 'shuffl:id':        'getJSON'
    , 'shuffl:type':      'shuffl-freetext-yellow'
    , 'shuffl:version':   '0.1'
    , 'shuffl:base-uri':  '#'
    , 'shuffl:uses-prefixes':
      [ { 'shuffl:prefix':  'shuffl', 'shuffl:uri': 'http://purl.org/NET/Shuffl/vocab#' }
      , { 'shuffl:prefix':  'rdf',    'shuffl:uri': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' }
      , { 'shuffl:prefix':  'rdfs',   'shuffl:uri': 'http://www.w3.org/2000/01/rdf-schema#' }
      , { 'shuffl:prefix':  'owl',    'shuffl:uri': 'http://www.w3.org/2002/07/owl#' }
      , { 'shuffl:prefix':  'xsd',    'shuffl:uri': 'http://www.w3.org/2001/XMLSchema#' }
      ]
    , 'shuffl:data':
      { 'shuffl:title':   "Card 1 title"
      , 'shuffl:tags':    [ 'card_1_tag', 'yellowtag' ]
      , 'shuffl:text':    "Card 1 free-form text here<br/>line 2<br/>line3<br/>yellow"
      }
    };

var TestShufflAjax_Text =
    "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n"+
    "\n"+
    "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n"+
    "  <head>\n"+
    "    <title>Shuffl workspace</title>\n"+
    "  </head>\n"+
    "  <body>\n"+
    "    <div />\n"+
    "  </body>\n"+
    "</html>\n"

/**
 * Function to register tests
 */
TestShufflAjax = function()
{

    module("TestShufflAjax");

    test("shuffl.ajax.getJSON (success)", function ()
    {
        logtest("shuffl.ajax.getJSON (success)");
        expect(1);
        log.debug("----- shuffl.ajax.getJSON (success) start -----");
        var m = new shuffl.AsyncComputation();
        m.eval(function (val, callback) {
                shuffl.ajax.getJSON("data/test-shuffl-ajax-getJSON.json", callback);
            });
        m.eval(
            function (val, callback) {
                same(val, TestShufflAjax_JSONdata, "Data value returned");
                callback(true);
            });
        m.exec(null,
            function(val) {
                log.debug("----- shuffl.ajax.getJSON (success) end -----");
                start();
            });
        stop(2000);
    });

    test("shuffl.ajax.getJSON (error)", function ()
    {
        logtest("shuffl.ajax.getJSON (error)");
        expect(3);
        log.debug("----- shuffl.ajax.getJSON (error) start -----");
        var m = new shuffl.AsyncComputation();
        m.eval(
            function (val, callback) {
                shuffl.ajax.getJSON("data/test-shuffl-ajax-getJSON.NODATA", callback);
            });
        m.eval(
            function (val, callback) {
                ok(val instanceof shuffl.Error, "Error value returned");
                equals(val.msg, "Request failed", "val.msg");
                equals(val.status, "error", "val.status");
                callback(true);
            });
        m.exec(null,
            function(val) {
                log.debug("----- shuffl.ajax.getJSON (error) end -----");
                start();
            });
        stop(2000);
    });

    test("shuffl.ajax.getJSON (wrong datatype)", function ()
    {
        logtest("shuffl.ajax.getJSON (error)");
        expect(3);
        log.debug("----- shuffl.ajax.getJSON (wrong datatype) start -----");
        var m = new shuffl.AsyncComputation();
        m.eval(
            function (val, callback) {
                shuffl.ajax.getJSON("data/test-shuffl-ajax-getJSON.xml", callback);
            });
        m.eval(
            function (val, callback) {
                ok(val instanceof shuffl.Error, "Error value returned");
                equals(val.msg, "Invalid JSON", "val.msg");
                equals(val.status, "parsererror", "val.status");
                callback(true);
            });
        m.exec(null,
            function(val) {
                log.debug("----- shuffl.ajax.getJSON (wrong datatype) end -----");
                start();
            });
        stop(2000);
    });

    test("shuffl.ajax.get (text)", function ()
    {
        logtest("shuffl.ajax.get (text)");
        expect(1);
        log.debug("----- shuffl.ajax.get (text) start -----");
        var m = new shuffl.AsyncComputation();
        m.eval(function (val, callback) {
                shuffl.ajax.get("data/test-shuffl-ajax-getJSON.txt", "text", callback);
            });
        m.eval(
            function (val, callback) {
                equals(jQuery.toJSON(val), jQuery.toJSON(TestShufflAjax_Text), "Text value returned");
                callback(true);
            });
        m.exec(null,
            function(val) {
                log.debug("----- shuffl.ajax.get (text) end -----");
                start();
            });
        stop(2000);
    });

};

// End
