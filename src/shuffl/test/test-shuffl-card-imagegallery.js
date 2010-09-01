/**
 * @fileoverview
 * Test suite for imagegallery card functions
 *  
 * @author Graham Klyne
 * @version $Id: test-shuffl-card-imagegallery.js 828 2010-06-14 15:26:11Z gk-google@ninebynine.org $
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
var testcardimagegallery_carddata = 
    { 'shuffl:id':        'card_N'
    , 'shuffl:type':      'shuffl-imagegallery-ZZZZZZ'
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
      //// @@more
      }
    };

/**
 * Function to register tests
 */

TestCardImageGallery = function() {

    module("TestCardImageGallery");

    test("shuffl.addCardFactories",
        function () {
            log.debug("test shuffl.addCardFactories");
            // Card factories are created when shuffl-card-imagegallery module is loaded
    		equals(shuffl.CardFactoryMap['shuffl-imagegallery-yellow'].cardcss, "stock-yellow", "shuffl-imagegallery-yellow");
            equals(shuffl.CardFactoryMap['shuffl-imagegallery-blue'  ].cardcss, "stock-blue",   "shuffl-imagegallery-blue");
            equals(shuffl.CardFactoryMap['shuffl-imagegallery-green' ].cardcss, "stock-green",  "shuffl-imagegallery-green");
            equals(shuffl.CardFactoryMap['shuffl-imagegallery-orange'].cardcss, "stock-orange", "shuffl-imagegallery-orange");
            equals(shuffl.CardFactoryMap['shuffl-imagegallery-pink'  ].cardcss, "stock-pink",   "shuffl-imagegallery-pink");
            equals(shuffl.CardFactoryMap['shuffl-imagegallery-purple'].cardcss, "stock-purple", "shuffl-imagegallery-purple");
        });
    
    test("shuffl.getCardFactories",
        function () {
            log.debug("test shuffl.getCardFactories");
            var c0 = shuffl.getCardFactory("default-type");
            equals(typeof c0, "function", "default factory");
    		var c1 = shuffl.getCardFactory("shuffl-imagegallery-yellow");
    		equals(typeof c1, "function", "retrieved factory yellow");
            var c2 = shuffl.getCardFactory("shuffl-imagegallery-blue");
            equals(typeof c2, "function", "retrieved factory blue");
            var c3 = shuffl.getCardFactory("shuffl-imagegallery-green");
            equals(typeof c3, "function", "retrieved factory green");
            var c4 = shuffl.getCardFactory("shuffl-imagegallery-orange");
            equals(typeof c4, "function", "retrieved factory orange");
            var c5 = shuffl.getCardFactory("shuffl-imagegallery-pink");
            equals(typeof c5, "function", "retrieved factory pink");
            var c6 = shuffl.getCardFactory("shuffl-imagegallery-purple");
            equals(typeof c6, "function", "retrieved factory purple");
        });

    test("shuffl.card.imagegallery.newCard",
        function () {
            log.debug("test shuffl.card.imagegallery.newCard");
            var css = 'stock-yellow';
    		var c   = shuffl.card.imagegallery.newCard("shuffl-imagegallery-yellow", css, "card-1",
    			{ 'shuffl:tags': 	["card-tag"]
    			, 'shuffl:title':	"card-title"
    			//// @@more
    			});
    		equals(c.attr('id'), "card-1", "card id attribute");
            ok(c.hasClass('stock-yellow'),  "yellow colour class");
            ok(c.hasClass('shuffl-card-setsize'), "shuffl card setsize class");
            equals(c.attr('class'), 'shuffl-card-setsize stock-yellow ui-resizable', "CSS class");
    		equals(c.find("cident").text(), "card-1", "card id field");
    		equals(c.find("cclass").text(), "shuffl-imagegallery-yellow", "card class field");
    		equals(c.find("ctitle").text(), "card-title", "card title field");
    		equals(c.find("ctags").text(),  "card-tag", "card tags field");
    		//// @@more
        });

    test("shuffl.createStockpiles",
        function () {
            log.debug("test shuffl.createStockpiles");
            equals(jQuery('#stockbar').children().length, 1, "old stockbar content");
    		var s1 = shuffl.createStockpile(
    			"stock_1", "stock-yellow", "Y", "shuffl-imagegallery-yellow");
            var s2 = shuffl.createStockpile(
                "stock_2", "stock-blue", "B", "shuffl-imagegallery-blue");
            var s3 = shuffl.createStockpile(
                "stock_3", "stock-green", "G", "shuffl-imagegallery-green");
            var s4 = shuffl.createStockpile(
                "stock_4", "stock-orange", "O", "shuffl-imagegallery-orange");
            var s5 = shuffl.createStockpile(
                "stock_5", "stock-pink", "P", "shuffl-imagegallery-pink");
            var s6 = shuffl.createStockpile(
                "stock_6", "stock-purple", "P", "shuffl-imagegallery-purple");
    		equals(jQuery('#stockbar').children().length, 13, "new stockbar content");
    		//1
    		equals(s1.attr('id'), "stock_1", "stock 1 id");
    	    ok(s1.hasClass("stock-yellow"), "stock 1 class");
    	    equals(s1.text(), "Y", "stock 1 label");
    	    equals(typeof s1.data('makeCard'), "function", "stock 1 function");
    	    equals(s1.data('CardType'), "shuffl-imagegallery-yellow", "stock 1 type");
    	    //2
            equals(s2.attr('id'), "stock_2", "stock 2 id");
            ok(s2.hasClass("stock-blue"), "stock 2 class");
            equals(s2.text(), "B", "stock 2 label");
            equals(typeof s2.data('makeCard'), "function", "stock 2 function");
            equals(s2.data('CardType'), "shuffl-imagegallery-blue", "stock 2 type");
            //3
            equals(s3.attr('id'), "stock_3", "stock 3 id");
            ok(s3.hasClass("stock-green"), "stock 3 class");
            equals(s3.text(), "G", "stock 3 label");
            equals(typeof s3.data('makeCard'), "function", "stock 3 function");
            equals(s3.data('CardType'), "shuffl-imagegallery-green", "stock 3 type");
            //4
            equals(s4.attr('id'), "stock_4", "stock 4 id");
            ok(s4.hasClass("stock-orange"), "stock 4 class");
            equals(s4.text(), "O", "stock 4 label");
            equals(typeof s4.data('makeCard'), "function", "stock 4 function");
            equals(s4.data('CardType'), "shuffl-imagegallery-orange", "stock 4 type");
            //5
            equals(s5.attr('id'), "stock_5", "stock 5 id");
            ok(s5.hasClass("stock-pink"), "stock 5 class");
            equals(s5.text(), "P", "stock 5 label");
            equals(typeof s5.data('makeCard'), "function", "stock 5 function");
            equals(s5.data('CardType'), "shuffl-imagegallery-pink", "stock 5 type");
            //6
            equals(s6.attr('id'), "stock_6", "stock 6 id");
            ok(s6.hasClass("stock-purple"), "stock 6 class");
            equals(s6.text(), "P", "stock 6 label");
            equals(typeof s6.data('makeCard'), "function", "stock 6 function");
            equals(s6.data('CardType'), "shuffl-imagegallery-purple", "stock 6 type");
    });

    test("shuffl.createCardFromStock",
        function () {
            log.debug("test shuffl.createCardFromStock");
			var s = shuffl.createStockpile(
			    "stock_id", "stock-green", "stock-label", "shuffl-imagegallery-green");
    		var c = shuffl.createCardFromStock(jQuery("#stock_id"));
    		var card_id = shuffl.lastId("card_");
            equals(c.attr('id'), card_id,   "card id attribute");
            ok(c.hasClass('shuffl-card'),   "shuffl card class");
            ok(c.hasClass('shuffl-card-setsize'), "shuffl card setsize class");
            ok(c.hasClass('stock-green'),   "stock-green");
            ok(c.hasClass('ui-resizable'),  "ui-resizable");
            equals(c.attr('class'), 'shuffl-card-setsize stock-green ui-resizable shuffl-card', "CSS class");
            equals(c.find("cident").text(), card_id, "card id field");
            equals(c.find("cclass").text(), "shuffl-imagegallery-green", "card type");
            equals(c.find("ctitle").text(), card_id, "card title field");
            equals(c.find("ctags").text(),  "shuffl-imagegallery-green", "card tags field");
            // Check saved card data
            var d = testcardimagegallery_carddata;
            equals(c.data('shuffl:id'),    card_id, "layout card id");
            equals(c.data('shuffl:type' ), "shuffl-imagegallery-green", "saved card type");
            equals(c.data('shuffl:external')['shuffl:id'],          card_id, "card data id");
            equals(c.data('shuffl:external')['shuffl:type'],        "shuffl-imagegallery-green", "card data class");
            equals(c.data('shuffl:external')['shuffl:version'],     d['shuffl:version'], "card data version");
            equals(c.data('shuffl:external')['shuffl:base-uri'],    d['shuffl:base-uri'], "card data base-uri");
            same(c.data('shuffl:external')['shuffl:uses-prefixes'], d['shuffl:uses-prefixes'], "card data uses-prefixes");
            equals(c.data('shuffl:external')['shuffl:data'],        undefined, "card data");
        });

    test("shuffl.createCardFromData",
        function () {
            log.debug("test shuffl.createCardFromData");
            var d = testcardimagegallery_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-imagegallery-orange", d);
            // Check card details
            equals(c.attr('id'), "cardfromdata_id", "card id attribute");
            ok(c.hasClass('shuffl-card'),   "shuffl card type");
            ok(c.hasClass('shuffl-card-setsize'),   "shuffl card setsize class");
            ok(c.hasClass('stock-orange'),  "stock-orange class");
            equals(c.attr('class'), 'shuffl-card-setsize stock-orange ui-resizable shuffl-card', "CSS class");
            equals(c.find("cident").text(), "cardfromdata_id", "card id field");
            equals(c.find("cclass").text(), "shuffl-imagegallery-orange", "card class field");
            equals(c.find("ctitle").text(), "Card N title", "card title field");
            equals(c.find("ctags").text(),  "card_N_tag,footag", "card tags field");
            same(c.data('shuffl:external'), d, "card data");
        });

    test("shuffl.createDataFromCard",
        function () {
            log.debug("test shuffl.createDataFromCard");
            // Create card (copy of code already tested)
            var d = testcardimagegallery_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-imagegallery-pink", d);
            // (Re)create data and test
            var e = shuffl.createDataFromCard(c);
            equals(e['shuffl:id'],          "cardfromdata_id",         'shuffl:id');
            equals(e['shuffl:type'],        "shuffl-imagegallery-pink",    'shuffl:type' );
            equals(e['shuffl:version'],     d['shuffl:version'],       'shuffl:version');
            equals(e['shuffl:base-uri'],    d['shuffl:base-uri'],      'shuffl:base-uri');
            same(e['shuffl:uses-prefixes'], d['shuffl:uses-prefixes'], 'shuffl:uses-prefixes');
            equals(e['shuffl:data']['shuffl:title'], "Card N title",   'shuffl:data-title');
            same(e['shuffl:data']['shuffl:tags'],  [ 'card_N_tag', 'footag' ],   'shuffl:data-tags');
        });

    test("shuffl.card.imagegallery model setting",
        function () {
            log.debug("shuffl.card.imagegallery model setting");
            expect(6);
            // Create card (copy of code already tested)
            var d = testcardimagegallery_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-imagegallery-pink", d);
            // Simulate user input: set model to update title, tags and body text
            equals(c.find("ctitle").text(), "Card N title", "card title field");
            equals(c.find("ctags").text(),  "card_N_tag,footag", "card tags field");
            equals(c.find("cbody").html(),  "Card N free-form text here<br>line 2<br>line3<br>yellow", "card body field");
            c.model("shuffl:title", "Card N updated");
            c.model("shuffl:tags", "card_N_tag,bartag");
            equals(c.find("ctitle").text(), "Card N updated", "updated title field");
            equals(c.find("ctags").text(),  "card_N_tag,bartag", "updated tags field");
        });

};

// End
