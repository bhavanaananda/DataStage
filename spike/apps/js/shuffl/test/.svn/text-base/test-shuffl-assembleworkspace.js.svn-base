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
 * Test suite for card factory and common handling functions
 */

/**
 * Data
 */
var testcardhandlers_carddata = 
    { 'shuffl:id':        'card_id'
    , 'shuffl:type':      'test-type'
    , 'shuffl:version':   '0.1'
    , 'shuffl:dataref':   "card_id.json"
    , 'shuffl:datauri':   "http://example.com/path/card_id.json"
    , 'shuffl:dataRW':    true
    , 'shuffl:base-uri':  '#'
    , 'shuffl:uses-prefixes':
      [ { 'shuffl:prefix':  'shuffl', 'shuffl:uri': 'http://purl.org/NET/Shuffl/vocab#' }
      , { 'shuffl:prefix':  'rdf',    'shuffl:uri': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' }
      , { 'shuffl:prefix':  'rdfs',   'shuffl:uri': 'http://www.w3.org/2000/01/rdf-schema#' }
      , { 'shuffl:prefix':  'owl',    'shuffl:uri': 'http://www.w3.org/2002/07/owl#' }
      , { 'shuffl:prefix':  'xsd',    'shuffl:uri': 'http://www.w3.org/2001/XMLSchema#' }
      ]
    , 'shuffl:data':
      { 'shuffl:title':   "Card 1 title"
      , 'shuffl:tags':    [ 'card_1_tag', 'footag' ]
      , 'shuffl:text':    "Card 1 free-form text here<br/>line 2<br/>line3<br/>yellow"
      }
    };

var testlayoutdata = 
    { 'id':     'layout_1'
    , 'class':  'layout-class'
    , 'data':   'shuffl_sample_2_card_1.json'
    , 'pos':    {left:100, top:30}
    };

var testlayoutdatasized = 
    { 'id':     'layout_1'
    , 'class':  'layout-class'
    , 'data':   'shuffl_sample_2_card_1.json'
    , 'pos':    {left:100, top:30}
    , 'size':   {width:333, height:222}
    , 'zindex': 14
    };

var testwsdata =
    { 'shuffl:id':        'test-shuffl-saveworkspace-layout'
    , 'shuffl:class':     'shuffl:Workspace'
    , 'shuffl:version':   '0.1'
    , 'shuffl:base-uri':  '#'
    , 'shuffl:uses-prefixes':
      [ { 'shuffl:prefix':  'shuffl',  'shuffl:uri': 'http://purl.org/NET/Shuffl/vocab#' }
      , { 'shuffl:prefix':  'rdf',     'shuffl:uri': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' }
      , { 'shuffl:prefix':  'rdfs',    'shuffl:uri': 'http://www.w3.org/2000/01/rdf-schema#' }
      , { 'shuffl:prefix':  'owl',     'shuffl:uri': 'http://www.w3.org/2002/07/owl#' }
      , { 'shuffl:prefix':  'xsd',     'shuffl:uri': 'http://www.w3.org/2001/XMLSchema#' }
      ]
    , 'shuffl:workspace':
      { 'shuffl:stockbar':
          [ { 'id': 'stockpile_1', 'class': 'stock-yellow',  'label': 'Ye', 'type': 'shuffl-freetext-yellow'  }
          , { 'id': 'stockpile_2', 'class': 'stock-blue',    'label': 'Bl', 'type': 'shuffl-freetext-blue'    }
          , { 'id': 'stockpile_3', 'class': 'stock-green',   'label': 'Gr', 'type': 'shuffl-freetext-green'   }
          , { 'id': 'stockpile_4', 'class': 'stock-orange',  'label': 'Or', 'type': 'shuffl-freetext-orange'  }
          , { 'id': 'stockpile_5', 'class': 'stock-pink',    'label': 'Pi', 'type': 'shuffl-freetext-pink'    }
          , { 'id': 'stockpile_6', 'class': 'stock-purple',  'label': 'Pu', 'type': 'shuffl-freetext-purple'  }
          ]
      , 'shuffl:layout':
          [ testlayoutdata
          , testlayoutdatasized
          ]
      }
    };
    
/**
 * Function to register tests
 */

TestAssembleWorkspaceDescription = function() {

    module("TestAssembleWorkspaceDescription");

    test("shuffl.assembleWorkspaceDescription",
        function () {
            logtest("shuffl.assembleWorkspaceDescription");
            shuffl.resetWorkspace(shuffl.noop);
            jQuery('#workspace').data('wsdata', testwsdata);
            shuffl.placeCardFromData(testlayoutdata,      testcardhandlers_carddata);
            shuffl.placeCardFromData(testlayoutdatasized, testcardhandlers_carddata);
            var atomuri = "http://example.com/atomuri/";
            var feeduri = atomuri+"feeduri/";
            var ws = shuffl.assembleWorkspaceDescription(atomuri, feeduri);
            equals(ws['shuffl:id'],          "test-shuffl-saveworkspace-layout", "shuffl:id");
            equals(ws['shuffl:class'],       "shuffl:Workspace",    "shuffl:class");
            equals(ws['shuffl:version'],     "0.1",                 "shuffl:version");
            equals(ws['shuffl:base-uri'],    "#",                   "shuffl:base-uri");
            same(ws['shuffl:uses-prefixes'], 
                testwsdata['shuffl:uses-prefixes'],                 "shuffl:uses-prefixes");
            same(ws['shuffl:workspace']['shuffl:stockbar'],
                testwsdata['shuffl:workspace']['shuffl:stockbar'],  "shuffl:workspace.shuffl:stockbar");
            // Check layout entries
            var lo     = ws['shuffl:workspace']['shuffl:layout'];
            var testlo = testwsdata['shuffl:workspace']['shuffl:layout'];
            for (var i = 0; i < lo.length; i++) {
                equals(lo[i]['id'],    "card_id",                   "shuffl:layout["+i+"].id");
                equals(lo[i]['class'], "test-type",                 "shuffl:layout["+i+"].class");
                equals(lo[i]['data'],  "card_id.json",              "shuffl:layout["+i+"].data");
                var p = lo[i]['pos'];
                equals(Math.floor(p.left+0.5), testlo[i]['pos'].left,   "position-left");
                equals(Math.floor(p.top+0.5),  testlo[i]['pos'].top,    "position-top");
                var testsize = ( testlo[i]['size']
                               ? [ testlo[i]['size'], testlo[i]['size'] ]
                               : [ {width:110, height:20}, {width:140, height:25} ]
                               )
                //same(lo[i]['size'],    testsize,                    "shuffl:layout["+i+"].size");
                range(lo[i]['size'].width,  testsize[0].width,  testsize[1].width,  "shuffl:layout["+i+"].size.width");
                range(lo[i]['size'].height, testsize[0].height, testsize[1].height, "shuffl:layout["+i+"].size.height");
                var testzindex = testlo[i]['zindex'] || 11;
                same(lo[i]['zindex'],  testzindex,                  "shuffl:layout["+i+"].zindex");
            };
        });

};

// End
