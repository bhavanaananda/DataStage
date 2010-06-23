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
 * Test suite for free text card functions
 */

var NaN = Number.NaN;

var Test_dataworksheet_DataTable =
    [ [ "row",   "col1",  "col2",  "col3" ]
    , [ "row_1", "1.11",  "1.22",  "1.33" ]
    , [ "row_2", "2.11",  "2.22",  "2.33" ]
    , [ "End." ]
    ];

var Test_dataworksheet_DataLabels = ["col1",  "col2",  "col3"];

var Test_dataworksheet_DataSeries =
    [ [ [NaN, 1.11], [NaN, 2.11], [NaN, NaN] ]
    , [ [NaN, 1.22], [NaN, 2.22], [NaN, NaN] ]
    , [ [NaN, 1.33], [NaN, 2.33], [NaN, NaN] ]
    ];

var Test_dataworksheet_DataAxes =
    [ [ 'x1', 'y1' ]
    , [ 'x1', 'y1' ]
    , [ 'x1', 'y1' ]
    ];

/**
 * Larger data table to test data row selection
 */
var Larger_dataworksheet_DataTable =
    [ []
    , [ "x", "col1", "col2", "col3", "col4_is_much_wider", "col5" ]
    , [ "1", "1.1", "1.2", "1.3", "1.4", "1.5" ]
    , [ "2", "2.1", "2.2", "2.3", "2.4", "2.5" ]
    , [ "3", "3.1", "3.2", "3.3", "3.4", "3.5" ]
    , [ "4", "4.1", "4.2", "4.3", "4.4", "4.5" ]
    , [ "5", "5.1", "5.2", "5.3", "5.4", "5.5" ]
    , [ "6", "6.1", "6.2", "6.3", "6.4", "6.5" ]
    , [ "7", "7.1", "7.2", "7.3", "7.4", "7.5" ]
    , [ "8", "8.1", "8.2", "8.3", "8.4", "8.5" ]
    , [ "End." ]
    ];
  
var Larger_dataworksheet_DataLabels = 
    [ "col1", "col2", "col3", "col4_is_much_wider", "col5" ];

var Larger_dataworksheet_DataSeries =
    [ [ [ 1, 1.1 ], [ 2, 2.1 ], [ 3, 3.1 ], [ 4, 4.1 ], [ 5, 5.1 ], [ 6, 6.1 ], [ 7, 7.1 ], [ 8, 8.1 ], [ NaN, NaN ] ]
    , [ [ 1, 1.2 ], [ 2, 2.2 ], [ 3, 3.2 ], [ 4, 4.2 ], [ 5, 5.2 ], [ 6, 6.2 ], [ 7, 7.2 ], [ 8, 8.2 ], [ NaN, NaN ] ]
    , [ [ 1, 1.3 ], [ 2, 2.3 ], [ 3, 3.3 ], [ 4, 4.3 ], [ 5, 5.3 ], [ 6, 6.3 ], [ 7, 7.3 ], [ 8, 8.3 ], [ NaN, NaN ] ]
    , [ [ 1, 1.4 ], [ 2, 2.4 ], [ 3, 3.4 ], [ 4, 4.4 ], [ 5, 5.4 ], [ 6, 6.4 ], [ 7, 7.4 ], [ 8, 8.4 ], [ NaN, NaN ] ]
    , [ [ 1, 1.5 ], [ 2, 2.5 ], [ 3, 3.5 ], [ 4, 4.5 ], [ 5, 5.5 ], [ 6, 6.5 ], [ 7, 7.5 ], [ 8, 8.5 ], [ NaN, NaN ] ]
    ];

var Larger_dataworksheet_DataAxes =
    [ [ 'x1', 'y1' ]
    , [ 'x1', 'y1' ]
    , [ 'x1', 'y1' ]
    , [ 'x1', 'y1' ]
    , [ 'x1', 'y1' ]
    ];

var Larger_dataworksheet_DataSeries_2_6 =
    [ [ [ 2, 2.1 ], [ 3, 3.1 ], [ 4, 4.1 ], [ 5, 5.1 ], [ 6, 6.1 ] ]
    , [ [ 2, 2.2 ], [ 3, 3.2 ], [ 4, 4.2 ], [ 5, 5.2 ], [ 6, 6.2 ] ]
    , [ [ 2, 2.3 ], [ 3, 3.3 ], [ 4, 4.3 ], [ 5, 5.3 ], [ 6, 6.3 ] ]
    , [ [ 2, 2.4 ], [ 3, 3.4 ], [ 4, 4.4 ], [ 5, 5.4 ], [ 6, 6.4 ] ]
    , [ [ 2, 2.5 ], [ 3, 3.5 ], [ 4, 4.5 ], [ 5, 5.5 ], [ 6, 6.5 ] ]
    ];

var Larger_dataworksheet_DataLabels_x1_y1_y2 = [ "x", "col3" ];

var Larger_dataworksheet_DataAxes_x1_y1_y2 =
    [ [ 'x1', 'y1' ]
    , [ 'x1', 'y2' ]
    ];

var Larger_dataworksheet_DataSeries_x1_y1_y2 =
    [ [ [ 1.2, 1   ], [ 2.2, 2   ], [ 3.2, 3   ], [ 4.2, 4   ], [ 5.2, 5   ], [ 6.2, 6   ], [ 7.2, 7   ], [ 8.2, 8   ] ]
    , [ [ 1.2, 1.3 ], [ 2.2, 2.3 ], [ 3.2, 3.3 ], [ 4.2, 4.3 ], [ 5.2, 5.3 ], [ 6.2, 6.3 ], [ 7.2, 7.3 ], [ 8.2, 8.3 ] ]
    ];

/**
 * Default model values
 */
var Default_dataworksheet_DataTable  = [ [] ];

var Default_dataworksheet_DataLabels = [];

var Default_dataworksheet_DataSeries = [];

var Default_dataworksheet_DataAxes = [];

/**
 * Data
 */
var testcarddataworksheet_carddata = 
    { 'shuffl:id':        'card_N'
    , 'shuffl:type':      'shuffl-dataworksheet-ZZZZZZ'
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
      { 'shuffl:title':         "Card N title"
      , 'shuffl:tags':          [ 'card_N_tag', 'footag' ]
      , 'shuffl:uri':           "test-table.csv"
      , "shuffl:header_row":    1
      , "shuffl:data_firstrow": 2
      , "shuffl:data_lastrow":  10
      , 'shuffl:table':         Larger_dataworksheet_DataTable
      }
    };

/**
 * Function to register tests
 */

TestCardDataWorksheet = function() {

    module("TestCardDataWorksheet");

    test("shuffl.addCardFactories", function () 
    {
        logtest("shuffl.addCardFactories");
        // Card factories are created when shuffl-card-dataworksheet module is loaded
		    equals(shuffl.CardFactoryMap['shuffl-dataworksheet-yellow'].cardcss, "stock-yellow", "shuffl-dataworksheet-yellow");
        equals(shuffl.CardFactoryMap['shuffl-dataworksheet-blue'  ].cardcss, "stock-blue",   "shuffl-dataworksheet-blue");
        equals(shuffl.CardFactoryMap['shuffl-dataworksheet-green' ].cardcss, "stock-green",  "shuffl-dataworksheet-green");
        equals(shuffl.CardFactoryMap['shuffl-dataworksheet-orange'].cardcss, "stock-orange", "shuffl-dataworksheet-orange");
        equals(shuffl.CardFactoryMap['shuffl-dataworksheet-pink'  ].cardcss, "stock-pink",   "shuffl-dataworksheet-pink");
        equals(shuffl.CardFactoryMap['shuffl-dataworksheet-purple'].cardcss, "stock-purple", "shuffl-dataworksheet-purple");
    });
    
    test("shuffl.getCardFactories", function () 
    {
        logtest("shuffl.getCardFactories");
        var c0 = shuffl.getCardFactory("default-type");
        equals(typeof c0, "function", "default factory");
		    var c1 = shuffl.getCardFactory("shuffl-dataworksheet-yellow");
		    equals(typeof c1, "function", "retrieved factory yellow");
        var c2 = shuffl.getCardFactory("shuffl-dataworksheet-blue");
        equals(typeof c2, "function", "retrieved factory blue");
        var c3 = shuffl.getCardFactory("shuffl-dataworksheet-green");
        equals(typeof c3, "function", "retrieved factory green");
        var c4 = shuffl.getCardFactory("shuffl-dataworksheet-orange");
        equals(typeof c4, "function", "retrieved factory orange");
        var c5 = shuffl.getCardFactory("shuffl-dataworksheet-pink");
        equals(typeof c5, "function", "retrieved factory pink");
        var c6 = shuffl.getCardFactory("shuffl-dataworksheet-purple");
        equals(typeof c6, "function", "retrieved factory purple");
    });

    test("shuffl.card.dataworksheet.newCard", function () 
    {
        logtest("shuffl.card.dataworksheet.newCard");
        var css = 'stock-yellow';
        var c   = shuffl.card.dataworksheet.newCard("shuffl-dataworksheet-yellow", css, "card-1",
        	{ 'shuffl:tags': 	["card-tag"]
        	, 'shuffl:title':	"card-title"
            , 'shuffl:uri':     "http://example.org/test-uri.csv"
        	, 'shuffl:table':   Test_dataworksheet_DataTable
            , 'shuffl:labels':  Test_dataworksheet_DataLabels
            , 'shuffl:series':  Test_dataworksheet_DataSeries
        	});
        equals(c.attr('id'), "card-1",  "card id attribute");
        ok(c.hasClass('stock-yellow'),  "yellow colour class");
        ok(c.hasClass('shuffl-card-setsize'), "shuffl card setsize class");
        ok(c.hasClass('shuffl-series'), "shuffl card series data class");
        equals(c.attr('class'), 'shuffl-card-setsize shuffl-series stock-yellow ui-resizable', "CSS class");
        equals(c.find("ctitle").text(), "card-title", "card title field");
        equals(c.find("ctags").text(),  "card-tag", "card tags field");
        equals(c.find("curi").text(),   "http://example.org/test-uri.csv", "card URI field");
        equals(c.find("cbody").children().get(0).tagName.toLowerCase(), "table", "card body contains <table>");
        same(c.find("cbody").table()[0], Test_dataworksheet_DataTable[0],    "card data table label row");
        same(c.find("cbody").table().slice(1), Test_dataworksheet_DataTable, "card data table");
        //log.debug("- table :"+jQuery.toJSON(c.find("cbody").table()));
        // Check saved card data
        equals(c.data('shuffl:id'),             "card-1", "layout card id");
        equals(c.data('shuffl:type' ),          "shuffl-dataworksheet-yellow", "saved card type");
        equals(c.data('shuffl:title'),          "card-title", "shuffl:title");
        equals(c.data('shuffl:tags'),           "card-tag", "shuffl:tags");
        equals(c.data('shuffl:uri'),            "http://example.org/test-uri.csv", "shuffl:uri");
        equals(c.data('shuffl:header_row'),     0, "shuffl:header_row");
        equals(c.data('shuffl:data_firstrow'),  1, "shuffl:data_firstrow");
        equals(c.data('shuffl:data_lastrow'),   0, "shuffl:data_lastrow");
        same(c.data('shuffl:table'),  Test_dataworksheet_DataTable,  "shuffl:table");
        same(c.data('shuffl:labels'), Test_dataworksheet_DataLabels, "shuffl:labels");
        same(c.data('shuffl:series'), Test_dataworksheet_DataSeries, "shuffl:series");
        same(c.data('shuffl:axes'),   Test_dataworksheet_DataAxes,   "shuffl:axes");
    });

    test("shuffl.createStockpiles", function () 
    {
        logtest("shuffl.createStockpiles");
        equals(jQuery('#stockbar').children().length, 1, "old stockbar content");
		var s1 = shuffl.createStockpile(
			"stock_1", "stock-yellow", "Y", "shuffl-dataworksheet-yellow");
        var s2 = shuffl.createStockpile(
            "stock_2", "stock-blue", "B", "shuffl-dataworksheet-blue");
        var s3 = shuffl.createStockpile(
            "stock_3", "stock-green", "G", "shuffl-dataworksheet-green");
        var s4 = shuffl.createStockpile(
            "stock_4", "stock-orange", "O", "shuffl-dataworksheet-orange");
        var s5 = shuffl.createStockpile(
            "stock_5", "stock-pink", "P", "shuffl-dataworksheet-pink");
        var s6 = shuffl.createStockpile(
            "stock_6", "stock-purple", "P", "shuffl-dataworksheet-purple");
		equals(jQuery('#stockbar').children().length, 13, "new stockbar content");
		//1
		equals(s1.attr('id'), "stock_1", "stock 1 id");
  	    ok(s1.hasClass("stock-yellow"), "stock 1 class");
  	    equals(s1.text(), "Y", "stock 1 label");
  	    equals(typeof s1.data('makeCard'), "function", "stock 1 function");
  	    equals(s1.data('CardType'), "shuffl-dataworksheet-yellow", "stock 1 type");
  	    //2
        equals(s2.attr('id'), "stock_2", "stock 2 id");
        ok(s2.hasClass("stock-blue"), "stock 2 class");
        equals(s2.text(), "B", "stock 2 label");
        equals(typeof s2.data('makeCard'), "function", "stock 2 function");
        equals(s2.data('CardType'), "shuffl-dataworksheet-blue", "stock 2 type");
        //3
        equals(s3.attr('id'), "stock_3", "stock 3 id");
        ok(s3.hasClass("stock-green"), "stock 3 class");
        equals(s3.text(), "G", "stock 3 label");
        equals(typeof s3.data('makeCard'), "function", "stock 3 function");
        equals(s3.data('CardType'), "shuffl-dataworksheet-green", "stock 3 type");
        //4
        equals(s4.attr('id'), "stock_4", "stock 4 id");
        ok(s4.hasClass("stock-orange"), "stock 4 class");
        equals(s4.text(), "O", "stock 4 label");
        equals(typeof s4.data('makeCard'), "function", "stock 4 function");
        equals(s4.data('CardType'), "shuffl-dataworksheet-orange", "stock 4 type");
        //5
        equals(s5.attr('id'), "stock_5", "stock 5 id");
        ok(s5.hasClass("stock-pink"), "stock 5 class");
        equals(s5.text(), "P", "stock 5 label");
        equals(typeof s5.data('makeCard'), "function", "stock 5 function");
        equals(s5.data('CardType'), "shuffl-dataworksheet-pink", "stock 5 type");
        //6
        equals(s6.attr('id'), "stock_6", "stock 6 id");
        ok(s6.hasClass("stock-purple"), "stock 6 class");
        equals(s6.text(), "P", "stock 6 label");
        equals(typeof s6.data('makeCard'), "function", "stock 6 function");
        equals(s6.data('CardType'), "shuffl-dataworksheet-purple", "stock 6 type");
    });

    test("shuffl.createCardFromStock", function () 
    {
        logtest("shuffl.createCardFromStock");
		var s = shuffl.createStockpile(
		    "stock_id", "stock-green", "stock-label", "shuffl-dataworksheet-green");
		var c = shuffl.createCardFromStock(jQuery("#stock_id"));
        ////log.debug("- card "+shuffl.objectString(c));
		var card_id = shuffl.lastId("card_");
        equals(c.attr('id'), card_id, "card id attribute");
        ok(c.hasClass('shuffl-card'),   "shuffl card class");
        ok(c.hasClass('shuffl-card-setsize'),   "shuffl card setsize class");
        ok(c.hasClass('shuffl-series'), "shuffl card series data class");
        ok(c.hasClass('stock-green'),   "stock-green");
        equals(c.attr('class'), 'shuffl-card-setsize shuffl-series stock-green ui-resizable shuffl-card', "CSS class");
        equals(c.find("ctitle").text(), card_id, "card title field");
        equals(c.find("ctags").text(),  "shuffl-dataworksheet-green", "card tags field");
        equals(c.find("curi").text(),   "(Double-click to edit)", "card URI field");
        equals(c.find("cbody").children().get(0).tagName.toLowerCase(), "table", "card body contains <table>");
        // Check saved card data
        var d = testcarddataworksheet_carddata;
        equals(c.data('shuffl:id'),             card_id, "layout card id");
        equals(c.data('shuffl:type' ),          "shuffl-dataworksheet-green", "saved card type");
        equals(c.data('shuffl:title'),          card_id, "shuffl:title");
        equals(c.data('shuffl:tags'),           "shuffl-dataworksheet-green", "shuffl:tags");
        equals(c.data('shuffl:uri'),            "", "shuffl:uri");
        equals(c.data('shuffl:header_row'),     0, "shuffl:header_row");
        equals(c.data('shuffl:data_firstrow'),  1, "shuffl:data_firstrow");
        equals(c.data('shuffl:data_lastrow'),   0, "shuffl:data_lastrow");
        same(c.data('shuffl:table'),  Default_dataworksheet_DataTable,  "shuffl:table");
        same(c.data('shuffl:labels'), Default_dataworksheet_DataLabels, "shuffl:labels");
        same(c.data('shuffl:series'), Default_dataworksheet_DataSeries, "shuffl:series");
        same(c.data('shuffl:axes'),   Default_dataworksheet_DataAxes,   "shuffl:axes");
        equals(c.data('shuffl:external')['shuffl:id'],          card_id, "card data id");
        equals(c.data('shuffl:external')['shuffl:type'],        "shuffl-dataworksheet-green", "card data class");
        equals(c.data('shuffl:external')['shuffl:version'],     d['shuffl:version'], "card data version");
        equals(c.data('shuffl:external')['shuffl:base-uri'],    d['shuffl:base-uri'], "card data base-uri");
        same(c.data('shuffl:external')['shuffl:uses-prefixes'], d['shuffl:uses-prefixes'], "card data uses-prefixes");
        equals(c.data('shuffl:external')['shuffl:data'],        undefined, "card data");
    });

    test("shuffl.createCardFromData", function () 
    {
        logtest("shuffl.createCardFromData");
        var d = testcarddataworksheet_carddata;
        var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-dataworksheet-orange", d);
        // Check card details
        equals(c.attr('id'), "cardfromdata_id", "card id attribute");
        ok(c.hasClass('shuffl-card'),   "shuffl card type");
        ok(c.hasClass('shuffl-card-setsize'),   "shuffl card setsize class");
        ok(c.hasClass('shuffl-series'), "shuffl card series data class");
        ok(c.hasClass('stock-orange'),  "stock-orange class");
        equals(c.attr('class'), 'shuffl-card-setsize shuffl-series stock-orange ui-resizable shuffl-card', "CSS class");
        equals(c.find("ctitle").text(), "Card N title", "card title field");
        equals(c.find("ctags").text(),  "card_N_tag,footag", "card tags field");
        equals(c.find("curi").text(),   "test-table.csv", "card URI field");
        equals(c.find("cbody").children().get(0).tagName.toLowerCase(), "table", "card body contains <table>");
        same(c.find("cbody").table()[0], Larger_dataworksheet_DataTable[1],    "card data table label row");
        same(c.find("cbody").table().slice(1), Larger_dataworksheet_DataTable, "card data table");
        // Check saved card data
        equals(c.data('shuffl:id'),             "cardfromdata_id", "layout card id");
        equals(c.data('shuffl:type' ),          "shuffl-dataworksheet-orange", "saved card type");
        equals(c.data('shuffl:title'),          "Card N title", "shuffl:title");
        equals(c.data('shuffl:tags'),           "card_N_tag,footag", "shuffl:tags");
        equals(c.data('shuffl:uri'),            "test-table.csv", "shuffl:uri");
        equals(c.data('shuffl:header_row'),     1, "shuffl:header_row");
        equals(c.data('shuffl:data_firstrow'),  2, "shuffl:data_firstrow");
        equals(c.data('shuffl:data_lastrow'),   10, "shuffl:data_lastrow");
        same(c.data('shuffl:table'),  Larger_dataworksheet_DataTable,  "shuffl:table");
        same(c.data('shuffl:labels'), Larger_dataworksheet_DataLabels, "shuffl:labels");
        same(c.data('shuffl:series'), Larger_dataworksheet_DataSeries, "shuffl:series");
        same(c.data('shuffl:axes'),   Larger_dataworksheet_DataAxes,   "shuffl:axes");
        equals(c.data('shuffl:external')['shuffl:id'],          d['shuffl:id'], "card data id");
        equals(c.data('shuffl:external')['shuffl:type'],        d['shuffl:type'], "card data class");
        equals(c.data('shuffl:external')['shuffl:version'],     d['shuffl:version'], "card data version");
        equals(c.data('shuffl:external')['shuffl:base-uri'],    d['shuffl:base-uri'], "card data base-uri");
        same(c.data('shuffl:external')['shuffl:uses-prefixes'], d['shuffl:uses-prefixes'], "card data uses-prefixes");
        same(c.data('shuffl:external')['shuffl:data'],          d['shuffl:data'], "card data");
        same(c.data('shuffl:external'), d, "card data");
    });

    test("shuffl.createDataFromCard", function () 
    {
        logtest("shuffl.createDataFromCard");
        // Create card (copy of code already tested)
        var d = testcarddataworksheet_carddata;
        var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-dataworksheet-pink", d);
        // (Re)create data and test
        var e = shuffl.createDataFromCard(c);
        equals(e['shuffl:id'],          "cardfromdata_id",          'shuffl:id');
        equals(e['shuffl:type'],        "shuffl-dataworksheet-pink", 'shuffl:type' );
        equals(e['shuffl:version'],     d['shuffl:version'],        'shuffl:version');
        equals(e['shuffl:base-uri'],    d['shuffl:base-uri'],       'shuffl:base-uri');
        same(e['shuffl:uses-prefixes'], d['shuffl:uses-prefixes'],  'shuffl:uses-prefixes');
        equals(e['shuffl:data']['shuffl:title'], "Card N title",    'shuffl:data-title');
        same(e['shuffl:data']['shuffl:tags'],    [ 'card_N_tag', 'footag' ], 'shuffl:data-tags');
        same(e['shuffl:data']['shuffl:uri'],     "test-table.csv",  'shuffl:data-uri');
        equals(e['shuffl:data']['shuffl:header_row'],     1,        'shuffl:data-header_row');
        equals(e['shuffl:data']['shuffl:data_firstrow'],  2,        'shuffl:data-data_firstrow');
        equals(e['shuffl:data']['shuffl:data_lastrow'],   10,       'shuffl:data-data_lastrow');
        same(e['shuffl:data']['shuffl:table'],   Larger_dataworksheet_DataTable, 'shuffl:data-table');
    });

    test("shuffl.card.dataworksheet model setting", function () 
    {
        logtest("shuffl.card.dataworksheet model setting");
        // Create card (copy of code already tested)
        var d = testcarddataworksheet_carddata;
        var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-dataworksheet-pink", d);
        var NewDataTable =
            [ [ "row",   "zzz1",  "zzz2",  "zzz3" ]
            , [ "zzz_1", "1.11",  "1.22",  "1.33" ]
            ];
        var NewDataLabels = ["zzz1", "zzz2", "zzz3"];
        var NewDataAxes   = [ ['x1', 'y1'], ['x1', 'y1'], ['x1', 'y1'] ];
        var NewDataSeries =
            [ [ [NaN, 1.11] ]
            , [ [NaN, 1.22] ]
            , [ [NaN, 1.33] ]
            ];
        // Simulate user input: set model to update title, tags and body text
        equals(c.find("ctitle").text(), "Card N title", "card title field");
        equals(c.find("ctags").text(),  "card_N_tag,footag", "card tags field");
        same(c.find("cbody").table()[0], Larger_dataworksheet_DataTable[1],    "card data table label row");
        same(c.find("cbody").table().slice(1), Larger_dataworksheet_DataTable, "card data table");
        c.model("shuffl:title", "Card N updated");
        c.model("shuffl:tags",  "card_N_tag,bartag");
        c.model("shuffl:uri",   "http://example.org/update/uri.csv");
        c.model("shuffl:table", NewDataTable);
        equals(c.data('shuffl:id'),             "cardfromdata_id", "layout card id");
        equals(c.data('shuffl:type' ),          "shuffl-dataworksheet-pink", "saved card type");
        equals(c.data('shuffl:title'),          "Card N updated", "shuffl:title");
        equals(c.data('shuffl:tags'),           "card_N_tag,bartag", "shuffl:tags");
        equals(c.data('shuffl:uri'),            "http://example.org/update/uri.csv", "shuffl:uri");
        equals(c.data('shuffl:header_row'),     0, "shuffl:header_row");
        equals(c.data('shuffl:data_firstrow'),  1, "shuffl:data_firstrow");
        equals(c.data('shuffl:data_lastrow'),   0, "shuffl:data_lastrow");
        same(c.data('shuffl:table'),    NewDataTable,  "shuffl:data-table");
        same(c.data('shuffl:labels'),   NewDataLabels, "shuffl:data-labels");
        same(c.data('shuffl:series'),   NewDataSeries, "shuffl:data-series");
        same(c.data('shuffl:axes'),     NewDataAxes,   "shuffl:axes");
        equals(c.find("ctitle").text(), "Card N updated", "updated title field");
        equals(c.find("ctags").text(),  "card_N_tag,bartag", "updated tags field");
        equals(c.find("curi").text(),   "http://example.org/update/uri.csv", "updated uri field");
        equals(c.find("cbody").text(),  "rowzzz1zzz2zzz3rowzzz1zzz2zzz3zzz_11.111.221.33", "updated data table text");
        same(c.find("cbody").table()[0], NewDataTable[0],    "updated data table label row");
        same(c.find("cbody").table().slice(1), NewDataTable, "updated data table");
    });

    test("shuffl.card.dataworksheet model URI setting", function () 
    {
        logtest("shuffl.card.dataworksheet model URI setting");
        // Create card (copy of code already tested)
        var d = testcarddataworksheet_carddata;
        var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-dataworksheet-pink", d);
        var NewDataTable =
            [ [ "row",   "zzz1", "zzz2", "zzz3" ]
            , [ "zzz_1", "1.11", "1.22", "1.33" ]
            , [ "zzz_2", "2.11", "2.22", "2.33" ]
            , [ "zzz_3", "3.11", "3.22", "3.33" ]
            , [ "zzz_4", "4.11", "4.22", "4.33" ]
            ];
        var NewDataLabels = ["zzz1", "zzz2", "zzz3"];
        var NewDataAxes   = [ ['x1', 'y1'], ['x1', 'y1'], ['x1', 'y1'] ];
        var NewDataSeries =
            [ [ [ NaN, 1.11 ], [ NaN, 2.11 ], [ NaN, 3.11 ], [ NaN, 4.11 ] ]
            , [ [ NaN, 1.22 ], [ NaN, 2.22 ], [ NaN, 3.22 ], [ NaN, 4.22 ] ]
            , [ [ NaN, 1.33 ], [ NaN, 2.33 ], [ NaN, 3.33 ], [ NaN, 4.33 ] ] 
            ];
        // Simulate user input: set model URI - should read data file
        equals(c.find("ctitle").text(), "Card N title", "card title field");
        equals(c.find("ctags").text(),  "card_N_tag,footag", "card tags field");
        equals(c.find("cbody").table().length, 12, "card data table length");
        same(c.find("cbody").table()[0], Larger_dataworksheet_DataTable[1],    "card data table label row");
        same(c.find("cbody").table().slice(1), Larger_dataworksheet_DataTable, "card data table");
        c.model("shuffl:uri", "data/test-csv-table-new.csv");
        c.modelBindExec("shuffl:table",
            function () {
                // Executed immediately
                c.model("shuffl:readcsv", c.model("shuffl:uri"));
            },
            function () {
                // Executed when shuffl:table is updated...
                equals(c.data('shuffl:id'),             "cardfromdata_id", "layout card id");
                equals(c.data('shuffl:type' ),          "shuffl-dataworksheet-pink", "saved card type");
                equals(c.data('shuffl:title'),          "Card N title", "shuffl:title");
                equals(c.data('shuffl:tags'),           "card_N_tag,footag", "shuffl:tags");
                equals(c.data('shuffl:uri'),            "data/test-csv-table-new.csv", "shuffl:uri");
                equals(c.data('shuffl:header_row'),     0, "shuffl:header_row");
                equals(c.data('shuffl:data_firstrow'),  1, "shuffl:data_firstrow");
                equals(c.data('shuffl:data_lastrow'),   0, "shuffl:data_lastrow");
                same(c.data('shuffl:table'),    NewDataTable,  "shuffl:data-table");
                same(c.data('shuffl:labels'),   NewDataLabels, "shuffl:data-labels");
                same(c.data('shuffl:series'),   NewDataSeries, "shuffl:data-series");
                same(c.data('shuffl:axes'),     NewDataAxes,   "shuffl:axes");
                equals(c.find("curi").text(),  "data/test-csv-table-new.csv", "updated uri field");
                equals(c.find("cbody").table().length, 6, "updated data table length");
                same(c.find("cbody").table()[0], NewDataTable[0], "updated data table (0)");
                same(c.find("cbody").table()[1], NewDataTable[0], "updated data table (0)");
                same(c.find("cbody").table()[2], NewDataTable[1], "updated data table (1)");
                equals(c.find("cbody").table()[3][0], "zzz_2", "updated data table (2)");
                equals(c.find("cbody").table()[4][0], "zzz_3", "updated data table (3)");
                equals(c.find("cbody").table()[5][0], "zzz_4", "updated data table (4)");
                start();
            }),
        stop(2000);
    });

    test("shuffl.card.dataworksheet - label row selection", function () 
    {
        logtest("shuffl.card.dataworksheet - label row selection");
        var d = testcarddataworksheet_carddata;
        var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-dataworksheet-orange", d);
        // Check card details
        equals(c.attr('id'), "cardfromdata_id", "card id attribute");
        same(c.find("cbody").table()[0], Larger_dataworksheet_DataTable[1],    "card data table label row");
        same(c.find("cbody").table().slice(1), Larger_dataworksheet_DataTable, "card data table");
        equals(c.data("shuffl:header_row"),    1,   "shuffl:header_row");
        equals(c.data("shuffl:data_firstrow"), 2,   "shuffl:data_firstrow");
        equals(c.data("shuffl:data_lastrow"),  10,  "shuffl:data_lastrow");
        same(c.data('shuffl:table'),  Larger_dataworksheet_DataTable,  "shuffl:table");
        same(c.data('shuffl:labels'), Larger_dataworksheet_DataLabels, "shuffl:labels");
        same(c.data('shuffl:series'), Larger_dataworksheet_DataSeries, "shuffl:series");
        same(c.data('shuffl:axes'),   Larger_dataworksheet_DataAxes,   "shuffl:axes");
        same(c.data('shuffl:external'), d, "card data");
        // Now select label row
        c.model('shuffl:header_row', 2);
        equals(c.data("shuffl:header_row"),    2,   "shuffl:header_row");
        equals(c.data("shuffl:data_firstrow"), 3,   "shuffl:data_firstrow");
        equals(c.data("shuffl:data_lastrow"),  10,  "shuffl:data_lastrow");
        c.model('shuffl:data_firstrow', 2);
        equals(c.data("shuffl:data_firstrow"), 2,   "shuffl:data_firstrow reset");
        same(c.data('shuffl:table'),  Larger_dataworksheet_DataTable,   "shuffl:table");
        same(c.data('shuffl:labels'), Larger_dataworksheet_DataTable[2].slice(1),  "shuffl:labels");
        same(c.data('shuffl:series'), Larger_dataworksheet_DataSeries,  "shuffl:series");
        // (Re)create data and test
        var e = shuffl.createDataFromCard(c);
        equals(e['shuffl:id'],          "cardfromdata_id",    'shuffl:id');
        equals(e['shuffl:data']['shuffl:header_row'],     2,  'shuffl:data-header_row');
        equals(e['shuffl:data']['shuffl:data_firstrow'],  2,  'shuffl:data-data_firstrow');
        equals(e['shuffl:data']['shuffl:data_lastrow'],   10, 'shuffl:data-data_lastrow');
        same(e['shuffl:data']['shuffl:table'],   Larger_dataworksheet_DataTable, 'shuffl:data-table');
    });

    test("shuffl.card.dataworksheet - data row selection", function () 
    {
        logtest("shuffl.card.dataworksheet - data row selection");
        var d = testcarddataworksheet_carddata;
        var c = shuffl.createCardFromData("card_id", "shuffl-dataworksheet-pink", d);
        // Check card details
        equals(c.attr('id'), "card_id", "card id attribute");
        same(c.find("cbody").table()[0], Larger_dataworksheet_DataTable[1],    "card data table label row");
        same(c.find("cbody").table().slice(1), Larger_dataworksheet_DataTable, "card data table");
        equals(c.data("shuffl:header_row"),    1,   "shuffl:header_row");
        equals(c.data("shuffl:data_firstrow"), 2,   "shuffl:data_firstrow");
        equals(c.data("shuffl:data_lastrow"),  10,  "shuffl:data_lastrow");
        same(c.data('shuffl:table'),  Larger_dataworksheet_DataTable,  "shuffl:table");
        same(c.data('shuffl:labels'), Larger_dataworksheet_DataLabels, "shuffl:labels");
        same(c.data('shuffl:series'), Larger_dataworksheet_DataSeries, "shuffl:series");
        same(c.data('shuffl:axes'),   Larger_dataworksheet_DataAxes,   "shuffl:axes");
        // Now select data rows
        c.model('shuffl:data_firstrow', 3);
        c.model('shuffl:data_lastrow',  7);
        equals(c.data("shuffl:header_row"),    1, "shuffl:header_row");
        equals(c.data("shuffl:data_firstrow"), 3, "shuffl:data_firstrow");
        equals(c.data("shuffl:data_lastrow"),  7, "shuffl:data_lastrow");
        same(c.data('shuffl:table'),  Larger_dataworksheet_DataTable,     "shuffl:table");
        same(c.data('shuffl:labels'), Larger_dataworksheet_DataTable[1].slice(1),  "shuffl:labels");
        same(c.data('shuffl:series'), Larger_dataworksheet_DataSeries_2_6, "shuffl:series");
        // (Re)create data and test
        var e = shuffl.createDataFromCard(c);
        equals(e['shuffl:id'],          "card_id",    'shuffl:id');
        equals(e['shuffl:data']['shuffl:header_row'],     1,  'shuffl:data-header_row');
        equals(e['shuffl:data']['shuffl:data_firstrow'],  3,  'shuffl:data-data_firstrow');
        equals(e['shuffl:data']['shuffl:data_lastrow'],   7,  'shuffl:data-data_lastrow');
        same(e['shuffl:data']['shuffl:table'],   Larger_dataworksheet_DataTable, 'shuffl:data-table');
    });

    test("shuffl.card.dataworksheet.rowuse", function ()
    {
        logtest("shuffl.card.dataworksheet.rowuse");
        expect(8);
        // Instantiate mock card
        var c = jQuery("<div/>");
        // Default test
        c.model('shuffl:data_firstrow', -1);
        c.model('shuffl:data_lastrow',  -1);
        var r = shuffl.card.dataworksheet.rowuse(c, Larger_dataworksheet_DataTable);
        equals(r.first,  0, "first (1)");
        equals(r.last,  10, "last  (1)");
        // Set both test
        c.model('shuffl:data_firstrow', 2);
        c.model('shuffl:data_lastrow',  4);
        var r = shuffl.card.dataworksheet.rowuse(c, Larger_dataworksheet_DataTable);
        equals(r.first, 2, "first (2)");
        equals(r.last,  4, "last  (2)");
        // Swap test
        c.model('shuffl:data_firstrow', 4);
        c.model('shuffl:data_lastrow',  2);
        var r = shuffl.card.dataworksheet.rowuse(c, Larger_dataworksheet_DataTable);
        equals(r.first, 2, "first (3)");
        equals(r.last,  4, "last  (3)");
        // Range test
        c.model('shuffl:data_firstrow', 200);
        c.model('shuffl:data_lastrow',  100);
        var r = shuffl.card.dataworksheet.rowuse(c, Larger_dataworksheet_DataTable);
        equals(r.first,  0, "first (4)");
        equals(r.last,  10, "last  (4)");
    });

    test("shuffl.card.dataworksheet.coluse", function ()
    {
        logtest("shuffl.card.dataworksheet.coluse");
        expect(16);
        // Instantiate mock card
        var c = jQuery("<div/>");
        // Default test
        c.model('shuffl:coluse', undefined);
        var h  = ["x1", "y1a", "y1b", "y1c", "y1d"];
        var cu = shuffl.card.dataworksheet.coluse(c, h);
        equals(cu.length,  5,    "length (1)");
        equals(cu[0].axis, 'x1', "[0]:x1 (1)");
        equals(cu[1].axis, 'y1', "[1]:y1 (1)");
        equals(cu[2].axis, 'y1', "[2]:y1 (1)");
        equals(cu[3].axis, 'y1', "[3]:y1 (1)");
        equals(cu[4].axis, 'y1', "[4]:y1 (1)");
        // Explicit value test
        c.model('shuffl:coluse', [{axis:'y1'},{},{axis:'x1'},{axis:'y1'}]);
        var h  = ["x1", "y1a", "y1b", "y1c", "y1d"];
        var cu = shuffl.card.dataworksheet.coluse(c, h);
        equals(cu.length,  4,         "length (2)");
        equals(cu[0].axis, 'y1',      "[0]:y1 (2)");
        equals(cu[1].axis, undefined, "[1]:-- (2)");
        equals(cu[2].axis, 'x1',      "[2]:x1 (2)");
        equals(cu[3].axis, 'y1',      "[3]:y1 (2)");
        // Blank label test
        c.model('shuffl:coluse', undefined);
        var h  = ["y1", "", "x1", "y1"];
        var cu = shuffl.card.dataworksheet.coluse(c, h);
        equals(cu.length,  4,         "length (3)");
        equals(cu[0].axis, 'y1',      "[0]:y1 (3)");
        equals(cu[1].axis, undefined, "[1]:-- (3)");
        equals(cu[2].axis, 'x1',      "[2]:x1 (3)");
        equals(cu[3].axis, 'y1',      "[3]:y1 (3)");
    });

    test("shuffl.card.dataworksheet.dataplot", function ()
    {
        logtest("shuffl.card.dataworksheet.dataplot");
        expect(8);
        // Instantiate mock card
        var c = jQuery("<div/>");
        // Simple test
        var cu = 
            [ {axis:'x1'}
            , {axis:'y1'}
            , {axis:'y1'}
            , {axis:'y1'}
            , {axis:'y1'} 
            ];
        var dp = shuffl.card.dataworksheet.dataplot(c, cu);
        equals(dp.length,  4, "length (1)");
        same(dp[0], { "xcol": 0, "ycol": 1, "xaxis": "x1", "yaxis": "y1" }, "dataplot[0] (1)");
        same(dp[1], { "xcol": 0, "ycol": 2, "xaxis": "x1", "yaxis": "y1" }, "dataplot[1] (1)");
        same(dp[2], { "xcol": 0, "ycol": 3, "xaxis": "x1", "yaxis": "y1" }, "dataplot[2] (1)");
        same(dp[3], { "xcol": 0, "ycol": 4, "xaxis": "x1", "yaxis": "y1" }, "dataplot[3] (1)");
        // Out-of-order and null value test
        var cu = 
            [ {axis:'y1'}
            , {}
            , {axis:'x1'}
            , {axis:'y1'}
            ];
        var dp = shuffl.card.dataworksheet.dataplot(c, cu);
        equals(dp.length,  2, "length (2)");
        same(dp[0], { "xcol": 2, "ycol": 0, "xaxis": "x1", "yaxis": "y1" }, "dataplot[0] (2)");
        same(dp[1], { "xcol": 2, "ycol": 3, "xaxis": "x1", "yaxis": "y1" }, "dataplot[1] (2)");
    });

    test("shuffl.card.dataworksheet.highlightData", function ()
    {
        logtest("shuffl.card.dataworksheet.highlightData");
        expect(13);
        var cb_html =
            "    <cbody class='shuffl-nodrag'>\n"+
            "      <table>\n"+
            "        <tr></tr>\n"+
            "        <tr><td></td><td>col1</td><td>col2</td><td>col3</td></tr>\n"+
            "        <tr><td>row1</td><td>1.1</td><td>1.2</td><td>1.3</td></tr>\n"+
            "        <tr><td>row1</td><td>2.1</td><td>2.2</td><td>2.3</td></tr>\n"+
            "        <tr><td>End.</td></tr>\n"+
            "      </table>\n"+
            "    </cbody>\n";
        var cb = jQuery(cb_html);
        var dr = {first:2, last:3};
        var cu = 
            [ {axis:undefined}
            , {axis:'y1'}
            , {axis:'x1'}
            , {axis:'y1'}
            ];
        shuffl.card.dataworksheet.highlightData(cb, dr, cu);
        equals(cb.find("tr").eq(0).hasClass("shuffl-deselected"), true,  "Row 0 deselected");
        equals(cb.find("tr").eq(1).hasClass("shuffl-deselected"), true,  "Row 1 deselected");
        equals(cb.find("tr").eq(2).hasClass("shuffl-deselected"), false, "Row 2 selected");
        equals(cb.find("tr").eq(3).hasClass("shuffl-deselected"), false, "Row 3 selected");
        equals(cb.find("tr").eq(4).hasClass("shuffl-deselected"), true,  "Row 4 deselected");
        equals(cb.find("tr").eq(2).find("td").eq(0).hasClass("shuffl-deselected"), true,  "Row 2/Col 0 deselected");
        equals(cb.find("tr").eq(2).find("td").eq(1).hasClass("shuffl-deselected"), false, "Row 2/Col 1 selected");
        equals(cb.find("tr").eq(2).find("td").eq(2).hasClass("shuffl-deselected"), false, "Row 2/Col 2 selected");
        equals(cb.find("tr").eq(2).find("td").eq(3).hasClass("shuffl-deselected"), false, "Row 2/Col 3 selected");
        equals(cb.find("tr").eq(3).find("td").eq(0).hasClass("shuffl-deselected"), true,  "Row 3/Col 0 deselected");
        equals(cb.find("tr").eq(3).find("td").eq(1).hasClass("shuffl-deselected"), false, "Row 3/Col 1 selected");
        equals(cb.find("tr").eq(3).find("td").eq(2).hasClass("shuffl-deselected"), false, "Row 3/Col 2 selected");
        equals(cb.find("tr").eq(3).find("td").eq(3).hasClass("shuffl-deselected"), false, "Row 3/Col 3 selected");
    });

    test("shuffl.card.dataworksheet modelSetSeries", function ()
    {
        logtest("shuffl.card.dataworksheet modelSetSeries");
        expect(20);
        // Instantiate card
        var d = testcarddataworksheet_carddata;
        var c = shuffl.createCardFromData("card_id", "shuffl-dataworksheet-pink", d);
        equals(c.data("shuffl:header_row"),    1,   "shuffl:header_row");
        equals(c.data("shuffl:data_firstrow"), 2,   "shuffl:data_firstrow");
        equals(c.data("shuffl:data_lastrow"),  10,  "shuffl:data_lastrow");
        same(c.data('shuffl:table'),  Larger_dataworksheet_DataTable,  "shuffl:table");
        same(c.data('shuffl:labels'), Larger_dataworksheet_DataLabels, "shuffl:labels");
        same(c.data('shuffl:series'), Larger_dataworksheet_DataSeries, "shuffl:series");
        same(c.data('shuffl:axes'),   Larger_dataworksheet_DataAxes,   "shuffl:axes");
        // Set up rows
        c.model('shuffl:data_firstrow', -1);
        c.model('shuffl:data_lastrow',  -1);
        var datarows = shuffl.card.dataworksheet.rowuse(c, Larger_dataworksheet_DataTable);
        equals(datarows.first,  0, "first (1)");
        equals(datarows.last,  10, "last  (1)");
        c.model("shuffl:header_row", 1);
        c.model('shuffl:data_lastrow',  9);
        var headerrow = c.model("shuffl:header_row");
        datarows = shuffl.card.dataworksheet.rowuse(c, Larger_dataworksheet_DataTable);
        equals(headerrow,      1, "header (2)");
        equals(datarows.first, 2, "first  (2)");
        equals(datarows.last,  9, "last   (2)");
        // Set up columns using explicit values
        c.model('shuffl:coluse', [{axis:'y1'},{},{axis:'x1'},{axis:'y2'}]);
        var h  = ["y1", "aa", "x1", "y2", "bb"];
        var coluse = shuffl.card.dataworksheet.coluse(c, h);
        equals(coluse.length,  4,         "length (3)");
        equals(coluse[0].axis, 'y1',      "[0]:y1 (3)");
        equals(coluse[1].axis, undefined, "[1]:-- (3)");
        equals(coluse[2].axis, 'x1',      "[2]:x1 (3)");
        equals(coluse[3].axis, 'y2',      "[3]:y2 (3)");
        // Set model series
        var dataplot = shuffl.card.dataworksheet.dataplot(c, coluse);
        var options =
            { labelrow:   headerrow
            , firstrow:   datarows.first
            , lastrow:    datarows.last
            , datacols:   dataplot
            , setaxes:    'shuffl:axes'
            , setlabels:  'shuffl:labels'
            , setseries:  'shuffl:series'
            };
        shuffl.modelSetSeries(c, options)(null, {newval: Larger_dataworksheet_DataTable});
        // [ "x", "col1", "col2", "col3", "col4_is_much_wider", "col5" ]
        same(c.data("shuffl:labels"), Larger_dataworksheet_DataLabels_x1_y1_y2, "shuffl:labels (4)");
        same(c.data("shuffl:axes"),   Larger_dataworksheet_DataAxes_x1_y1_y2,   "shuffl:axes (4)");
        same(c.data("shuffl:series"), Larger_dataworksheet_DataSeries_x1_y1_y2, "shuffl:series (4)");
    });

    test("shuffl.card.dataworksheet.setColumnUse", function ()
    {
        logtest("shuffl.card.dataworksheet.setColumnUse");
        // Instantiate card
        var d = testcarddataworksheet_carddata;
        var c = shuffl.createCardFromData("card_id", "shuffl-dataworksheet-pink", d);
        var h  = ["c1", "c2", "c3", "c4"];
        var coluse = shuffl.card.dataworksheet.coluse(c, h);
        // Check data
        equals(c.data("shuffl:header_row"),    1,   "shuffl:header_row");
        equals(c.data("shuffl:data_firstrow"), 2,   "shuffl:data_firstrow");
        equals(c.data("shuffl:data_lastrow"),  10,  "shuffl:data_lastrow");
        same(c.data('shuffl:labels'), Larger_dataworksheet_DataLabels, "shuffl:labels");
        same(c.data('shuffl:axes'),   Larger_dataworksheet_DataAxes,   "shuffl:axes");
        // Check default column use
        equals(coluse.length,  4,         "length (1)");
        equals(coluse[0].axis, 'x1',      "[0]:x1 (1)");
        equals(coluse[1].axis, 'y1',      "[1]:y1 (1)");
        equals(coluse[2].axis, 'y1',      "[2]:y1 (1)");
        equals(coluse[3].axis, 'y1',      "[3]:y1 (1)");
        // Check model value
        same(c.data('shuffl:coluse'), [], "shuffl:coluse (1)");

        // Update column-use value for column 1
        c.data('colnum', 1);
        shuffl.card.dataworksheet.setColumnUse(c, { axis: 'x1' });
        // Check column use
        // (Note value swap with old 'x1' column)
        coluse = shuffl.card.dataworksheet.coluse(c, h);
        equals(coluse.length,  6,         "length (2)");
        equals(coluse[0].axis, 'y1',      "[0]:y1 (2)");
        equals(coluse[1].axis, 'x1',      "[1]:x1 (2)");
        equals(coluse[2].axis, 'y1',      "[2]:y1 (2)");
        equals(coluse[3].axis, 'y1',      "[3]:y1 (2)");
        equals(coluse[4].axis, 'y1',      "[4]:y1 (2)");
        equals(coluse[5].axis, 'y1',      "[5]:y1 (2)");
        // Check model value
        same(c.data('shuffl:coluse'), coluse, "shuffl:coluse (2)");

        // Add new column
        c.data('colnum', 7);
        shuffl.card.dataworksheet.setColumnUse(c, { axis: 'x1' });
        coluse = shuffl.card.dataworksheet.coluse(c, h);
        equals(coluse.length,  8,         "length (3)");
        equals(coluse[0].axis, 'y1',      "[0]:y1 (3)");
        equals(coluse[1].axis, undefined, "[1]:-- (3)");
        equals(coluse[2].axis, 'y1',      "[2]:y1 (3)");
        equals(coluse[3].axis, 'y1',      "[3]:y1 (3)");
        equals(coluse[4].axis, 'y1',      "[4]:y1 (3)");
        equals(coluse[5].axis, 'y1',      "[5]:y1 (3)");
        equals(coluse[6].axis, undefined, "[6]:-- (3)");
        equals(coluse[7].axis, 'x1',      "[7]:x1 (3)");
        // Check model value
        same(c.data('shuffl:coluse'), coluse, "shuffl:coluse (3)");

        // Set existing x1-axis to 'y2'
        c.data('colnum', 7);
        shuffl.card.dataworksheet.setColumnUse(c, { axis: 'y2' });
        coluse = shuffl.card.dataworksheet.coluse(c, h);
        equals(coluse.length,  8,         "length (4)");
        equals(coluse[0].axis, 'x1',      "[0]:x1 (4)");
        equals(coluse[1].axis, undefined, "[1]:-- (4)");
        equals(coluse[2].axis, 'y1',      "[2]:y1 (4)");
        equals(coluse[3].axis, 'y1',      "[3]:y1 (4)");
        equals(coluse[4].axis, 'y1',      "[4]:y1 (4)");
        equals(coluse[5].axis, 'y1',      "[5]:y1 (4)");
        equals(coluse[6].axis, undefined, "[6]:-- (4)");
        equals(coluse[7].axis, 'y2',      "[7]:y2 (4)");
        // Check model value
        same(c.data('shuffl:coluse'), coluse, "shuffl:coluse (4)");

        // Set existing x1-axis to 'x2'
        c.data('colnum', 0);
        shuffl.card.dataworksheet.setColumnUse(c, { axis: 'x2' });
        coluse = shuffl.card.dataworksheet.coluse(c, h);
        equals(coluse.length,  8,         "length (5)");
        equals(coluse[0].axis, 'x2',      "[0]:x2 (5)");
        equals(coluse[1].axis, undefined, "[1]:-- (5)");
        equals(coluse[2].axis, 'x1',      "[2]:x1 (5)");
        equals(coluse[3].axis, 'y1',      "[3]:y1 (5)");
        equals(coluse[4].axis, 'y1',      "[4]:y1 (5)");
        equals(coluse[5].axis, 'y1',      "[5]:y1 (5)");
        equals(coluse[6].axis, undefined, "[6]:-- (5)");
        equals(coluse[7].axis, 'y2',      "[7]:y2 (5)");
        // Check model value
        same(c.data('shuffl:coluse'), coluse, "shuffl:coluse (5)");
    });

};

// End
