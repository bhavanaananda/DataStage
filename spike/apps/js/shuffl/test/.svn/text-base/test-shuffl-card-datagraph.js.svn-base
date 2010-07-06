/**
 * @fileoverview
 *  Test suite for data graphing card functions
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
 * Data
 */

var testcarddatagraph_columns = [[0,1],[0,2],[0,3],[0,4]]

var testcarddatagraph_labels =
    ["graph1", "graph2", "graph3", "graph4"];

var testcarddatagraph_axes =
    [ ['x1','y1'], ['x1','y2'], ['x1','y1'], ['x1','y2'] ];
                                
var testcarddatagraph_series = [ [], [], [], [] ];

(function (series)
{
    var limit = function (val,min,max)
    {
        if (val<min) { return null; };
        if (val>max) { return null; };
        return val;
    };
    for (var x = -3.0 ; x <= 5.0 ; x = x+0.2) 
    {
        var y1 = Math.sin(x);
        var y2 = Math.cos(x);
        var y3 = limit(Math.tan(x)/5.0, -1.0, +1.0);
        var x4 = Math.abs(x*4);
        var y4 = Math.sin((x4>0.0 ? Math.sin(x4)/x4 : 1.0));
        series[0].push([x, y1]);
        series[1].push([x, y2]);
        series[2].push([x, y3]);
        series[3].push([x, y4]);
    };
})(testcarddatagraph_series);
                                
var testcarddatagraph_carddata = 
    { 'shuffl:id':        'card_N'
    , 'shuffl:type':      'shuffl-datagraph-ZZZZZZ'
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
      { 'shuffl:title':     "Card N title"
      , 'shuffl:tags':      [ 'card_N_tag', 'footag' ]
      , 'shuffl:source_id': "srcid"
      , 'shuffl:dataminy':  -1.2
      , 'shuffl:datamaxy':  1.2
      , 'shuffl:labels':    testcarddatagraph_labels
      , 'shuffl:axes':      testcarddatagraph_axes
      , 'shuffl:series':    testcarddatagraph_series
      }
    };

var testcarddatagraph_modeldata = 
    { 'shuffl:tags':      ["card-tag"]
    , 'shuffl:title':     "card-title"
    , 'shuffl:dataminy':  -1.2
    , 'shuffl:datamaxy':  1.2
    , 'shuffl:x1axis':    'lin'
    , 'shuffl:y1axis':    'lin'
    , 'shuffl:y2axis':    'lin'
    , 'shuffl:labels':    testcarddatagraph_labels
    , 'shuffl:axes':      testcarddatagraph_axes
    , 'shuffl:series':    testcarddatagraph_series
    };

/**
 * Function to register tests
 */

TestCardDatagraph = function() {

    module("TestCardDatagraph");

    test("shuffl.addCardFactories", function ()
    {
        logtest("shuffl.addCardFactories");
        // Card factories are created when shuffl-card-datagraph module is loaded
    		equals(shuffl.CardFactoryMap['shuffl-datagraph-yellow'].cardcss, "stock-yellow", "shuffl-datagraph-yellow");
        equals(shuffl.CardFactoryMap['shuffl-datagraph-blue'  ].cardcss, "stock-blue",   "shuffl-datagraph-blue");
        equals(shuffl.CardFactoryMap['shuffl-datagraph-green' ].cardcss, "stock-green",  "shuffl-datagraph-green");
        equals(shuffl.CardFactoryMap['shuffl-datagraph-orange'].cardcss, "stock-orange", "shuffl-datagraph-orange");
        equals(shuffl.CardFactoryMap['shuffl-datagraph-pink'  ].cardcss, "stock-pink",   "shuffl-datagraph-pink");
        equals(shuffl.CardFactoryMap['shuffl-datagraph-purple'].cardcss, "stock-purple", "shuffl-datagraph-purple");
    });
    
    test("shuffl.getCardFactories", function () 
    {
        logtest("shuffl.getCardFactories");
        var c0 = shuffl.getCardFactory("default-type");
        equals(typeof c0, "function", "default factory");
		var c1 = shuffl.getCardFactory("shuffl-datagraph-yellow");
		equals(typeof c1, "function", "retrieved factory yellow");
        var c2 = shuffl.getCardFactory("shuffl-datagraph-blue");
        equals(typeof c2, "function", "retrieved factory blue");
        var c3 = shuffl.getCardFactory("shuffl-datagraph-green");
        equals(typeof c3, "function", "retrieved factory green");
        var c4 = shuffl.getCardFactory("shuffl-datagraph-orange");
        equals(typeof c4, "function", "retrieved factory orange");
        var c5 = shuffl.getCardFactory("shuffl-datagraph-pink");
        equals(typeof c5, "function", "retrieved factory pink");
        var c6 = shuffl.getCardFactory("shuffl-datagraph-purple");
        equals(typeof c6, "function", "retrieved factory purple");
    });

    test("shuffl.card.datagraph.newCard", function () 
    {
        logtest("shuffl.card.datagraph.newCard");
        var c   = shuffl.card.datagraph.newCard(
            "shuffl-datagraph-yellow", 'stock-yellow', "card-1",
            testcarddatagraph_modeldata);
        // Check model values
        equals(c.model("shuffl:title"),     "card-title",         "shuffl:title");
        equals(c.model("shuffl:tags"),      "card-tag",           "shuffl:tags");
        equals(c.model("shuffl:source_id"), undefined,            "shuffl:source_id");
        equals(c.model("shuffl:dataminy"),  -1.2,                 "shuffl:dataminy");
        equals(c.model("shuffl:datamaxy"),  1.2,                  "shuffl:datamaxy");
        same(c.model("shuffl:x1axis"),  'lin',                    "shuffl:x1axis");
        same(c.model("shuffl:y1axis"),  'lin',                    "shuffl:y1axis");
        same(c.model("shuffl:y2axis"),  'lin',                    "shuffl:y2axis");
        same(c.model("shuffl:table"),   undefined,                "shuffl:table");
        same(c.model("shuffl:labels"),  testcarddatagraph_labels, "shuffl:labels");
        same(c.model("shuffl:axes"),    testcarddatagraph_axes,   "shuffl:axes");
        same(c.model("shuffl:series"),  testcarddatagraph_series, "shuffl:series");
        // Check rendered card
        equals(c.attr('id'), "card-1",  "card id attribute");
        ok(c.hasClass('stock-yellow'),  "yellow colour class");
        ok(c.hasClass('shuffl-card-setsize'), "shuffl card setsize class");
        equals(c.attr('class'), 'shuffl-card-setsize stock-yellow ui-resizable ui-droppable', "CSS class");
        equals(c.find("cident").text(), "card-1", "card id field");
        equals(c.find("cclass").text(), "shuffl-datagraph-yellow", "card class field");
        equals(c.find("ctitle").text(), "card-title", "card title field");
        equals(c.find("ctags").text(),  "card-tag", "card tags field");
        equals(c.find("cdataminy").text(), "-1.20", "minimum Y field");
        equals(c.find("cdatamaxy").text(),  "1.20", "maximum Y field");
        equals(c.find("cbody").children().get(0).tagName.toLowerCase(), "div", "card body contains <div>");
    });

    test("shuffl.createCardFromStock", function () 
    {
        logtest("shuffl.createCardFromStock");
  			var s = shuffl.createStockpile(
		    "stock_id", "stock-green", "stock-label", "shuffl-datagraph-green");
    		var c = shuffl.createCardFromStock(jQuery("#stock_id"));
        ////log.debug("- card "+shuffl.objectString(c));
        var card_id = shuffl.lastId("card_");
        // Check model values
        equals(c.model("shuffl:title"), card_id, "shuffl:title");
        equals(c.model("shuffl:tags"),  "shuffl-datagraph-green", "shuffl:tags");
        equals(c.model("shuffl:source_id"), undefined,            "shuffl:source_id");
        // Different tests when card is preloaded with dummy test data
        if (/*card_contains_dummy_data*/false)
        {
            range(c.model("shuffl:dataminy"), -3.0, -2.0, "shuffl:dataminy");
            range(c.model("shuffl:datamaxy"),  3.0,  4.0, "shuffl:datamaxy");
        } else {
            equals(c.model("shuffl:dataminy"), undefined, "shuffl:dataminy");
            equals(c.model("shuffl:datamaxy"), undefined, "shuffl:datamaxy");
            same(c.model("shuffl:table"),  null, "shuffl:table");
            same(c.model("shuffl:labels"), [], "shuffl:labels");
            same(c.model("shuffl:axes"),   [], "shuffl:axes");
            same(c.model("shuffl:series"), [], "shuffl:series");
        };
        // Check rendered card
        equals(c.attr('id'), card_id, "card id attribute");
        ok(c.hasClass('shuffl-card'),   "shuffl card class");
        ok(c.hasClass('shuffl-card-setsize'),   "shuffl card setsize class");
        ok(c.hasClass('stock-green'),   "stock-green");
        ok(c.hasClass('ui-resizable'),  "ui-resizable");
        equals(c.attr('class'), 'shuffl-card-setsize stock-green ui-resizable ui-droppable shuffl-card', "CSS class");
        equals(c.find("cident").text(), card_id, "card id field");
        equals(c.find("cclass").text(), "shuffl-datagraph-green", "card type");
        equals(c.find("ctitle").text(), card_id, "card title field");
        equals(c.find("ctags").text(),  "shuffl-datagraph-green", "card tags field");
        // Different tests when card is preloaded with dummy test data
        if (/*card_contains_dummy_data*/false)
        {
            range(c.find("cdataminy").text(), -3.0, -2.0, "minimum Y field");
            range(c.find("cdatamaxy").text(),  3.0,  4.0, "maximum Y field");
        } else {
            equals(c.find("cdataminy").text(), "-1.0", "minimum Y field");
            equals(c.find("cdatamaxy").text(), " 1.0", "maximum Y field");
        };
        equals(c.find("cbody").children().get(0).tagName.toLowerCase(), "div", "card body contains <div>");
        // Check saved card data
        var d = testcarddatagraph_carddata;
        equals(c.data('shuffl:id'),    card_id, "layout card id");
        equals(c.data('shuffl:type' ), "shuffl-datagraph-green", "saved card type");
        equals(c.data('shuffl:external')['shuffl:id'],          card_id, "card data id");
        equals(c.data('shuffl:external')['shuffl:type'],        "shuffl-datagraph-green", "card data class");
        equals(c.data('shuffl:external')['shuffl:version'],     d['shuffl:version'], "card data version");
        equals(c.data('shuffl:external')['shuffl:base-uri'],    d['shuffl:base-uri'], "card data base-uri");
        same(c.data('shuffl:external')['shuffl:uses-prefixes'], d['shuffl:uses-prefixes'], "card data uses-prefixes");
        equals(c.data('shuffl:external')['shuffl:data'],        undefined, "card data");
    });

    test("shuffl.createCardFromData", function ()
    {
        logtest("shuffl.createCardFromData");
        var d = testcarddatagraph_carddata;
        var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-datagraph-orange", d);
        // Check model values
        equals(c.model("shuffl:title"),     "Card N title",       "shuffl:title");
        equals(c.model("shuffl:tags"),      "card_N_tag,footag",  "shuffl:tags");
        equals(c.model("shuffl:source_id"), "srcid",              "shuffl:source_id");
        equals(c.model("shuffl:dataminy"),  -1.2,                 "shuffl:dataminy");
        equals(c.model("shuffl:datamaxy"),  1.2,                  "shuffl:datamaxy");
        same(c.model("shuffl:x1axis"),      'lin',                "shuffl:x1axis");
        same(c.model("shuffl:y1axis"),      'lin',                "shuffl:y1axis");
        same(c.model("shuffl:y2axis"),      'lin',                "shuffl:y2axis");
        ////same(c.model("shuffl:x1axis"), { transform: 'lin' },      "shuffl:x1axis");
        ////same(c.model("shuffl:y1axis"), { transform: 'lin' },      "shuffl:y1axis");
        ////same(c.model("shuffl:y2axis"), { transform: 'lin' },      "shuffl:y2axis");
        same(c.model("shuffl:table"),   undefined,                "shuffl:table");
        same(c.model("shuffl:labels"),  testcarddatagraph_labels, "shuffl:labels");
        same(c.model("shuffl:axes"),    testcarddatagraph_axes,   "shuffl:axes");
        same(c.model("shuffl:series"),  testcarddatagraph_series, "shuffl:series");
        // Check rendered card
        equals(c.attr('id'), "cardfromdata_id", "card id attribute");
        ok(c.hasClass('shuffl-card'),   "shuffl card type");
        ok(c.hasClass('shuffl-card-setsize'),   "shuffl card setsize class");
        ok(c.hasClass('stock-orange'),  "stock-orange class");
        equals(c.attr('class'), 'shuffl-card-setsize stock-orange ui-resizable ui-droppable shuffl-card', "CSS class");
        equals(c.find("cident").text(), "cardfromdata_id", "card id field");
        equals(c.find("cclass").text(), "shuffl-datagraph-orange", "card class field");
        equals(c.find("ctitle").text(), "Card N title", "card title field");
        equals(c.find("ctags").text(),  "card_N_tag,footag", "card tags field");
        equals(c.find("cdataminy").text(), "-1.20", "minimum Y field");
        equals(c.find("cdatamaxy").text(),  "1.20", "maximum Y field");
        equals(c.find("cbody").children().get(0).tagName.toLowerCase(), "div", "card body contains <div>");
        // Check card data
        same(c.data('shuffl:external'), d,      "card data");
    });

    test("shuffl.createDataFromCard", function () 
    {
        logtest("shuffl.createDataFromCard");
        // Create card (copy of code already tested)
        var d = testcarddatagraph_carddata;
        var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-datagraph-pink", d);
        // (Re)create data and test
        var e = shuffl.createDataFromCard(c);
        equals(e['shuffl:id'],          "cardfromdata_id",          'shuffl:id');
        equals(e['shuffl:type'],        "shuffl-datagraph-pink",    'shuffl:type' );
        equals(e['shuffl:version'],     d['shuffl:version'],        'shuffl:version');
        equals(e['shuffl:base-uri'],    d['shuffl:base-uri'],       'shuffl:base-uri');
        same(e['shuffl:uses-prefixes'], d['shuffl:uses-prefixes'],  'shuffl:uses-prefixes');
        equals(e['shuffl:data']['shuffl:title'], "Card N title",    'shuffl:data-title');
        same(e['shuffl:data']['shuffl:tags'],    [ 'card_N_tag', 'footag' ], 'shuffl:data-tags');
        equals(e['shuffl:data']['shuffl:source_id'], "srcid",       'shuffl:data-srcid');
        equals(e['shuffl:data']['shuffl:dataminy'],  -1.2,          'shuffl:data-dataminy');
        equals(e['shuffl:data']['shuffl:datamaxy'],   1.2,          'shuffl:data-datamaxy');
        equals(e['shuffl:data']['shuffl:x1axis'],    'lin',         'shuffl:data-x1axis');
        equals(e['shuffl:data']['shuffl:y1axis'],    'lin',         'shuffl:data-y1axis');
        equals(e['shuffl:data']['shuffl:y2axis'],    'lin',         'shuffl:data-y2axis');
        ////same(e['shuffl:data']['shuffl:x1axis'], { transform: 'lin' }, 'shuffl:data-x1axis');
        ////same(e['shuffl:data']['shuffl:y1axis'], { transform: 'lin' }, 'shuffl:data-y1axis');
        ////same(e['shuffl:data']['shuffl:y2axis'], { transform: 'lin' }, 'shuffl:data-y2axis');
        same(e['shuffl:data']['shuffl:labels'], testcarddatagraph_labels, 'shuffl:data-labels');
        same(e['shuffl:data']['shuffl:axes'],   testcarddatagraph_axes,   'shuffl:data-axes');
        same(e['shuffl:data']['shuffl:series'], testcarddatagraph_series, 'shuffl:data-series');
    });

    test("shuffl.card.datagraph.model setting data", function () 
    {
        logtest("shuffl.card.datagraph.model setting data");
        // Create card (copy of code already tested)
        var d = testcarddatagraph_carddata;
        var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-datagraph-pink", d);
        var NewDataTable =
            [ [ "x", "c=cos x", "c3=cos 3x", "c5=cos 5x" ]
            , [ "0.0",  "1",       "1",       "1"        ]
            , [ "0.2",  "0.9801",  "0.8253",  "0.5403"   ]
            , [ "0.4",  "0.9211",  "0.3624",  "-0.4161"  ]
            , [ "0.6",  "0.8253",  "-0.2272", "-0.99"    ]
            , [ "0.8",  "0.6967",  "-0.7374", "-0.6536"  ]
            , [ "1.0",  "0.5403",  "-0.99",   "0.2837"   ]
            ];
        var NewDataLabels =
            [ "c=cos x", "c3=cos 3x", "c5=cos 5x" ];
        var NewDataAxes =
            [ ['x1', 'y1'], ['x1', 'y1'], ['x1', 'y1'] ];
        var NewDataSeries = [];
        NewDataSeries[0] =
            [ [ 0.0,  1,     ]
            , [ 0.2,  0.9801 ]
            , [ 0.4,  0.9211 ]
            , [ 0.6,  0.8253 ]
            , [ 0.8,  0.6967 ]
            , [ 1.0,  0.5403 ]
            ];
        NewDataSeries[1] =
            [ [ 0.0,  1,       ]
            , [ 0.2,  0.8253,  ]
            , [ 0.4,  0.3624,  ]
            , [ 0.6,  -0.2272, ]
            , [ 0.8,  -0.7374, ]
            , [ 1.0,  -0.99,   ]
            ];
        NewDataSeries[2] =
            [ [ 0.0,  1,       ]
            , [ 0.2,  0.5403,  ]
            , [ 0.4,  -0.4161, ]
            , [ 0.6,  -0.99,   ]
            , [ 0.8,  -0.6536, ]
            , [ 1.0,  0.2837,  ]
            ];
        // Check initial values
        equals(c.find("ctitle").text(), "Card N title", "card title field");
        equals(c.find("ctags").text(),  "card_N_tag,footag", "card tags field");
        equals(c.find("cdataminy").text(), "-1.20", "minimum Y field");
        equals(c.find("cdatamaxy").text(),  "1.20", "maximum Y field");
        // Simulate user input: set model to update title, tags, etc.
        c.model("shuffl:title",     "Card N updated");
        c.model("shuffl:tags",      "card_N_tag,bartag");
        c.model("shuffl:dataminy",  "-2.0");
        c.model("shuffl:datamaxy",  "2.0");
        equals(c.find("ctitle").text(), "Card N updated", "updated title field");
        equals(c.find("ctags").text(),  "card_N_tag,bartag", "updated tags field");
        equals(c.find("cdataminy").text(), "-2.0", "updated minimum Y field");
        equals(c.find("cdatamaxy").text(),  "2.0", "updated maximum Y field");
        // Setting table updates data range, labels and series..
        c.model("shuffl:table", NewDataTable);
        range(c.find("cdataminy").text(), -1.1, -0.9, "minimum Y field");
        range(c.find("cdatamaxy").text(),  0.9,  1.1, "maximum Y field");
        same(c.model("shuffl:table"),  null,          "shuffl:table");
        same(c.model("shuffl:labels"), NewDataLabels, "shuffl:labels");
        same(c.model("shuffl:axes"),   NewDataAxes,   "shuffl:axes");
        same(c.model("shuffl:series"), NewDataSeries, "shuffl:series");
    });

    test("shuffl.card.datagraph model data table setting", function () 
    {
        logtest("shuffl.card.datagraph model data table setting");
        // Create card (copy of code already tested)
        var d = testcarddatagraph_carddata;
        var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-datagraph-pink", d);
        var NewDataTable =
            [ [ "", "c=cos x", "c3=cos 3x", "c5=cos 5x" ]
            , [ 0.0,   1,           1,           1      ]
            , [ 0.2,   0.9801,      0.8253,      0.5403 ]
            , [ 0.4,   0.9211,      0.3624,     -0.4161 ]
            , [ 0.6,   0.8253,     -0.2272,     -0.99   ]
            , [ 0.8,   0.6967,     -0.7374,     -0.6536 ]
            , [ 1.0,   0.5403,     -0.99,        0.2837 ]
            ];
        var NewDataLabels =
            [ "c=cos x", "c3=cos 3x", "c5=cos 5x" ];
        var NewDataAxes =
            [ ['x1', 'y1'], ['x1', 'y1'], ['x1', 'y1'] ];
        var NewDataSeries = [];
        NewDataSeries[0] =
            [ [ 0.0,  1,     ]
            , [ 0.2,  0.9801 ]
            , [ 0.4,  0.9211 ]
            , [ 0.6,  0.8253 ]
            , [ 0.8,  0.6967 ]
            , [ 1.0,  0.5403 ]
            ];
        NewDataSeries[1] =
            [ [ 0.0,  1,       ]
            , [ 0.2,  0.8253,  ]
            , [ 0.4,  0.3624,  ]
            , [ 0.6,  -0.2272, ]
            , [ 0.8,  -0.7374, ]
            , [ 1.0,  -0.99,   ]
            ];
        NewDataSeries[2] =
            [ [ 0.0,  1,       ]
            , [ 0.2,  0.5403,  ]
            , [ 0.4,  -0.4161, ]
            , [ 0.6,  -0.99,   ]
            , [ 0.8,  -0.6536, ]
            , [ 1.0,  0.2837,  ]
            ];
        // Check initial values
        equals(c.find("ctitle").text(), "Card N title", "card title field");
        equals(c.find("ctags").text(),  "card_N_tag,footag", "card tags field");
        equals(c.find("cdataminy").text(), "-1.20", "minimum Y field");
        equals(c.find("cdatamaxy").text(),  "1.20", "maximum Y field");
        // Simulate user input: update data range
        c.model("shuffl:dataminy",  "-2.0");
        c.model("shuffl:datamaxy",  "2.0");
        equals(c.find("cdataminy").text(), "-2.0", "updated minimum Y field");
        equals(c.find("cdatamaxy").text(),  "2.0", "updated maximum Y field");
        // Simulate user input: set table data
        // See also module test-shuffl-card-datagraph-drop
        c.modelBindExec("shuffl:table",
            function () {
                // Executed immediately
                c.model("shuffl:table", NewDataTable);
            },
            function () {
                // Executed when shuffl:table is updated...
                range(c.find("cdataminy").text(), -1.1, -0.9, "minimum Y field");
                range(c.find("cdatamaxy").text(),  0.9,  1.1, "maximum Y field");
                same(c.model("shuffl:table"),  null,          "read shuffl:table");
                same(c.model("shuffl:labels"), NewDataLabels, "read shuffl:labels");
                same(c.model("shuffl:axes"),   NewDataAxes,   "shuffl:axes");
                same(c.model("shuffl:series"), NewDataSeries, "read shuffl:series");
                start();
            }),
        stop(2000);
    });

    test("shuffl.card.datagraph.log10transform", function ()
    {
        logtest("shuffl.card.datagraph.log10transform");
        var t = shuffl.card.datagraph.log10transform;
        range(t.transform(10.0),          0.99999, 1.00001, "Log10(10)");
        range(t.transform(1.0),           0.0,     0.0,     "Log10(1)");
        range(t.transform(0.1),          -1.001,  -0.999,   "Log10(0.1)");
        range(t.transform(100.0),         1.99999, 2.00001, "Log10(100)");
        range(t.transform(0.0007164),    -3.145,  -3.144,   "Log10(0.0007164)");
        range(t.transform(0.0),           0.0,     0.0,     "Log10(0.0)");
        range(t.transform(-1.0),          0.0,     0.0,     "Log10(-1.0)");
        range(t.inverseTransform(1.0),    9.999,  10.001,   "aLog10(1)");
        range(t.inverseTransform(0.0),    1.0,     1.0,     "aLog10(0.0)");
        range(t.inverseTransform(-1.0),   0.099,   0.1,     "aLog10(-1.0)");
        range(t.inverseTransform(2.0),  100.0,   100.001,   "aLog10(100)");
    });

    test("shuffl.card.datagraph.log10tickgenerator", function ()
    {
        logtest("shuffl.card.datagraph.log10tickgenerator");
        var t = shuffl.card.datagraph.log10tickgenerator;
        function sameticks(actual, expected, message)
        {
            equals( actual.length, expected.length, "length - "+message);
            for (var i = 0 ; i < actual.length ; i++)
            {
                var e = expected[i];
                if (!e) e = [-1,"???"];
                range(actual[i][0], e[0]*0.99999, e[0]*1.00001, "position["+i+"] -"+message);
                equals(actual[i][1], e[1], "label["+i+"] -"+message);
            };
        };
        // positive logs
        var a1 = {min:10.0, max:1000.0};
        var t1 =
            [ [1E+1,"1E+1"], [2E+1,""], [4E+1,""], [6E+1,""], [8E+1, ""]
            , [1E+2,"1E+2"], [2E+2,""], [4E+2,""], [6E+2,""], [8E+2, ""]
            , [1E+3,"1E+3"]
            ];
        sameticks(t(a1), t1, "Log ticks for "+jQuery.toJSON(a1));
        // negative logs
        var a2 = {min:0.001, max:0.1};
        var t2 =
            [ [1E-3,"1E-3"], [2E-3,""], [4E-3,""], [6E-3,""], [8E-3, ""]
            , [1E-2,"1E-2"], [2E-2,""], [4E-2,""], [6E-2,""], [8E-2, ""]
            , [1E-1,"1E-1"]
            ];
        sameticks(t(a2), t2, "Log ticks for "+jQuery.toJSON(a2));
        // negative and positive logs
        var a3 = {min:0.05, max:50.0};
        var t3 =
            [ [1E-2,"1E-2"], [2E-2,""], [4E-2,""], [6E-2,""], [8E-2, ""]
            , [1E-1,"1E-1"], [2E-1,""], [4E-1,""], [6E-1,""], [8E-1, ""]
            , [1E+0,"1"],    [2E+0,""], [4E+0,""], [6E+0,""], [8E+0, ""]
            , [1E+1,"1E+1"], [2E+1,""], [4E+1,""], [6E+1,""], [8E+1, ""]
            , [1E+2,"1E+2"]
            ];
        sameticks(t(a3), t3, "Log ticks for "+jQuery.toJSON(a3));
    });

};

// End
