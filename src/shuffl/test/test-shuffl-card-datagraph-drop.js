/**
 * @fileoverview
 *  Test suite for dropping datatable card on datagraph card
 *  
 * @author Graham Klyne
 * @version $Id: test-shuffl-card-datagraph-drop.js 779 2010-05-06 08:25:42Z gk-google@ninebynine.org $
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

var carddatagraph_labels0 = [];

var carddatagraph_axes0 = [];
                                
var carddatagraph_series0 = [];

var carddatagraph_data0 =
    { 'shuffl:title':     "Graph card"
    , 'shuffl:tags':      ["graph-card"]
    , 'shuffl:source_id': "srcid"
    , 'shuffl:dataminy':  -1.2
    , 'shuffl:datamaxy':  1.2
    , 'shuffl:labels':    carddatagraph_labels0
    , 'shuffl:axes':      carddatagraph_axes0
    , 'shuffl:series':    carddatagraph_series0
    };

var carddatatable_table1 =
    [ [ "",  "col1",  "col2",  "col3" ]
    , [ "1", "1.11",  "1.22",  "1.33" ]
    , [ "2", "2.11",  "2.22",  "2.33" ]
    ];

var carddatagraph_labels1 =
    [ "col1", "col2", "col3" ];

var carddatagraph_axes1 = 
    [ ['x1','y1'], ['x1','y1'], ['x1','y1'] ];
                                
var carddatagraph_series1 = 
    [ [ [1, 1.11],  [2, 2.11] ]
    , [ [1, 1.22],  [2, 2.22] ]
    , [ [1, 1.33],  [2, 2.33] ]
    ];

var carddatatable_table2 =
    [ [ "",  "col21",  "col22",  "col23" ]
    , [ "1", "21.11",  "21.22",  "21.33" ]
    , [ "2", "22.11",  "22.22",  "22.33" ]
    ];

var carddatagraph_labels2 =
    [ "col21", "col22", "col23" ];

var carddatagraph_axes2 = 
    [ ['x1','y1'], ['x1','y1'], ['x1','y1'] ];
                                
var carddatagraph_series2 = 
    [ [ [1, 21.11],  [2, 22.11] ]
    , [ [1, 21.22],  [2, 22.22] ]
    , [ [1, 21.33],  [2, 22.33] ]
    ];

var carddatagraph_axes3 = 
    [ ['x1','y2'], ['x1','y1'], ['x1','y2'] ];

/**
 * Function to register tests
 */
TestCardDatagraphDrop = function()
{

    module("TestCardDatagraphDrop");

    test("Mock drop on datagraph card", function ()
    {
        expect(24);
        logtest("Mock drop on datagraph card");
        // Instantiate empty datagraph card
        var c   = shuffl.card.datagraph.newCard(
            "shuffl-datagraph-yellow", 'stock-yellow', "card-1", 
            carddatagraph_data0);
        // Check datagraph model values
        equals(c.model("shuffl:title"), "Graph card", "shuffl:title");
        equals(c.model("shuffl:tags"),  "graph-card", "shuffl:tags");
        equals(c.model("shuffl:dataminy"), -1.2, "shuffl:dataminy");
        equals(c.model("shuffl:datamaxy"),  1.2, "shuffl:datamaxy");
        same(c.model("shuffl:labels"), carddatagraph_labels0, "shuffl:labels");
        same(c.model("shuffl:axes"),   carddatagraph_axes0,   "shuffl:axes");
        same(c.model("shuffl:series"), carddatagraph_series0, "shuffl:series");
        // Check datagraph rendered card
        equals(c.find("ctitle").text(), "Graph card", "card title field");
        equals(c.find("ctags").text(),  "graph-card", "card tags field");
        equals(c.find("cdataminy").text(), "-1.20", "minimum Y field");
        equals(c.find("cdatamaxy").text(),  "1.20", "maximum Y field");
        equals(c.find("cbody").children().get(0).tagName.toLowerCase(), "div", "card body contains <div>");
        // Instantiate mock table card
        var tc = jQuery("<div/>");
        tc.model('shuffl:id',     'tc_id');
        tc.model('shuffl:labels', carddatagraph_labels1);
        tc.model('shuffl:axes',   carddatagraph_axes1);
        tc.model('shuffl:series', carddatagraph_series1);
        // Simulate drop on datagraph card
        c.model('shuffl:source', tc);
        // Check updated datagraph model values
        equals(c.model("shuffl:title"),     "Graph card", "shuffl:title");
        equals(c.model("shuffl:tags"),      "graph-card", "shuffl:tags");
        equals(c.model("shuffl:source_id"), "tc_id",      "shuffl:source_id");
        equals(c.model("shuffl:dataminy"),  1.11, "shuffl:dataminy");
        equals(c.model("shuffl:datamaxy"),  2.33, "shuffl:datamaxy");
        same(c.model("shuffl:labels"),      carddatagraph_labels1, "shuffl:labels");
        same(c.model("shuffl:axes"),        carddatagraph_axes1, "shuffl:axes");
        same(c.model("shuffl:series"),      carddatagraph_series1, "shuffl:series");
        // Check updated datagraph rendered card
        equals(c.find("ctitle").text(), "Graph card", "card title field");
        equals(c.find("ctags").text(),  "graph-card", "card tags field");
        equals(c.find("cdataminy").text(), "1.11", "minimum Y field");
        equals(c.find("cdatamaxy").text(), "2.33", "maximum Y field");
    });

    test("Datatable drop on datagraph card", function ()
    {
        expect(24);
        logtest("Datatable drop on datagraph card");
        // Instantiate empty datagraph card
        var c   = shuffl.card.datagraph.newCard(
            "shuffl-datagraph-yellow", 'stock-yellow', "card-1", 
            carddatagraph_data0);
        // Check datagraph model values
        equals(c.model("shuffl:title"), "Graph card",         "shuffl:title");
        equals(c.model("shuffl:tags"),  "graph-card",         "shuffl:tags");
        equals(c.model("shuffl:dataminy"), -1.2,              "shuffl:dataminy");
        equals(c.model("shuffl:datamaxy"),  1.2,              "shuffl:datamaxy");
        same(c.model("shuffl:labels"), carddatagraph_labels0, "shuffl:labels");
        same(c.model("shuffl:axes"),   carddatagraph_axes0,   "shuffl:axes");
        same(c.model("shuffl:series"), carddatagraph_series0, "shuffl:series");
        // Check datagraph rendered card
        equals(c.find("ctitle").text(), "Graph card", "card title field");
        equals(c.find("ctags").text(),  "graph-card", "card tags field");
        equals(c.find("cdataminy").text(), "-1.20",   "minimum Y field");
        equals(c.find("cdatamaxy").text(),  "1.20",   "maximum Y field");
        equals(c.find("cbody").children().get(0).tagName.toLowerCase(), "div", "card body contains <div>");
        // Instantiate datatable card
        var tc = shuffl.card.datatable.newCard("shuffl-datatable-blue", 
            'stock-blue', "card-2",
            { 'shuffl:title': "Table card"
            , 'shuffl:tags':  ["table-card"]
            , 'shuffl:uri':   "http://example.org/test-uri.csv"
            , 'shuffl:table': carddatatable_table1
            });
        // Simulate drop on datagraph card
        c.model('shuffl:source', tc);
        // Check updated datagraph model values
        equals(c.model("shuffl:title"),     "Graph card (Table card)", "shuffl:title");
        equals(c.model("shuffl:tags"),      "graph-card",     "shuffl:tags");
        equals(c.model("shuffl:source_id"), "card-2",         "shuffl:source_id");
        equals(c.model("shuffl:dataminy"),  1.11,             "shuffl:dataminy");
        equals(c.model("shuffl:datamaxy"),  2.33,             "shuffl:datamaxy");
        same(c.model("shuffl:labels"), carddatagraph_labels1, "shuffl:labels");
        same(c.model("shuffl:axes"),   carddatagraph_axes1,   "shuffl:axes");
        same(c.model("shuffl:series"), carddatagraph_series1, "shuffl:series");
        // Check updated datagraph rendered card
        equals(c.find("ctitle").text(), "Graph card (Table card)", "card title field");
        equals(c.find("ctags").text(),  "graph-card", "card tags field");
        equals(c.find("cdataminy").text(), "1.11", "minimum Y field");
        equals(c.find("cdatamaxy").text(), "2.33", "maximum Y field");
    });

    test("Datatable second drop on datagraph card", function ()
    {
        expect(36);
        logtest("Datatable second drop on datagraph card");
        // Instantiate empty datagraph card
        var c   = shuffl.card.datagraph.newCard(
            "shuffl-datagraph-yellow", 'stock-yellow', "card-1",
            carddatagraph_data0);
        // Check datagraph model values
        equals(c.model("shuffl:title"), "Graph card", "shuffl:title");
        equals(c.model("shuffl:tags"),  "graph-card", "shuffl:tags");
        equals(c.model("shuffl:dataminy"), -1.2, "shuffl:dataminy");
        equals(c.model("shuffl:datamaxy"),  1.2, "shuffl:datamaxy");
        same(c.model("shuffl:labels"), carddatagraph_labels0, "shuffl:labels");
        same(c.model("shuffl:axes"),   carddatagraph_axes0,   "shuffl:axes");
        same(c.model("shuffl:series"), carddatagraph_series0, "shuffl:series");
        // Check datagraph rendered card
        equals(c.find("ctitle").text(), "Graph card", "card title field");
        equals(c.find("ctags").text(),  "graph-card", "card tags field");
        equals(c.find("cdataminy").text(), "-1.20",   "minimum Y field");
        equals(c.find("cdatamaxy").text(),  "1.20",   "maximum Y field");
        equals(c.find("cbody").children().get(0).tagName.toLowerCase(), "div", "card body contains <div>");
        // Instantiate datatable card
        var tc = shuffl.card.datatable.newCard("shuffl-datatable-blue", 
            'stock-blue', "card-2",
            { 'shuffl:title': "Table card"
            , 'shuffl:tags':  ["table-card"]
            , 'shuffl:uri':   "http://example.org/test-uri.csv"
            , 'shuffl:table': carddatatable_table1
            });
        // Simulate drop on datagraph card
        c.model('shuffl:source', tc);
        // Check updated datagraph model values
        equals(c.model("shuffl:title"),     "Graph card (Table card)", "shuffl:title");
        equals(c.model("shuffl:tags"),      "graph-card",     "shuffl:tags");
        equals(c.model("shuffl:source_id"), "card-2",         "shuffl:source_id");
        equals(c.model("shuffl:dataminy"),  1.11,             "shuffl:dataminy");
        equals(c.model("shuffl:datamaxy"),  2.33,             "shuffl:datamaxy");
        same(c.model("shuffl:labels"), carddatagraph_labels1, "shuffl:labels");
        same(c.model("shuffl:axes"),   carddatagraph_axes1,   "shuffl:axes");
        same(c.model("shuffl:series"), carddatagraph_series1, "shuffl:series");
        // Check updated datagraph rendered card
        equals(c.find("ctitle").text(), "Graph card (Table card)", "card title field");
        equals(c.find("ctags").text(),  "graph-card", "card tags field");
        equals(c.find("cdataminy").text(), "1.11", "minimum Y field");
        equals(c.find("cdatamaxy").text(), "2.33", "maximum Y field");
        // Instatiate second datatable card
        var tc2 = shuffl.card.datatable.newCard("shuffl-datatable-green", 
            'stock-green', "card-3",
            { 'shuffl:title': "Table card 2"
            , 'shuffl:tags':  ["table-card-2"]
            , 'shuffl:uri':   "http://example.org/test-uri-2.csv"
            , 'shuffl:table': carddatatable_table2
            });
        // Simulate drop on datagraph card
        c.model('shuffl:source', tc2);
        // Check updated datagraph model values
        equals(c.model("shuffl:title"), "Graph card (Table card 2)", "shuffl:title(2)");
        equals(c.model("shuffl:tags"),  "graph-card",         "shuffl:tags(2)");
        equals(c.model("shuffl:source_id"), "card-3",         "shuffl:source_id");
        equals(c.model("shuffl:dataminy"), 21.11,             "shuffl:dataminy(2)");
        equals(c.model("shuffl:datamaxy"), 22.33,             "shuffl:datamaxy(2)");
        same(c.model("shuffl:labels"), carddatagraph_labels2, "shuffl:labels(2)");
        same(c.model("shuffl:axes"),   carddatagraph_axes2,   "shuffl:axes(2)");
        same(c.model("shuffl:series"), carddatagraph_series2, "shuffl:series(2)");
        // Check updated datagraph rendered card
        equals(c.find("ctitle").text(), "Graph card (Table card 2)", "card title field(2)");
        equals(c.find("ctags").text(),  "graph-card", "card tags field(2)");
        equals(c.find("cdataminy").text(), "21.11", "minimum Y field(2)");
        equals(c.find("cdatamaxy").text(), "22.33", "maximum Y field(2)");
    });

    test("Datagraph subscription to datatable changes", function ()
    {
        expect(38);
        logtest("Datagraph subscription to datatable changes");
        // Instantiate empty datagraph card
        var c   = shuffl.card.datagraph.newCard(
            "shuffl-datagraph-yellow", 'stock-yellow', "card-1",
            carddatagraph_data0);
        // Check datagraph model values
        equals(c.model("shuffl:title"), "Graph card",         "shuffl:title");
        equals(c.model("shuffl:tags"),  "graph-card",         "shuffl:tags");
        equals(c.model("shuffl:source_id"), "srcid",          "shuffl:source_id");
        equals(c.model("shuffl:dataminy"), -1.2,              "shuffl:dataminy");
        equals(c.model("shuffl:datamaxy"),  1.2,              "shuffl:datamaxy");
        same(c.model("shuffl:labels"), carddatagraph_labels0, "shuffl:labels");
        same(c.model("shuffl:axes"),   carddatagraph_axes0,   "shuffl:axes");
        same(c.model("shuffl:series"), carddatagraph_series0, "shuffl:series");
        // Check datagraph rendered card
        equals(c.find("ctitle").text(), "Graph card", "card title field");
        equals(c.find("ctags").text(),  "graph-card", "card tags field");
        equals(c.find("cdataminy").text(), "-1.20",   "minimum Y field");
        equals(c.find("cdatamaxy").text(),  "1.20",   "maximum Y field");
        // Instatiate datatable card
        var tc = shuffl.card.datatable.newCard("shuffl-datatable-blue", 
            'stock-blue', "card-2",
            { 'shuffl:title': "Table card"
            , 'shuffl:tags':  ["table-card"]
            , 'shuffl:uri':   "http://example.org/test-uri.csv"
            , 'shuffl:table': carddatatable_table1
            });
        // Simulate drop on datagraph card
        c.model('shuffl:source', tc);
        // Check updated datagraph model values
        equals(c.model("shuffl:title"), "Graph card (Table card)", "shuffl:title");
        equals(c.model("shuffl:tags"),  "graph-card",         "shuffl:tags");
        equals(c.model("shuffl:source_id"), "card-2",         "shuffl:source_id");
        equals(c.model("shuffl:dataminy"), 1.11,              "shuffl:dataminy");
        equals(c.model("shuffl:datamaxy"), 2.33,              "shuffl:datamaxy");
        same(c.model("shuffl:labels"), carddatagraph_labels1, "shuffl:labels");
        same(c.model("shuffl:axes"),   carddatagraph_axes1,   "shuffl:axes(2)");
        same(c.model("shuffl:series"), carddatagraph_series1, "shuffl:series");
        // Check updated datagraph rendered card
        equals(c.find("ctitle").text(), "Graph card (Table card)", "card title field");
        equals(c.find("ctags").text(),  "graph-card", "card tags field");
        equals(c.find("cdataminy").text(), "1.11", "minimum Y field");
        equals(c.find("cdatamaxy").text(), "2.33", "maximum Y field");
        // Update label on table card
        tc.model("shuffl:labels", carddatagraph_labels2);
        // Check updated datagraph model values
        equals(c.model("shuffl:dataminy"), 1.11, "shuffl:dataminy");
        equals(c.model("shuffl:datamaxy"), 2.33, "shuffl:datamaxy");
        same(c.model("shuffl:labels"), carddatagraph_labels2, "shuffl:labels");
        same(c.model("shuffl:axes"),   carddatagraph_axes1,   "shuffl:axes");
        same(c.model("shuffl:series"), carddatagraph_series1, "shuffl:series");
        // Check updated datagraph rendered card
        equals(c.find("cdataminy").text(), "1.11", "minimum Y field");
        equals(c.find("cdatamaxy").text(), "2.33", "maximum Y field");
        // Update series data on table card
        tc.model("shuffl:series", carddatagraph_series2);
        // Check updated datagraph model values
        equals(c.model("shuffl:dataminy"), 21.11, "shuffl:dataminy");
        equals(c.model("shuffl:datamaxy"), 22.33, "shuffl:datamaxy");
        same(c.model("shuffl:labels"), carddatagraph_labels2, "shuffl:labels");
        same(c.model("shuffl:axes"),   carddatagraph_axes2,   "shuffl:axes");
        same(c.model("shuffl:series"), carddatagraph_series2, "shuffl:series");
        // Check updated datagraph rendered card
        equals(c.find("cdataminy").text(), "21.11", "minimum Y field");
        equals(c.find("cdatamaxy").text(), "22.33", "maximum Y field");
    });

    test("Propagate axes changes", function ()
    {
        expect(10);
        logtest("Propagate axes changes");
        // Instantiate empty datagraph card
        var c   = shuffl.card.datagraph.newCard(
            "shuffl-datagraph-yellow", 'stock-yellow', "card-1",
            carddatagraph_data0);
        // Check datagraph model values
        same(c.model("shuffl:axes"),   carddatagraph_axes0,   "shuffl:axes");
        // Instatiate datatable card
        var tc = shuffl.card.datatable.newCard("shuffl-datatable-blue", 
            'stock-blue', "card-2",
            { 'shuffl:title': "Table card"
            , 'shuffl:tags':  ["table-card"]
            , 'shuffl:uri':   "http://example.org/test-uri.csv"
            , 'shuffl:table': carddatatable_table1
            });
        // Simulate drop on datagraph card
        c.model('shuffl:source', tc);
        // Check updated datagraph model values
        equals(c.model("shuffl:title"), "Graph card (Table card)", "shuffl:title");
        same(c.model("shuffl:axes"),    carddatagraph_axes1,       "shuffl:axes");
        // Update axes on table card
        tc.model("shuffl:axes", carddatagraph_axes3);
        // Check updated datagraph model values
        equals(c.model("shuffl:dataminy"), 1.11, "shuffl:dataminy");
        equals(c.model("shuffl:datamaxy"), 2.33, "shuffl:datamaxy");
        same(c.model("shuffl:labels"), carddatagraph_labels1, "shuffl:labels");
        same(c.model("shuffl:axes"),   carddatagraph_axes3,   "shuffl:axes");
        same(c.model("shuffl:series"), carddatagraph_series1, "shuffl:series");
        // Check updated datagraph rendered card
        equals(c.find("cdataminy").text(), "1.11", "minimum Y field");
        equals(c.find("cdatamaxy").text(), "2.33", "maximum Y field");
    });

};

// End
