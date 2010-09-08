/**
 * @fileoverview
 *  Test suite for 00-skeleton
 *  
 * @author Graham Klyne
 * @version $Id: test-00-skeleton.js 840 2010-06-18 09:50:42Z gk-google@ninebynine.org $
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

/**
 * Function to register tests
 */
TestDatasetTree = function()
{

    module("TestDatasetTree");

    test("testSegmentPaths", function ()
    {
        logtest("testSegmentPaths");

        var seg1 = admiral.segmentPaths(["a", "b", "c"]);
        same(seg1, [["a"], ["b"], ["c"]], "Single-segment paths");

        var seg2 = admiral.segmentPaths(["a/b", "b/c", "c/d"]);
        same(seg2, [["a","b"], ["b","c"], ["c","d"]], "2-segment paths");

        var seg3 = admiral.segmentPaths([]);
        same(seg3, [], "empty list of paths");

        var seg4 = admiral.segmentPaths([""]);
        same(seg4, [[]], "list with empty path");

        var seg5 = admiral.segmentPaths(["a","","b/c/d/e"]);
        same(seg5, [["a"], [], ["b","c","d","e"]], "list with varying path lengths");

        //same(val, exp, "what");
        //ok(cond,"msg")
    });
    
    test ("testSegmentTreeBuilder", function()
    {
    	logtest("testSegmentTreeBuilder");
    	
		same(admiral.segmentTreeBuilder([["a"], ["b"], ["c"]]),
			[ { segment: 'a', subtree: null}
			, { segment: 'b', subtree: null}
			, { segment: 'c', subtree: null}
			], 
			"Single-segment paths");
        
        same(admiral.segmentTreeBuilder([["a","b"]]),
            [ { segment: 'a', subtree: [ {segment: 'b', subtree: null} ] }
            ], 
            "2-segment path");
    	
		same(admiral.segmentTreeBuilder([["a","b"], ["b","c"], ["c","d"]]),
			[ { segment: 'a', subtree: [ {segment: 'b', subtree: null} ] }
			, { segment: 'b', subtree: [ {segment: 'c', subtree: null} ] }
			, { segment: 'c', subtree: [ {segment: 'd', subtree: null} ] }
			], 
			"2-segment paths");
    	
		same(admiral.segmentTreeBuilder([]),
		    [],
			"empty list of paths");
    	
		same(admiral.segmentTreeBuilder([[]]),
		    [ { segment: '', subtree: null } ],
			"list with empty path");
    	
		same(admiral.segmentTreeBuilder([["a"], [], ["b","c","d","e"]]),
			[ { segment: 'a', subtree: null }
			, { segment: '',  subtree: null }
			, { segment: 'b', subtree: 
 			    [ { segment: 'c', subtree: 
			        [ { segment: 'd', subtree:
			            [ { segment: 'e', subtree: null } ] }
			        ] }
			    ] }
			], 
			"list with varying path lengths");

        same(admiral.segmentTreeBuilder(
            [ [ "a", "m" ]
            , [ "a", "n" ]
            , [ "a", "o" ]
            , [ "b", "p" ]
            , [ "b", "q", "r" ]
            ]),
            [ { segment: 'a', subtree: 
                [ { segment: 'm', subtree: null }
                , { segment: 'n', subtree: null }
                , { segment: 'o', subtree: null }
                ] 
              }
            , { segment: 'b', subtree:
                [ { segment: 'p', subtree: null }
                , { segment: 'q', subtree: 
                    [ { segment: 'r', subtree: null }
                    ] 
                  }
                ] 
              }
            ], 
            "list with leading segment (1 level only)");

        same(admiral.segmentTreeBuilder(
            [ [ "a", "b", "c" ]
            , [ "a", "b", "d" ]
            , [ "a", "b", "e" ]
            , [ "a", "f", "g" ]
            , [ "a", "f", "h" ]
            , [ "b", "i" ]
            , [ "b", "j" ]
            ]),
            [ { segment: 'a', subtree: 
                [ { segment: 'b', subtree:
                    [ { segment: 'c', subtree: null }
                    , { segment: 'd', subtree: null }
                    , { segment: 'e', subtree: null }
                    ] 
                  }
                , { segment: 'f', subtree: 
                    [ { segment: 'g', subtree: null }
                    , { segment: 'h', subtree: null }
                    ] 
                  }
                ] 
              }
            , { segment: 'b', subtree:
                [ { segment: 'i', subtree: null }
                , { segment: 'j', subtree: null }
                ] 
              }
            ], 
            "list with common leading segment sequences");
    
        same(admiral.segmentTreeBuilder(
            [ [ "a", "b", "c" ]
            , [ "a", "b", "d" ]
            , [ "a", "b", "d" ]
            , [ "b", "j" ]
            ]),
            [ { segment: 'a', subtree: 
                [ { segment: 'b', subtree:
                    [ { segment: 'c', subtree: null }
                    , { segment: 'd', subtree: null }
                    ] 
                  }
                ] 
              }
            , { segment: 'b', subtree:
                [ { segment: 'j', subtree: null }
                ] 
              }
            ], 
            "list with 2 or more identical seglists");
    
        same(admiral.segmentTreeBuilder(
            [ [ "a", "b", "c" ]
            , [ "a", "b" ]
            , [ "a", "b", "d" ]
            , [ "b", "j" ]
            ]), 
            [ { segment: 'a', subtree: 
                [ { segment: 'b', subtree:
                    [ { segment: 'c', subtree: null }
                    , { segment: 'd', subtree: null }
                    ] 
                  }
                ] 
              }
            , { segment: 'b', subtree:
                [ { segment: 'j', subtree: null }
                ] 
              }
            ], 
            "node used as branch and leaf (1)");
    
        same(admiral.segmentTreeBuilder(
            [ [ "a", "b", "c" ]
            , [ "a", "b", "d" ]
            , [ "a", "b" ]
            , [ "b", "j" ]
            ]), 
            [ { segment: 'a', subtree: 
                [ { segment: 'b', subtree:
                    [ { segment: 'c', subtree: null }
                    , { segment: 'd', subtree: null }
                    ] 
                  }
                ] 
              }
            , { segment: 'b', subtree:
                [ { segment: 'j', subtree: null }
                ] 
              }
            ], 
            "node used as branch and leaf (2)");

    });
    
    notest("testLeafAsNode", function()
    {
        logtest("testLeafAsNode");
        var exceptionSeen = false;
        try 
        {    
	        var x = admiral.segmentTreeBuilder(
	            [ [ "a", "b", "c" ]
	            , [ "a", "b" ]
	            , [ "a", "b", "d" ]
	            , [ "b", "j" ]
	            ]); 
        } catch (e)
        {
        	equals(e.toString(), "admiral error: node used as branch and leaf");
        	exceptionSeen = true;
        } 
        ok(exceptionSeen, "exception expected");     
            
        exceptionSeen = false;
        try 
        {    
            var x = admiral.segmentTreeBuilder(
                [ [ "a", "b", "c" ]
                , [ "a", "b", "d" ]
                , [ "a", "b" ]
                , [ "b", "j" ]
                ]); 
        } catch (e)
        {
            equals(e.toString(), "admiral error: node used as branch and leaf");
            exceptionSeen = true;
        } 
        ok(exceptionSeen, "exception expected");
    });




/*

  <ul id="example" class="filetree">
        <li><span class="folder">Folder 1</span>
            <ul>
                <li><span class="file">Item 1.1</span></li>
            </ul>
        </li>
        <li><span class="folder">Folder 2</span>
            <ul>
                <li><span class="folder">Subfolder 2.1</span>
                    <ul>
                        <li><span class="file">File 2.1.1</span></li>
                        <li><span class="file">File 2.1.2</span></li>
                    </ul>
                </li>
                <li><span class="file">File 2.2</span></li>
            </ul>
        </li>
        <li class="closed"><span class="folder">Folder 3 (closed at start)</span>
            <ul>
                <li><span class="file">File 3.1</span></li>
            </ul>
        </li>
        <li><span class="file">File 4</span></li>
    </ul>

*/

    test ("testNestedListBuilder", function()
    {
        logtest("testNestedListBuilder");        

        var tree1 =
            [ { segment: 'a', subtree: null}
            , { segment: 'b', subtree: null}
            , { segment: 'c', subtree: null}
            ];
        var jelem1 = jQuery("<ul class='filetree' />")
            .append("<li><span class='file'>a</span></li>")
            .append("<li><span class='file'>b</span></li>")
            .append("<li><span class='file'>c</span></li>")
            ;
        same(admiral.nestedListBuilder(tree1).outerhtml(), jelem1.outerhtml(), "Single-segment paths");

        var jelem2 = jQuery("<ul class='filetree' />")
            .append("<li><span class='folder'>a</span></li>")
            .find("li:last")
                .append("<ul />")
                .find("ul:last")
                    .append("<li><span class='file'>b</span></li>")
                .end()
            .end();
        same(admiral.nestedListBuilder(
            [ { segment: 'a', subtree: [ {segment: 'b', subtree: null} ] }
            ] ).outerhtml(),
            jelem2.outerhtml(),
            "2-segment path");

        var jelem3 = jQuery("<ul class='filetree' />")
            .append("<li><span class='folder'>a</span></li>")
            .find("li:last")
                .append("<ul />")
                .find("ul:last")
                    .append("<li><span class='file'>b</span></li>")
                .end()
            .end()
            .append("<li><span class='folder'>b</span></li>")
            .find("li:last")
                .append("<ul />")
                .find("ul:last")
                    .append("<li><span class='file'>c</span></li>")
                .end()
            .end()
            .append("<li><span class='folder'>c</span></li>")
            .find("li:last")
                .append("<ul />")
                .find("ul:last")
                    .append("<li><span class='file'>d</span></li>")
                .end()
            .end()
            ;
        same(admiral.nestedListBuilder(
            [ { segment: 'a', subtree: [ {segment: 'b', subtree: null} ] }
            , { segment: 'b', subtree: [ {segment: 'c', subtree: null} ] }
            , { segment: 'c', subtree: [ {segment: 'd', subtree: null} ] }
            ] ).outerhtml(),
            jelem3.outerhtml(),
            "2-segment paths");

        var jelem4 = jQuery("<ul class='filetree' />");
        same(admiral.nestedListBuilder(
            [ 
            ] ).outerhtml(),
            jelem4.outerhtml(),
            "empty list of paths");
        
        var jelem5 = jQuery("<ul class='filetree' />")
            .append("<li><span class='file'></span></li>")
            ;
        same(admiral.nestedListBuilder(
            [ { segment: '', subtree: null } 
            ] ).outerhtml(),
            jelem5.outerhtml(),
            "list with empty path");
        
        var jelem6 = jQuery("<ul class='filetree' />")
            .append("<li><span class='file'>a</span></li>")
            .append("<li><span class='file'></span></li>")
            .append("<li><span class='folder'>b</span></li>")
            .find("li:last")
                .append("<ul />")
                .find("ul:last")
                    .append("<li><span class='folder'>c</span></li>")
                    .find("li:last")
		                .append("<ul />")
		                .find("ul:last")
		                    .append("<li><span class='folder'>d</span></li>")
		                    .find("li:last")
		                        .append("<ul />")
		                        .find("ul:last")
		                            .append("<li><span class='file'>e</span></li>")
                                .end()
                            .end()
                        .end()
                    .end()	                        
                .end()
            .end()
            ;
        same(admiral.nestedListBuilder(
            [ { segment: 'a', subtree: null }
            , { segment: '',  subtree: null }
            , { segment: 'b', subtree: 
                [ { segment: 'c', subtree: 
                    [ { segment: 'd', subtree:
                        [ { segment: 'e', subtree: null } ] }
                    ] }
                ] }
            ] ).outerhtml(),
            jelem6.outerhtml(),
            "list with varying path lengths");
        
        var jelem7 = jQuery("<ul class='filetree' />")
            .append("<li><span class='folder'>a</span></li>")
            .find("li:last")
                .append("<ul />")
                .find("ul:last")
		            .append("<li><span class='file'>m</span></li>")
                    .append("<li><span class='file'>n</span></li>")
                    .append("<li><span class='file'>o</span></li>")
                .end()
            .end()
            .append("<li><span class='folder'>b</span></li>")
            .find("li:last")
                .append("<ul />")
                .find("ul:last")
                    .append("<li><span class='file'>p</span></li>")
		            .append("<li><span class='folder'>q</span></li>")
		            .find("li:last")
		                .append("<ul />")
		                .find("ul:last")
		                    .append("<li><span class='file'>r</span></li>")
		                .end()
		            .end()
                .end()
            .end()
            ;
        same(admiral.nestedListBuilder(
            [ { segment: 'a', subtree: 
                [ { segment: 'm', subtree: null }
                , { segment: 'n', subtree: null }
                , { segment: 'o', subtree: null }
                ] 
              }
            , { segment: 'b', subtree:
                [ { segment: 'p', subtree: null }
                , { segment: 'q', subtree: 
                    [ { segment: 'r', subtree: null }
                    ] 
                  }
                ] 
              }
            ] ).outerhtml(),
            jelem7.outerhtml(),
            "list with leading segment (1 level only)");

        var jelem8a = jQuery("<ul class='filetree' />")
            .append("<li><span class='folder'>a</span></li>")
            .find("li:last")
                .append("<ul />")
                .find("ul:last")
                    .append("<li><span class='folder'>b</span></li>")
                    .find("li:last")
                        .append("<ul />")
                        .find("ul:last")
                            .append("<li><span class='file'>c</span></li>")
                            .append("<li><span class='file'>d</span></li>")
                            .append("<li><span class='file'>e</span></li>")
                        .end()
                    .end()
                    .append("<li><span class='folder'>f</span></li>")
                    .find("li:last")
                        .append("<ul />")
                        .find("ul:last")
                            .append("<li><span class='file'>g</span></li>")
                            .append("<li><span class='file'>h</span></li>")
                        .end()
                    .end()
                .end()
            .end()
            .append("<li><span class='folder'>i</span></li>")
            .find("li:last")
                .append("<ul />")
                .find("ul:last")
                    .append("<li><span class='file'>j</span></li>")
                    .append("<li><span class='file'>k</span></li>")
                .end()
            .end()
            ;
        var jelem8 = jQuery(
            "<ul class='filetree'>"+
              "<li><span class='folder'>a</span>"+
                "<ul>"+
	              "<li><span class='folder'>b</span>"+
	                "<ul>"+
                      "<li><span class='file'>c</span></li>"+
                      "<li><span class='file'>d</span></li>"+
                      "<li><span class='file'>e</span></li>"+
	                "</ul>"+
	              "</li>"+
                  "<li><span class='folder'>f</span>"+
                    "<ul>"+
                      "<li><span class='file'>g</span></li>"+
                      "<li><span class='file'>h</span></li>"+
                    "</ul>"+
                  "</li>"+
                "</ul>"+
              "</li>"+
              "<li><span class='folder'>i</span>"+
                "<ul>"+
                  "<li><span class='file'>j</span></li>"+
                  "<li><span class='file'>k</span></li>"+
                "</ul>"+
              "</li>"+
            "</ul>"
            );
        same(admiral.nestedListBuilder(
            [ { segment: 'a', subtree: 
                [ { segment: 'b', subtree:
                    [ { segment: 'c', subtree: null }
                    , { segment: 'd', subtree: null }
                    , { segment: 'e', subtree: null }
                    ] 
                  }
                , { segment: 'f', subtree: 
                    [ { segment: 'g', subtree: null }
                    , { segment: 'h', subtree: null }
                    ] 
                  }
                ] 
              }
            , { segment: 'i', subtree:
                [ { segment: 'j', subtree: null }
                , { segment: 'k', subtree: null }
                ] 
              }
            ] ).outerhtml(),
            jelem8.outerhtml(),
            "list with common leading segment sequences");

    });

};



// End
