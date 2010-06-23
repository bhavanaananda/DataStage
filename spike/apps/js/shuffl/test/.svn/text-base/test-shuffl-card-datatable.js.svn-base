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

var TestDataTable =
    [ [ "",      "col1",  "col2",  "col3" ]
    , [ "row_1", "1.11",  "1.22",  "1.33" ]
    , [ "row_2", "2.11",  "2.22",  "2.33" ]
    , [ "End." ]
    ];

var TestDataLabels = ["col1",  "col2",  "col3"];

var TestDataSeries =
    [ [ [NaN, 1.11], [NaN, 2.11], [NaN, NaN] ]
    , [ [NaN, 1.22], [NaN, 2.22], [NaN, NaN] ]
    , [ [NaN, 1.33], [NaN, 2.33], [NaN, NaN] ]
    ];

/**
 * Default model values
 * 
 * TODO: revert to undefined when testing is done
 */
var DefaultDataTable  = undefined;

var DefaultDataLabels = undefined;

var DefaultDataSeries = undefined;

DefaultDataTable =
    [ [ "", "col1", "col2", "col3", "col4_is_much_wider", "col5" ]
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
  
DefaultDataLabels = [ "col1", "col2", "col3", "col4_is_much_wider", "col5" ];

DefaultDataSeries =
    [ [ [ 1, 1.1 ], [ 2, 2.1 ], [ 3, 3.1 ], [ 4, 4.1 ], [ 5, 5.1 ], [ 6, 6.1 ], [ 7, 7.1 ], [ 8, 8.1 ], [ NaN, NaN ] ]
    , [ [ 1, 1.2 ], [ 2, 2.2 ], [ 3, 3.2 ], [ 4, 4.2 ], [ 5, 5.2 ], [ 6, 6.2 ], [ 7, 7.2 ], [ 8, 8.2 ], [ NaN, NaN ] ]
    , [ [ 1, 1.3 ], [ 2, 2.3 ], [ 3, 3.3 ], [ 4, 4.3 ], [ 5, 5.3 ], [ 6, 6.3 ], [ 7, 7.3 ], [ 8, 8.3 ], [ NaN, NaN ] ]
    , [ [ 1, 1.4 ], [ 2, 2.4 ], [ 3, 3.4 ], [ 4, 4.4 ], [ 5, 5.4 ], [ 6, 6.4 ], [ 7, 7.4 ], [ 8, 8.4 ], [ NaN, NaN ] ]
    , [ [ 1, 1.5 ], [ 2, 2.5 ], [ 3, 3.5 ], [ 4, 4.5 ], [ 5, 5.5 ], [ 6, 6.5 ], [ 7, 7.5 ], [ 8, 8.5 ], [ NaN, NaN ] ]
    ];

/**
 * Data
 */
var testcarddatatable_carddata = 
    { 'shuffl:id':        'card_N'
    , 'shuffl:type':      'shuffl-datatable-ZZZZZZ'
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
      { 'shuffl:title':   "Card N title"
      , 'shuffl:tags':    [ 'card_N_tag', 'footag' ]
      , 'shuffl:uri':     "test-table.csv"
      , 'shuffl:table':   TestDataTable
      , 'shuffl:labels':  TestDataLabels
      , 'shuffl:series':  TestDataSeries
      }
    };

/**
 * Function to register tests
 */

TestCardDatatable = function() {

    module("TestCardDatatable");

    test("shuffl.addCardFactories",
        function () {
            logtest("TestCardDatatable: shuffl.addCardFactories");
            // Card factories are created when shuffl-card-datatable module is loaded
            equals(shuffl.CardFactoryMap['shuffl-datatable-yellow'].cardcss, "stock-yellow", "shuffl-datatable-yellow");
            equals(shuffl.CardFactoryMap['shuffl-datatable-blue'  ].cardcss, "stock-blue",   "shuffl-datatable-blue");
            equals(shuffl.CardFactoryMap['shuffl-datatable-green' ].cardcss, "stock-green",  "shuffl-datatable-green");
            equals(shuffl.CardFactoryMap['shuffl-datatable-orange'].cardcss, "stock-orange", "shuffl-datatable-orange");
            equals(shuffl.CardFactoryMap['shuffl-datatable-pink'  ].cardcss, "stock-pink",   "shuffl-datatable-pink");
            equals(shuffl.CardFactoryMap['shuffl-datatable-purple'].cardcss, "stock-purple", "shuffl-datatable-purple");
        });
    
    test("shuffl.getCardFactories",
        function () {
            logtest("TestCardDatatable: shuffl.getCardFactories");
            var c0 = shuffl.getCardFactory("default-type");
            equals(typeof c0, "function", "default factory");
            var c1 = shuffl.getCardFactory("shuffl-datatable-yellow");
            equals(typeof c1, "function", "retrieved factory yellow");
            var c2 = shuffl.getCardFactory("shuffl-datatable-blue");
            equals(typeof c2, "function", "retrieved factory blue");
            var c3 = shuffl.getCardFactory("shuffl-datatable-green");
            equals(typeof c3, "function", "retrieved factory green");
            var c4 = shuffl.getCardFactory("shuffl-datatable-orange");
            equals(typeof c4, "function", "retrieved factory orange");
            var c5 = shuffl.getCardFactory("shuffl-datatable-pink");
            equals(typeof c5, "function", "retrieved factory pink");
            var c6 = shuffl.getCardFactory("shuffl-datatable-purple");
            equals(typeof c6, "function", "retrieved factory purple");
        });

    test("shuffl.card.datatable.newCard",
        function () {
            logtest("TestCardDatatable: shuffl.card.datatable.newCard");
            var css = 'stock-yellow';
            var c   = shuffl.card.datatable.newCard("shuffl-datatable-yellow", css, "card-1",
              	{ 'shuffl:tags': 	["card-tag"]
              	, 'shuffl:title':	"card-title"
                  , 'shuffl:uri':     "http://example.org/test-uri.csv"
              	, 'shuffl:table':   TestDataTable
                  , 'shuffl:labels':  TestDataLabels
                  , 'shuffl:series':  TestDataSeries
              	});
            equals(c.attr('id'), "card-1",  "card id attribute");
            ok(c.hasClass('stock-yellow'),  "yellow colour class");
            ok(c.hasClass('shuffl-card-setsize'), "shuffl card setsize class");
            ok(c.hasClass('shuffl-series'), "shuffl card series data class");
            equals(c.attr('class'), 'shuffl-card-setsize shuffl-series stock-yellow ui-resizable', "CSS class");
            equals(c.find("cident").text(), "card-1", "card id field");
            equals(c.find("cclass").text(), "shuffl-datatable-yellow", "card class field");
            equals(c.find("ctitle").text(), "card-title", "card title field");
            equals(c.find("ctags").text(),  "card-tag", "card tags field");
            equals(c.find("curi").text(),   "http://example.org/test-uri.csv", "card URI field");
            equals(c.find("cbody").children().get(0).tagName.toLowerCase(), "table", "card body contains <table>");
            same(c.find("cbody").table(),   TestDataTable, "card data table");
            //log.debug("- table :"+jQuery.toJSON(c.find("cbody").table()));
        });

    test("shuffl.createStockpiles",
        function () {
            logtest("TestCardDatatable: shuffl.createStockpiles");
            equals(jQuery('#stockbar').children().length, 1, "old stockbar content");
            var s1 = shuffl.createStockpile(
                "stock_1", "stock-yellow", "Y", "shuffl-datatable-yellow");
            var s2 = shuffl.createStockpile(
                "stock_2", "stock-blue", "B", "shuffl-datatable-blue");
            var s3 = shuffl.createStockpile(
                "stock_3", "stock-green", "G", "shuffl-datatable-green");
            var s4 = shuffl.createStockpile(
                "stock_4", "stock-orange", "O", "shuffl-datatable-orange");
            var s5 = shuffl.createStockpile(
                "stock_5", "stock-pink", "P", "shuffl-datatable-pink");
            var s6 = shuffl.createStockpile(
                "stock_6", "stock-purple", "P", "shuffl-datatable-purple");
            equals(jQuery('#stockbar').children().length, 13, "new stockbar content");
            //1
            equals(s1.attr('id'), "stock_1", "stock 1 id");
            ok(s1.hasClass("stock-yellow"), "stock 1 class");
            equals(s1.text(), "Y", "stock 1 label");
            equals(typeof s1.data('makeCard'), "function", "stock 1 function");
            equals(s1.data('CardType'), "shuffl-datatable-yellow", "stock 1 type");
            //2
            equals(s2.attr('id'), "stock_2", "stock 2 id");
            ok(s2.hasClass("stock-blue"), "stock 2 class");
            equals(s2.text(), "B", "stock 2 label");
            equals(typeof s2.data('makeCard'), "function", "stock 2 function");
            equals(s2.data('CardType'), "shuffl-datatable-blue", "stock 2 type");
            //3
            equals(s3.attr('id'), "stock_3", "stock 3 id");
            ok(s3.hasClass("stock-green"), "stock 3 class");
            equals(s3.text(), "G", "stock 3 label");
            equals(typeof s3.data('makeCard'), "function", "stock 3 function");
            equals(s3.data('CardType'), "shuffl-datatable-green", "stock 3 type");
            //4
            equals(s4.attr('id'), "stock_4", "stock 4 id");
            ok(s4.hasClass("stock-orange"), "stock 4 class");
            equals(s4.text(), "O", "stock 4 label");
            equals(typeof s4.data('makeCard'), "function", "stock 4 function");
            equals(s4.data('CardType'), "shuffl-datatable-orange", "stock 4 type");
            //5
            equals(s5.attr('id'), "stock_5", "stock 5 id");
            ok(s5.hasClass("stock-pink"), "stock 5 class");
            equals(s5.text(), "P", "stock 5 label");
            equals(typeof s5.data('makeCard'), "function", "stock 5 function");
            equals(s5.data('CardType'), "shuffl-datatable-pink", "stock 5 type");
            //6
            equals(s6.attr('id'), "stock_6", "stock 6 id");
            ok(s6.hasClass("stock-purple"), "stock 6 class");
            equals(s6.text(), "P", "stock 6 label");
            equals(typeof s6.data('makeCard'), "function", "stock 6 function");
            equals(s6.data('CardType'), "shuffl-datatable-purple", "stock 6 type");
    });

    test("shuffl.createCardFromStock",
        function () {
            logtest("TestCardDatatable: shuffl.createCardFromStock");
            var s = shuffl.createStockpile(
                "stock_id", "stock-green", "stock-label", "shuffl-datatable-green");
            var c = shuffl.createCardFromStock(jQuery("#stock_id"));
            ////log.debug("- card "+shuffl.objectString(c));
            var card_id = shuffl.lastId("card_");
            equals(c.attr('id'), card_id, "card id attribute");
            ok(c.hasClass('shuffl-card'),   "shuffl card class");
            ok(c.hasClass('shuffl-card-setsize'),   "shuffl card setsize class");
            ok(c.hasClass('shuffl-series'), "shuffl card series data class");
            ok(c.hasClass('stock-green'),   "stock-green");
            equals(c.attr('class'), 'shuffl-card-setsize shuffl-series stock-green ui-resizable shuffl-card', "CSS class");
            equals(c.find("cident").text(), card_id, "card id field");
            equals(c.find("cclass").text(), "shuffl-datatable-green", "card type");
            equals(c.find("ctitle").text(), card_id, "card title field");
            equals(c.find("ctags").text(),  "shuffl-datatable-green", "card tags field");
            equals(c.find("curi").text(),   "(Double-click to edit)", "card URI field");
            equals(c.find("cbody").children().get(0).tagName.toLowerCase(), "table", "card body contains <table>");
            // Check saved card data
            var d = testcarddatatable_carddata;
            equals(c.data('shuffl:id'),    card_id, "layout card id");
            equals(c.data('shuffl:type' ), "shuffl-datatable-green", "saved card type");
            same(c.data('shuffl:table'),  DefaultDataTable,  "shuffl:table");
            same(c.data('shuffl:labels'), DefaultDataLabels, "shuffl:labels");
            same(c.data('shuffl:series'), DefaultDataSeries, "shuffl:series");
            equals(c.data('shuffl:external')['shuffl:id'],          card_id, "card data id");
            equals(c.data('shuffl:external')['shuffl:type'],        "shuffl-datatable-green", "card data class");
            equals(c.data('shuffl:external')['shuffl:version'],     d['shuffl:version'], "card data version");
            equals(c.data('shuffl:external')['shuffl:base-uri'],    d['shuffl:base-uri'], "card data base-uri");
            same(c.data('shuffl:external')['shuffl:uses-prefixes'], d['shuffl:uses-prefixes'], "card data uses-prefixes");
            equals(c.data('shuffl:external')['shuffl:data'],        undefined, "card data");
        });

    test("shuffl.createCardFromData",
        function () {
            logtest("TestCardDatatable: shuffl.createCardFromData");
            var d = testcarddatatable_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-datatable-orange", d);
            // Check card details
            equals(c.attr('id'), "cardfromdata_id", "card id attribute");
            ok(c.hasClass('shuffl-card'),   "shuffl card type");
            ok(c.hasClass('shuffl-card-setsize'),   "shuffl card setsize class");
            ok(c.hasClass('shuffl-series'), "shuffl card series data class");
            ok(c.hasClass('stock-orange'),  "stock-orange class");
            equals(c.attr('class'), 'shuffl-card-setsize shuffl-series stock-orange ui-resizable shuffl-card', "CSS class");
            equals(c.find("cident").text(), "cardfromdata_id", "card id field");
            equals(c.find("cclass").text(), "shuffl-datatable-orange", "card class field");
            equals(c.find("ctitle").text(), "Card N title", "card title field");
            equals(c.find("ctags").text(),  "card_N_tag,footag", "card tags field");
            equals(c.find("curi").text(),   "test-table.csv", "card URI field");
            equals(c.find("cbody").children().get(0).tagName.toLowerCase(), "table", "card body contains <table>");
            same(c.find("cbody").table(), TestDataTable, "card data table");
            same(c.data('shuffl:table'),  TestDataTable,  "shuffl:table");
            same(c.data('shuffl:labels'), TestDataLabels, "shuffl:labels");
            same(c.data('shuffl:series'), TestDataSeries, "shuffl:series");
            same(c.data('shuffl:external'), d, "card data");
        });

    test("shuffl.createDataFromCard",
        function () {
            logtest("TestCardDatatable: shuffl.createDataFromCard");
            // Create card (copy of code already tested)
            var d = testcarddatatable_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-datatable-pink", d);
            // (Re)create data and test
            var e = shuffl.createDataFromCard(c);
            equals(e['shuffl:id'],          "cardfromdata_id",         'shuffl:id');
            equals(e['shuffl:type'],        "shuffl-datatable-pink",    'shuffl:type' );
            equals(e['shuffl:version'],     d['shuffl:version'],       'shuffl:version');
            equals(e['shuffl:base-uri'],    d['shuffl:base-uri'],      'shuffl:base-uri');
            same(e['shuffl:uses-prefixes'], d['shuffl:uses-prefixes'], 'shuffl:uses-prefixes');
            equals(e['shuffl:data']['shuffl:title'], "Card N title",   'shuffl:data-title');
            same(e['shuffl:data']['shuffl:tags'],    [ 'card_N_tag', 'footag' ], 'shuffl:data-tags');
            same(e['shuffl:data']['shuffl:uri'],     "test-table.csv", 'shuffl:data-uri');
            same(e['shuffl:data']['shuffl:table'],   TestDataTable,    'shuffl:data-table');
        });

    test("shuffl.card.datatable model setting",
        function () {
            logtest("TestCardDatatable: shuffl.card.datatable model setting");
            // Create card (copy of code already tested)
            var d = testcarddatatable_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-datatable-pink", d);
            var NewDataTable =
                [ [ "",      "zzz1",  "zzz2",  "zzz3" ]
                , [ "zzz_1", "1.11",  "1.22",  "1.33" ]
                ];
            var NewDataLabels = ["zzz1", "zzz2", "zzz3"];
            var NewDataSeries =
                [ [ [NaN, 1.11] ]
                , [ [NaN, 1.22] ]
                , [ [NaN, 1.33] ]
                ];
            // Simulate user input: set model to update title, tags and body text
            equals(c.find("ctitle").text(), "Card N title", "card title field");
            equals(c.find("ctags").text(),  "card_N_tag,footag", "card tags field");
            equals(c.find("cbody").text(),  "col1col2col3row_11.111.221.33row_22.112.222.33End.", "card data table text");
            same(c.find("cbody").table(), TestDataTable, "card data table");
            c.model("shuffl:title", "Card N updated");
            c.model("shuffl:tags",  "card_N_tag,bartag");
            c.model("shuffl:uri",   "http://example.org/update/uri.csv");
            c.model("shuffl:table", NewDataTable);
            same(c.data('shuffl:table'),    NewDataTable,  'shuffl:data-table');
            same(c.data('shuffl:labels'),   NewDataLabels, 'shuffl:data-labels');
            same(c.data('shuffl:series'),   NewDataSeries, 'shuffl:data-series');
            equals(c.find("ctitle").text(), "Card N updated", "updated title field");
            equals(c.find("ctags").text(),  "card_N_tag,bartag", "updated tags field");
            equals(c.find("curi").text(),   "http://example.org/update/uri.csv", "updated uri field");
            equals(c.find("cbody").text(),  "zzz1zzz2zzz3zzz_11.111.221.33", "updated data table text");
            same(c.find("cbody").table(), NewDataTable, "updated data table");
        });

    test("shuffl.card.datatable model URI setting",
        function () {
            logtest("TestCardDatatable: shuffl.card.datatable model URI setting");
            // Create card (copy of code already tested)
            var d = testcarddatatable_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-datatable-pink", d);
            var NewDataTable =
                [ [ "row",   "zzz1", "zzz2", "zzz3" ]
                , [ "zzz_1", "1.11", "1.22", "1.33" ]
                , [ "zzz_2", "2.11", "2.22", "2.33" ]
                , [ "zzz_3", "3.11", "3.22", "3.33" ]
                , [ "zzz_4", "4.11", "4.22", "4.33" ]
                ];
            var NewDataLabels = ["zzz1", "zzz2", "zzz3"];
            var NewDataSeries =
                [ [ [ NaN, 1.11 ], [ NaN, 2.11 ], [ NaN, 3.11 ], [ NaN, 4.11 ] ]
                , [ [ NaN, 1.22 ], [ NaN, 2.22 ], [ NaN, 3.22 ], [ NaN, 4.22 ] ]
                , [ [ NaN, 1.33 ], [ NaN, 2.33 ], [ NaN, 3.33 ], [ NaN, 4.33 ] ] 
                ];
            // Simulate user input: set model URI - should read data file
            equals(c.find("ctitle").text(), "Card N title", "card title field");
            equals(c.find("ctags").text(),  "card_N_tag,footag", "card tags field");
            equals(c.find("cbody").text(),  "col1col2col3row_11.111.221.33row_22.112.222.33End.", "card data table text");
            equals(c.find("cbody").table().length, 4, "card data table length");
            same(c.find("cbody").table(), TestDataTable, "card data table");
            c.model("shuffl:uri", "data/test-csv-table-new.csv");
            c.modelBindExec("shuffl:table",
                function () {
                    // Executed immediately
                    c.model("shuffl:readcsv", c.model("shuffl:uri"));
                },
                function () {
                    // Executed when shuffl:table is updated...
                    same(c.data('shuffl:table'),   NewDataTable,  'shuffl:data-table');
                    same(c.data('shuffl:labels'),  NewDataLabels, 'shuffl:data-labels');
                    same(c.data('shuffl:series'),  NewDataSeries, 'shuffl:data-series');
                    equals(c.find("curi").text(),  "data/test-csv-table-new.csv", "updated uri field");
                    equals(c.find("cbody").table().length, 5, "updated data table length");
                    same(c.find("cbody").table()[0], NewDataTable[0], "updated data table (0)");
                    same(c.find("cbody").table()[1], NewDataTable[1], "updated data table (1)");
                    equals(c.find("cbody").table()[2][0], "zzz_2", "updated data table (2)");
                    equals(c.find("cbody").table()[3][0], "zzz_3", "updated data table (3)");
                    equals(c.find("cbody").table()[4][0], "zzz_4", "updated data table (4)");
                    start();
                }),
            stop(2000);
        });

};

// End
