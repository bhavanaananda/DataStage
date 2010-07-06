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
 * Test suite for jquery.readcsv plugin
 */

/**
 * Test data values
 */
test_shuffl_csv = (
    "rowlabel,col1,col2,col3,col4"+"\n"+
    "row1,a1,b1,c1,d1"+"\n"+
    " row2 , a2 , b2 , c2 , d2 "+"\n"+
    " row3 , a3 3a , b3 3b , c3 3c , d3 3d "+"\n"+
    " ' row4 ' , ' a4 ' , ' b4 ' , ' c4 ' , ' d4 ' "+"\n"+
    ' " row5 " , " a5 " , " b5 " , " c5 " , " d5 " '+"\n"+
    " 'row6' , 'a6,6a' , 'b6,6b' , 'c6,6c' , 'd6,6d' "+"\n"+
    " 'row7' , 'a7''7a' , 'b7''7b' , 'c7''7c' , 'd7''7d' "+"\n"+
    " 'row8' , 'a8'', 8a' , 'b8'', 8b' , 'c8'', 8c' , 'd8'', 8d' "+"\n"+
    "End.");

/**
 * Graph data test data values
 */
test_shuffl_csv_c135 = (
    '"x", "c=cos x", "c3=cos 3x", "c5=cos 5x"' +'\n'+
    '"0.0",  "1",       "1",       "1"'        +'\n'+
    '"0.2",  "0.9801",  "0.8253", "0.5403"'    +'\n'+
    '"0.4",  "0.9211",  "0.3624", "-0.4161"'   +'\n'+
    '"0.6",  "0.8253",  "-0.2272", "-0.99"'    +'\n'+
    '"0.8",  "0.6967",  "-0.7374", "-0.6536"'  +'\n'+
    '"1.0",  "0.5403",  "-0.99", "0.2837"');

/**
 * Function to register tests
 */
TestJqueryReadCSV = function() {

    module("TestJqueryReadCSV");

    test("parse simple CSV from string", function ()
    {
        logtest("TestJqueryReadCSV: parse simple CSV from string");
        expect(4);
        var csv = (
            "rowlabel,col1,col2,col3,col4"+"\n"+
            "row1,a1,b1,c1,d1"+"\n"+
            "End.");
        var tbl = jQuery.csv(",")(csv);
        equals(tbl.length, 3, "just three rows");
        same(tbl[0],["rowlabel", "col1", "col2", "col3", "col4"], "header row");
        same(tbl[1],["row1", "a1", "b1", "c1", "d1"],             "row 1");
        same(tbl[2],["End."],                                     "end row");
    });

    test("parse CSV quoted values from string", function ()
    {
        logtest("TestJqueryReadCSV: parse CSV quoted values from string");
        expect(4);
        var csv = (
            " ' row4 ' , ' a4 ' , ' b4 ' , ' c4 ' , ' d4 ' "+"\n"+
            ' " row5 " , " a5 " , " b5 " , " c5 " , " d5 " '+"\n"+
            "End.");
        var tbl = jQuery.csv(",")(csv);
        equals(tbl.length, 3, "just three rows");
        same(tbl[0],[" row4 ", " a4 ", " b4 ", " c4 ", " d4 "],  "row 4");
        same(tbl[1],[" row5 ", " a5 ", " b5 ", " c5 ", " d5 "],  "row 5");
        same(tbl[2],["End."],                                    "end row");
    });

    test("parse more complicated CSV from string", function ()
    {
        logtest("TestJqueryReadCSV: parse more complicated CSV from string");
        expect(11);
        var tbl = jQuery.csv(",")(test_shuffl_csv);
        equals(tbl.length, 10, "ten rows");
        same(tbl[0],["rowlabel", "col1", "col2", "col3", "col4"],         "header row");
        same(tbl[1],["row1", "a1", "b1", "c1", "d1"],                     "row 1");
        same(tbl[2],["row2", "a2", "b2", "c2", "d2"],                     "row 2");
        same(tbl[3],["row3", "a3 3a", "b3 3b", "c3 3c", "d3 3d"],         "row 3");
        same(tbl[4],[" row4 ", " a4 ", " b4 ", " c4 ", " d4 "],           "row 4");
        same(tbl[5],[" row5 ", " a5 ", " b5 ", " c5 ", " d5 "],           "row 5");
        same(tbl[6],["row6", "a6,6a", "b6,6b", "c6,6c", "d6,6d"],         "row 6");
        same(tbl[7],["row7", "a7'7a", "b7'7b", "c7'7c", "d7'7d"],         "row 7");
        same(tbl[8],["row8", "a8', 8a", "b8', 8b", "c8', 8c", "d8', 8d"], "row 8");
        same(tbl[9],["End."],                                             "end row");
    });

    test("parse graph data CSV from string", function ()
    {
        logtest("TestJqueryReadCSV: parse graph data CSV from string");
        expect(8);
        var tbl = jQuery.csv(",")(test_shuffl_csv_c135);
        equals(tbl.length, 7, "7 rows");
        same(tbl[0],[ "x", "c=cos x", "c3=cos 3x", "c5=cos 5x" ], "header row");
        same(tbl[1],[ "0.0", "1", "1", "1" ],                     "row 1");
        same(tbl[2],[ "0.2", "0.9801", "0.8253", "0.5403" ],      "row 2");
        same(tbl[3],[ "0.4", "0.9211", "0.3624", "-0.4161" ],     "row 3");
        same(tbl[4],[ "0.6", "0.8253", "-0.2272", "-0.99" ],      "row 4");
        same(tbl[5],[ "0.8", "0.6967", "-0.7374", "-0.6536" ],    "row 5");
        same(tbl[6],[ "1.0", "0.5403", "-0.99", "0.2837" ],       "row 6");
    });

    test("read file as string", function ()
    {
        logtest("TestJqueryReadCSV: read file as string");
        expect(2);
        function checkdata(data, status) {
            //log.debug("jQuery.get data: "+jQuery.toJSON(data));
            equals(status, "success", "jQuery.get status");
            equals(jQuery.toJSON(data), jQuery.toJSON(test_shuffl_csv), "jQuery.get data");
            start();
        };
        jQuery.get("data/test-csv.csv", {}, checkdata, "text");
        stop(2000);
    });

    test("read file as CSV", function ()
    {
        logtest("TestJqueryReadCSV: read file as CSV");
        expect(11);
        function checkdata(tbl, status) {
            equals(status, "success", "jQuery.get status");
            same(tbl[0],["rowlabel", "col1", "col2", "col3", "col4"],         "header row");
            same(tbl[1],["row1", "a1", "b1", "c1", "d1"],                     "row 1");
            same(tbl[2],["row2", "a2", "b2", "c2", "d2"],                     "row 2");
            same(tbl[3],["row3", "a3 3a", "b3 3b", "c3 3c", "d3 3d"],         "row 3");
            same(tbl[4],[" row4 ", " a4 ", " b4 ", " c4 ", " d4 "],             "row 4");
            same(tbl[5],[" row5 ", " a5 ", " b5 ", " c5 ", " d5 "],             "row 5");
            same(tbl[6],["row6", "a6,6a", "b6,6b", "c6,6c", "d6,6d"],         "row 6");
            same(tbl[7],["row7", "a7'7a", "b7'7b", "c7'7c", "d7'7d"],         "row 7");
            same(tbl[8],["row8", "a8', 8a", "b8', 8b", "c8', 8c", "d8', 8d"], "row 8");
            same(tbl[9],["End."],                                             "end row");
            start();
        };
        jQuery.getCSV("data/test-csv.csv", checkdata);
        stop(2000);
    });

    test("read graph data file as CSV", function ()
    {
        logtest("TestJqueryReadCSV: read graph data file as CSV");
        expect(10);
        function checkdata(tbl, status) {
            equals(status, "success", "jQuery.get status");
            equals(tbl.length, 7, "7 rows");
            same(tbl[0],[ "x", "c=cos x", "c3=cos 3x", "c5=cos 5x" ],         "header row");
            same(tbl[1],[ "0.0", "1", "1", "1" ],                     "row 1");
            same(tbl[2],[ "0.2", "0.9801", "0.8253", "0.5403" ],      "row 2");
            same(tbl[3],[ "0.4", "0.9211", "0.3624", "-0.4161" ],     "row 3");
            same(tbl[4],[ "0.6", "0.8253", "-0.2272", "-0.99" ],      "row 4");
            same(tbl[5],[ "0.8", "0.6967", "-0.7374", "-0.6536" ],    "row 5");
            same(tbl[6],[ "1.0", "0.5403", "-0.99", "0.2837" ],       "row 6");
            same(tbl[7],undefined,                                    "row 7");
            start();
        };
        jQuery.getCSV("data/test-csv-graph-c135.csv", checkdata);
        stop(2000);
    });

    test("read invalid CSV from file", function ()
    {
        logtest("TestJqueryReadBadCSV: read invalid CSV from file");
        expect(2);
        function checkdata(tbl, status) {
            equals(status, "invalidCSV", "jQuery.getCSV status");
            equals(tbl, null, "null response");
            start();
        };
        jQuery.getCSV("data/test-bad-csv.txt", checkdata);
        stop(2000);
    });

};

// End
