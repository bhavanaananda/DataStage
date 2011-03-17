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
           var datasetArray = [];
            callback(datasetArray);
        }
        var m = new admiral.AsyncComputation();
        m.eval(function(val,callback)
        {
	        admiral.listDatasets(host, silo, getlist, callback);        	
        });
        m.eval(function(val, callback)
        {
            var table    = val.find("table");
            equals(table.length, 1, "HTML page contains single table");
            var tablerows = val.find("table tr");
            log.debug(tablerows);
            equals(tablerows.length, 1, "Table contains no elements, contans just a row of headers");
            callback(null);
        });
        m.exec(null, function (val)
        {
            log.debug("testEmptyListDatasets complete");
            start();
        });
        stop(2000);
    });
    
    test("testMultipleListDatasets", function ()
    {
        logtest("testMultipleListDatasets");
  	    function getlist(host, silo, callback)
  	    {
  	        var datasetArray = 
  	          [ { datasetname:'a', version:1, submittedon:"2010-11-10", submittedby:"aa" }
  	          , { datasetname:'b', version:2, submittedon:"2010-10-15", submittedby:"bb" }
  	          , { datasetname:'c', version:3, submittedon:"2010-12-17", submittedby:"cc" }
  	          ];
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
            var table    = val.find("table")
            equals(table.length, 1, "HTML page contains single table");
            var tablerows = val.find("table tr")
            // 1 Header row and 3 data rows
            equals(tablerows.length, 4, "Table contains three elements: "+tablerows);
            test.tableContents(this.datasetlist);
            callback(null); 
        });
        m.exec(null, function (val)
        {
            log.debug("testMultipleListDatasets complete");
            start();
        });
        stop(2000);
    });
        
    test("testSingletonDataset", function ()
    {
        logtest("testSingletonDataset");
  	    function getlist(host, silo, callback)
  	    {// submittedon="2010-11-10",
            var datasetArray = 
              [ { datasetname:'a', version:1,submittedon:"2010-11-10", submittedby:"aa" }
              ];
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
  	        var table    = val.find("table")
  	        equals(table.length, 1, "HTML page contains single table");
  	        var tablerows = val.find("table tr");
  	        // test for row data
  	        var expectedname = this.datasetlist[0].datasetname;
            var expectedvers = this.datasetlist[0].version;
            var expectedsubmittedon = this.datasetlist[0].submittedon;
            var expectedsubmittedby = this.datasetlist[0].submittedby;
            
            //tablerows.eq(0) yields the header row
            //tablerows.eq(1) yields the first data row
  	        var rowname =  tablerows.eq(1).find("a").text();
  	        var rowvers =  tablerows.eq(1).find("td").eq(1).text();
  	        var rowsubmittedon =  tablerows.eq(1).find("td").eq(2).text();
            var rowsubmittedby =  tablerows.eq(1).find("td").eq(3).text();
                

            //test for the tds in a row
            equals(rowname, expectedname, "Table contains one element: " + rowname);
            equals(rowvers, expectedvers, "Row 1"+ " version: " + rowvers);
            equals(rowsubmittedon, expectedsubmittedon, "Row 1"+" submitted on: " + rowsubmittedon);
            equals(rowsubmittedby, expectedsubmittedby, "Row 1"+" submitted by: " + rowsubmittedby);
            
            // test for row hyperlink
            var expected = "../../DisplayDataset/html/DisplayDataset.html#"+ rowname;
  	        var rowdatalink = tablerows.eq(1).find("a").attr('href');
  	        equals(rowdatalink, expected, "Table contains one element with hyperlink: " +  rowdatalink);   
  	        callback(null); 
  	    });
        m.exec(null, function (val)
        {
            log.debug("testSingletonDataset complete");
            start();
        });
        stop(2000);
    });
    
    test("testDatabankDatasetListing", function ()
    {
        logtest("testDatabankDatasetListing");
        if(window.location.protocol!="http:")
        {
            log.debug("Not loaded from http: Skipping test");
            return;
        }
        var m = new admiral.AsyncComputation();
        m.eval(function(val, callback)
        {   
            admiral.getDatasetList(host,silo,callback);            
        });

        m.eval(function(val,callback)
        {
            this.datasetlist = val;
            var jqelem = admiral.listDatasets(host, silo, admiral.getDatasetList, callback);        
        });
        m.eval(function(val, callback)
        {
            log.debug("admiral.listDatasets callback");
            var table     = val.find("table");
            equals(table.length, 1, "HTML page contains single table");
            var tablerows = val.find("table tr");
            // Add the 1 to the datasetlist count  to match the tablerow length( which contains the header row )
            equals(tablerows.length-1,this.datasetlist.length,"One row for each dataset");
            test.tableContents(this.datasetlist);
            callback(null);
        });
        m.exec(null, function (val)
        {   
            log.debug("testDatabankDatasetListing complete");
            start();
        });
        stop(20000);
    });
    

    test.tableContents = function (datasetlist)
    {
        for (var i in this.datasetlist)
        {
            // test for row text
            //    <tr>
            //       <td><a href="somehost/somesilo/dataset/somedatasets1">somedataset1</a></td>
            //       <td>nn</td>
            //       <td>yyyy-mm-dd</td>
            //       <td>submitter name </td>
            //    </tr>
            // test for row data    
            var expectedname = this.datasetlist[i].datasetname;
            var expectedvers = this.datasetlist[i].version;
            var expectedsubmittedon = this.datasetlist[i].submittedon;
            var expectedsubmittedby = this.datasetlist[i].submittedby;
            var rowname =  tablerows.eq(i).find("a").text();
            var rowvers =  tablerows.eq(i).find("td").eq(1).text();
            var rowsubmittedon =  tablerows.eq(i).find("td").eq(2).text();
            var rowsubmittedby =  tablerows.eq(i).find("td").eq(3).text();
            equals(rowname, expectedname, "Row "+ i +" name: " + rowname);
            equals(rowvers, expectedvers, "Row "+ i +" version: " + rowvers);
            equals(rowsubmittedon, expectedsubmittedon, "Row "+ i +" submitted on : " + rowsubmittedby);
            equals(rowsubmittedby, expectedsubmittedby, "Row "+ i +" version: submitted by " + rowsubmittedby);
            // test for row hyperlink
            var expected = "../../DisplayDataset/html/DisplayDataset.html#"+ rowname;
            var rowdatalink = tablerows.eq(i).find("a").attr('href');
            equals(rowdatalink, expected, "Row "+i+" hyperlink: " +  rowdatalink); 
        } 
    }
}

// End
