/**
 * @fileoverview
 *  Test suite for generating a list of hyperlinked datasets used to select a 
 *  dataset for display.
 *  
 * @author Graham Klyne
 * @version $Id: $
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
 * Test data values
 */

var host = "";
var silo = "admiral-test";

/**
 * Function to define test suite
 */
TestSelectDataset = function()
{
    module("TestSelectDataset");

    test("testDummyTest", function ()
    {
        logtest("testDummyTest");
        equals(2+2, 4, "dummy test");
        //equals(2+2, 5, "dummy fail");
        var array = [1,2];
        array.push(3);
        same(array, [1,2,3], "array test");
        equals( array, array.reverse(), "array test");
        same(  array.reverse(),array, "array test");
        //same(val, exp, "what");
        //ok(cond,"msg")
    });

    test("testEmptyListDatasets", function ()
    {
        logtest("testEmptyListDatasets");
        expect(2);
        function getlist(host, silo, callback)
        {
            callback([]);
        }
        var m = new admiral.AsyncComputation();
        m.eval(function(val,callback)
        {
	        admiral.listDatasets(host, silo, getlist, callback);        	
        });
        m.eval(function(val, callback)
        {
            // test val jQuery object contains expected HTML; e.g.
            //
            //	     <table id="tableDatasets">
            //	       <tr><td><a href="somehost/somesilo/dataset/somedatasets1">somedataset1</a></td></tr>
            //	       <tr><td><a href="somehost/somesilo/dataset/somedatasets2">somedataset2</a></td></tr>
            //	     </table>   
            //
            var table    = val.find("table")
            equals(table.length, 1, "HTML page contains single table");
            var tablerows = val.find("table tr")
            equals(tablerows.length, 0, "Table contains no elements");
        });
        m.exec(null,admiral.noop);
    });
    
    test("testMultipleListDatasets", function ()
    {
        logtest("testMultipleListDatasets");
	    function getlist(host, silo, callback)
	    {
	        var datasetArray =  ['a','b','c'];
	        callback(datasetArray);          
	    }
        var m = new admiral.AsyncComputation();
        m.eval(function(val, callback)
	    {
	        getlist(host,silo,callback);       
	    });
        m.eval(function(val,callback)
	    {
            this.datasetlist = val;
            var jqelem = admiral.listDatasets(host, silo, getlist, callback);           
	    });
        m.eval(function(val, callback)
        {
        	log.debug(val.html());
        	// test val jQuery object contains expected HTML; e.g.
            //
            //       <table id="tableDatasets">
            //         <tr><td><a href="somehost/somesilo/dataset/somedatasets1">somedataset1</a></td></tr>
            //         <tr><td><a href="somehost/somesilo/dataset/somedatasets2">somedataset2</a></td></tr>
            //       </table>   
            //
            var table    = val.find("table")
            equals(table.length, 1, "HTML page contains single table");
            var tablerows = val.find("table tr")
            equals(tablerows.length, 3, "Table contains three elements: "+tablerows);
            for (var i in this.datasetlist)
            {
                // test for row data    
                var expected = this.datasetlist[i];
                var rowdata =  tablerows.eq(i).find("a").text();
                equals(tablerows.eq(i).find("a").text(), expected, "Table contains element: " + rowdata);
                
                // test for row data hyperlink
                var expected = "../../DisplayDataset/html/DisplayDataset#"+ rowdata;
                var rowdatalink = tablerows.eq(i).find("a").attr('href');
                equals(rowdatalink, expected, "Table contains one element with hyperlink: " +  rowdatalink);
            }    
        });
        m.exec(null,admiral.noop);
    });
        
        
    test("testSingletonDataset", function ()
    {
        logtest("testSingletonDataset");
	    function getlist(host, silo, callback)
	    {
	        var datasetArray =  ['a'];
	        callback(datasetArray);	       
	    }

        var m = new admiral.AsyncComputation();
	    m.eval(function(val, callback)
	    {
	    	getlist(host,silo,callback);	    	
	    });
	    m.eval(function(val,callback)
	    {
	    	this.datasetlist = val;
	        var jqelem = admiral.listDatasets(host, silo, getlist, callback);           
	    });
	    m.eval(function(val, callback)
	    {
	        //log.debug(val.html());
	        // test val jQuery object contains expected HTML; e.g.
	        //
	        //       <table id="tableDatasets">
	        //         <tr><td><a href="somehost/somesilo/dataset/somedatasets1">somedataset1</a></td></tr>
	        //         <tr><td><a href="somehost/somesilo/dataset/somedatasets2">somedataset2</a></td></tr>
	        //       </table>   
	        //
	        var table    = val.find("table")
	        equals(table.length, 1, "HTML page contains single table");
	        var tablerows = val.find("table tr");
	        // test for row data
	        var expected = this.datasetlist[0];
	        var rowdata =  tablerows.eq(0).find("a").text();
	        equals(tablerows.eq(0).find("a").text(), expected, "Table contains one element: " + rowdata);
	        // test for row data hyperlink
	        var expected = "../../DisplayDataset/html/DisplayDataset#"+ rowdata;
	        var rowdatalink = tablerows.eq(0).find("a").attr('href');
	        equals(rowdatalink, expected, "Table contains one element with hyperlink: " +  rowdatalink);    
	    });
        m.exec(null,admiral.noop);
    });
}

// End
