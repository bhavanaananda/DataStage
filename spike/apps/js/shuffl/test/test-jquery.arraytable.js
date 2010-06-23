/**
 * @fileoverview
 *  Test suite for jquery.arraytable
 *  
 * @author Graham Klyne
 * @version $Id: test-jquery.arraytable.js 779 2010-05-06 08:25:42Z gk-google@ninebynine.org $
 * 
 * Coypyright (C) 2009, University of Oxford
 *
 * Licensed under the MIT License.  You may obtain a copy of the License at:
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
var test_table_data_nohead =
    [ [ "row1", "1.1",  "1.2",  "1.3"  ]
    , [ "row1", "2.1",  "2.2",  "2.3"  ]
    ];

var test_table_html_nohead =
    "<table>"+
      "<tbody>"+
        "<tr><td>row1</td><td>1.1</td><td>1.2</td><td>1.3</td></tr>"+
        "<tr><td>row1</td><td>2.1</td><td>2.2</td><td>2.3</td></tr>"+
      "</tbody>"+
    "</table>";

var test_table_data =
    [ [ "",     "col1", "col2", "col3" ]
    , [ "row1", "1.1",  "1.2",  "1.3"  ]
    , [ "row1", "2.1",  "2.2",  "2.3"  ]
    , [ "End." ]
    ];

var test_table_html =
    "<table>"+
      "<thead>"+
        "<tr><th></th><th>col1</th><th>col2</th><th>col3</th></tr>"+
      "</thead>"+
      "<tbody>"+
        "<tr><td>row1</td><td>1.1</td><td>1.2</td><td>1.3</td></tr>"+
        "<tr><td>row1</td><td>2.1</td><td>2.2</td><td>2.3</td></tr>"+
        "<tr><td>End.</td></tr>"+
      "</tbody>"+
    "</table>";

/**
 * Function to register tests
 */
TestJqueryArrayTable = function()
{

    module("TestJqueryArrayTable");

    test("Create new table element from array (no headers)", function ()
    {
        logtest("TestJqueryArrayTable: Create new table element from array (no headers)");
        expect(9);
        var elm = jQuery.table(test_table_data_nohead);
        equals(elm.outerhtml(), test_table_html_nohead);
        rowelms = elm.find("tr");
        for (var i = 0 ; i < test_table_data_nohead.length ; i++) {
            var row = test_table_data_nohead[i];
            for (var j = 0 ; j < row.length ; j++) {
                equals(rowelms.eq(i).children().eq(j).text(), row[j], "table element["+i+","+j+"]");
            };
        };
    });

    test("Create new table element from array (with headers)", function ()
    {
        logtest("TestJqueryArrayTable: Create new table element from array (with headers)");
        expect(14);
        var elm = jQuery.table(test_table_data.slice(0,1), test_table_data.slice(1));
        //var elm = jQuery.table(test_table_data);
        equals(elm.outerhtml(), test_table_html);
        rowelms = elm.find("tr");
        for (var i = 0 ; i < test_table_data.length ; i++) {
            var row = test_table_data[i];
            for (var j = 0 ; j < row.length ; j++) {
                equals(rowelms.eq(i).children().eq(j).text(), row[j], "table element["+i+","+j+"]");
            };
        };
    });

    test("Insert table from array (no headers)", function ()
    {
        logtest("TestJqueryArrayTable: Insert table from array (no headers)");
        expect(9);
        var elm = jQuery("<div/>");
        elm.table(test_table_data_nohead);
        equals(elm.children().outerhtml(), test_table_html_nohead);
        for (var i = 0 ; i < test_table_data_nohead.length ; i++) {
            var row = test_table_data_nohead[i];
            for (var j = 0 ; j < row.length ; j++) {
                equals(elm.find("tr").eq(i).children().eq(j).text(), row[j], "table element["+i+","+j+"]");
            };
        };
    });

    test("Insert table from array (with headers)", function ()
    {
        logtest("TestJqueryArrayTable: Insert table from array (with headers)");
        expect(14);
        var elm = jQuery("<div/>");
        elm.table(test_table_data, 1);
        equals(elm.children().outerhtml(), test_table_html);
        for (var i = 0 ; i < test_table_data.length ; i++) {
            var row = test_table_data[i];
            for (var j = 0 ; j < row.length ; j++) {
                equals(elm.find("tr").eq(i).children().eq(j).text(), row[j], "table element["+i+","+j+"]");
            };
        };
    });

    test("Extract array from table", function ()
    {
        logtest("TestJqueryArrayTable: Extract array from table");
        expect(5);
        var elm = jQuery("<div/>");
        elm.html(test_table_html);
        var tbl = elm.table();
        equals(tbl.length, 4, "tbl.length");
        same(tbl[0], test_table_data[0], "tbl[0]");
        same(tbl[1], test_table_data[1], "tbl[1]");
        same(tbl[2], test_table_data[2], "tbl[2]");
        same(tbl[3], test_table_data[3], "tbl[3]");
    });

};

// End
