/**
 * @fileoverview
 *  Test suite for dataset submission
 *  
 * @author Bhavana Ananda
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
TestSubmitDataset = function()
{
    module("TestSubmitDataset");

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

    test("testSubmitToolDirectoryTreeListing",function()
    {
        // Ensure tree depth and content 
        
        // Compare the tree content with the Json obtained from the ADMIRAL Server 
        
    });
    
    
    test("testMetadataFieldsOnDatasetDetailsPage",function()
    {
        // Before Selection: Ensure that the metadata fields are blank
        
        // After Selection: Ensure that the fields refect the data from the ADMIRAL manifest
        
    });
    
    test("testMetadataFieldsOnDatasetConfirmationPage",function()
    {
        // Ensure that the fields refect the data from the ADMIRAL manifest
        
    });
    
    test("testDatasetCreationFromTool",function()
    {
        // Ensure that the dataset  is created in the databank - Compare number of datasets in the Databnk before and after submission, should be one more
 
        // Ensure version  = 1       
        
    });
    
    test("testDatasetUpdateFromTool",function()
    {
       // Ensure that the dataset  is not created in the databank - Compare number of datasets in the Databnk before and after submission, should be same
 
       // Ensure version  = Pevious version + 1
           
    });    
}

// End
