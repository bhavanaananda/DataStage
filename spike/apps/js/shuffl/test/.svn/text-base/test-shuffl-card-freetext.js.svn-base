/**
 * @fileoverview
 * Test suite for free text card functions
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
var testcardfreetext_carddata = 
    { 'shuffl:id':        'card_N'
    , 'shuffl:type':      'shuffl-freetext-ZZZZZZ'
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
      , 'shuffl:text':    "Card N free-form text here<br/>line 2<br/>line3<br/>yellow"
      }
    };

/**
 * Function to register tests
 */

TestCardFreetext = function() {

    module("TestCardFreetext");

    test("shuffl.addCardFactories",
        function () {
            logtest("TestCardFreetext: shuffl.addCardFactories");
            // Card factories are created when shuffl-card-freetext module is loaded
            equals(shuffl.CardFactoryMap['shuffl-freetext-yellow'].cardcss, "stock-yellow", "shuffl-freetext-yellow");
            equals(shuffl.CardFactoryMap['shuffl-freetext-blue'  ].cardcss, "stock-blue",   "shuffl-freetext-blue");
            equals(shuffl.CardFactoryMap['shuffl-freetext-green' ].cardcss, "stock-green",  "shuffl-freetext-green");
            equals(shuffl.CardFactoryMap['shuffl-freetext-orange'].cardcss, "stock-orange", "shuffl-freetext-orange");
            equals(shuffl.CardFactoryMap['shuffl-freetext-pink'  ].cardcss, "stock-pink",   "shuffl-freetext-pink");
            equals(shuffl.CardFactoryMap['shuffl-freetext-purple'].cardcss, "stock-purple", "shuffl-freetext-purple");
        });
    
    test("shuffl.getCardFactories",
        function () {
            logtest("TestCardFreetext: test shuffl.getCardFactories");
            var c0 = shuffl.getCardFactory("default-type");
            equals(typeof c0, "function", "default factory");
            var c1 = shuffl.getCardFactory("shuffl-freetext-yellow");
            equals(typeof c1, "function", "retrieved factory yellow");
            var c2 = shuffl.getCardFactory("shuffl-freetext-blue");
            equals(typeof c2, "function", "retrieved factory blue");
            var c3 = shuffl.getCardFactory("shuffl-freetext-green");
            equals(typeof c3, "function", "retrieved factory green");
            var c4 = shuffl.getCardFactory("shuffl-freetext-orange");
            equals(typeof c4, "function", "retrieved factory orange");
            var c5 = shuffl.getCardFactory("shuffl-freetext-pink");
            equals(typeof c5, "function", "retrieved factory pink");
            var c6 = shuffl.getCardFactory("shuffl-freetext-purple");
            equals(typeof c6, "function", "retrieved factory purple");
        });

    test("shuffl.card.freetext.newCard",
        function () {
            logtest("TestCardFreetext: shuffl.card.freetext.newCard");
            var css = 'stock-yellow';
            var c   = shuffl.card.freetext.newCard("shuffl-freetext-yellow", css, "card-1",
            	{ 'shuffl:tags': 	["card-tag"]
            	, 'shuffl:title':	"card-title"
            	, 'shuffl:text':    "card body data"
            	});
            equals(c.attr('id'), "card-1", "card id attribute");
            //ok(c.hasClass('shuffl-card'),   "shuffl card class");
            ok(c.hasClass('stock-yellow'),  "yellow colour class");
            ok(c.hasClass('shuffl-card-setsize'),   "shuffl card setsize class");
            equals(c.attr('class'), 'shuffl-card-setsize stock-yellow ui-resizable', "CSS class");
            equals(c.find("cident").text(), "card-1", "card id field");
            equals(c.find("cclass").text(), "shuffl-freetext-yellow", "card class field");
            equals(c.find("ctitle").text(), "card-title", "card title field");
            equals(c.find("ctags").text(),  "card-tag", "card tags field");
            equals(c.find("cbody").text(),  "card body data", "card body field");
        });

    test("shuffl.createStockpiles",
        function () {
            logtest("TestCardFreetext: shuffl.createStockpiles");
            equals(jQuery('#stockbar').children().length, 1, "old stockbar content");
            var s1 = shuffl.createStockpile(
            	"stock_1", "stock-yellow", "Y", "shuffl-freetext-yellow");
            var s2 = shuffl.createStockpile(
                "stock_2", "stock-blue", "B", "shuffl-freetext-blue");
            var s3 = shuffl.createStockpile(
                "stock_3", "stock-green", "G", "shuffl-freetext-green");
            var s4 = shuffl.createStockpile(
                "stock_4", "stock-orange", "O", "shuffl-freetext-orange");
            var s5 = shuffl.createStockpile(
                "stock_5", "stock-pink", "P", "shuffl-freetext-pink");
            var s6 = shuffl.createStockpile(
                "stock_6", "stock-purple", "P", "shuffl-freetext-purple");
            equals(jQuery('#stockbar').children().length, 13, "new stockbar content");
            //1
            equals(s1.attr('id'), "stock_1", "stock 1 id");
            ok(s1.hasClass("stock-yellow"), "stock 1 class");
            equals(s1.text(), "Y", "stock 1 label");
            equals(typeof s1.data('makeCard'), "function", "stock 1 function");
            equals(s1.data('CardType'), "shuffl-freetext-yellow", "stock 1 type");
            //2
            equals(s2.attr('id'), "stock_2", "stock 2 id");
            ok(s2.hasClass("stock-blue"), "stock 2 class");
            equals(s2.text(), "B", "stock 2 label");
            equals(typeof s2.data('makeCard'), "function", "stock 2 function");
            equals(s2.data('CardType'), "shuffl-freetext-blue", "stock 2 type");
            //3
            equals(s3.attr('id'), "stock_3", "stock 3 id");
            ok(s3.hasClass("stock-green"), "stock 3 class");
            equals(s3.text(), "G", "stock 3 label");
            equals(typeof s3.data('makeCard'), "function", "stock 3 function");
            equals(s3.data('CardType'), "shuffl-freetext-green", "stock 3 type");
            //4
            equals(s4.attr('id'), "stock_4", "stock 4 id");
            ok(s4.hasClass("stock-orange"), "stock 4 class");
            equals(s4.text(), "O", "stock 4 label");
            equals(typeof s4.data('makeCard'), "function", "stock 4 function");
            equals(s4.data('CardType'), "shuffl-freetext-orange", "stock 4 type");
            //5
            equals(s5.attr('id'), "stock_5", "stock 5 id");
            ok(s5.hasClass("stock-pink"), "stock 5 class");
            equals(s5.text(), "P", "stock 5 label");
            equals(typeof s5.data('makeCard'), "function", "stock 5 function");
            equals(s5.data('CardType'), "shuffl-freetext-pink", "stock 5 type");
            //6
            equals(s6.attr('id'), "stock_6", "stock 6 id");
            ok(s6.hasClass("stock-purple"), "stock 6 class");
            equals(s6.text(), "P", "stock 6 label");
            equals(typeof s6.data('makeCard'), "function", "stock 6 function");
            equals(s6.data('CardType'), "shuffl-freetext-purple", "stock 6 type");
    });

    test("shuffl.createCardFromStock",
        function () {
            logtest("TestCardFreetext: shuffl.createCardFromStock");
            var s = shuffl.createStockpile(
                "stock_id", "stock-green", "stock-label", "shuffl-freetext-green");
            var c = shuffl.createCardFromStock(jQuery("#stock_id"));
            ////log.debug("- card "+shuffl.objectString(c));
            var card_id = shuffl.lastId("card_");
            equals(c.attr('id'), card_id, "card id attribute");
            ok(c.hasClass('shuffl-card'),   "shuffl card class");
            ok(c.hasClass('shuffl-card-setsize'),   "shuffl card setsize class");
            ok(c.hasClass('stock-green'),   "stock-green");
            ok(c.hasClass('ui-resizable'),  "ui-resizable");
            equals(c.attr('class'), 'shuffl-card-setsize stock-green ui-resizable shuffl-card', "CSS class");
            equals(c.find("cident").text(), card_id, "card id field");
            equals(c.find("cclass").text(), "shuffl-freetext-green", "card type");
            equals(c.find("ctitle").text(), card_id, "card title field");
            equals(c.find("ctags").text(),  "shuffl-freetext-green", "card tags field");
            // Check saved card data
            var d = testcardfreetext_carddata;
            equals(c.data('shuffl:id'),    card_id, "layout card id");
            equals(c.data('shuffl:type' ), "shuffl-freetext-green", "saved card type");
            equals(c.data('shuffl:external')['shuffl:id'],          card_id, "card data id");
            equals(c.data('shuffl:external')['shuffl:type'],        "shuffl-freetext-green", "card data class");
            equals(c.data('shuffl:external')['shuffl:version'],     d['shuffl:version'], "card data version");
            equals(c.data('shuffl:external')['shuffl:base-uri'],    d['shuffl:base-uri'], "card data base-uri");
            same(c.data('shuffl:external')['shuffl:uses-prefixes'], d['shuffl:uses-prefixes'], "card data uses-prefixes");
            equals(c.data('shuffl:external')['shuffl:data'],        undefined, "card data");
        });

    test("shuffl.createCardFromData",
        function () {
            logtest("TestCardFreetext: shuffl.createCardFromData");
            var d = testcardfreetext_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-freetext-orange", d);
            // Check card details
            equals(c.attr('id'), "cardfromdata_id", "card id attribute");
            ok(c.hasClass('shuffl-card'),   "shuffl card type");
            ok(c.hasClass('shuffl-card-setsize'),   "shuffl card setsize class");
            ok(c.hasClass('stock-orange'),  "stock-orange class");
            equals(c.attr('class'), 'shuffl-card-setsize stock-orange ui-resizable shuffl-card', "CSS class");
            equals(c.find("cident").text(), "cardfromdata_id", "card id field");
            equals(c.find("cclass").text(), "shuffl-freetext-orange", "card class field");
            equals(c.find("ctitle").text(), "Card N title", "card title field");
            equals(c.find("ctags").text(),  "card_N_tag,footag", "card tags field");
            same(c.data('shuffl:external'), d, "card data");
        });

    test("shuffl.createDataFromCard",
        function () {
            logtest("TestCardFreetext: shuffl.createDataFromCard");
            // Create card (copy of code already tested)
            var d = testcardfreetext_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-freetext-pink", d);
            // (Re)create data and test
            var e = shuffl.createDataFromCard(c);
            equals(e['shuffl:id'],          "cardfromdata_id",         'shuffl:id');
            equals(e['shuffl:type'],        "shuffl-freetext-pink",    'shuffl:type' );
            equals(e['shuffl:version'],     d['shuffl:version'],       'shuffl:version');
            equals(e['shuffl:base-uri'],    d['shuffl:base-uri'],      'shuffl:base-uri');
            same(e['shuffl:uses-prefixes'], d['shuffl:uses-prefixes'], 'shuffl:uses-prefixes');
            equals(e['shuffl:data']['shuffl:title'], "Card N title",   'shuffl:data-title');
            same(e['shuffl:data']['shuffl:tags'],  [ 'card_N_tag', 'footag' ],   'shuffl:data-tags');
            equals(e['shuffl:data']['shuffl:text'],  
                "Card N free-form text here<br/>line 2<br/>line3<br/>yellow",
                'shuffl:data-text');
        });

    test("shuffl.card.freetext model setting",
        function () {
            logtest("TestCardFreetext: shuffl.card.freetext model setting");
            expect(6);
            // Create card (copy of code already tested)
            var d = testcardfreetext_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-freetext-pink", d);
            // Simulate user input: set model to update title, tags and body text
            equals(c.find("ctitle").text(), "Card N title", "card title field");
            equals(c.find("ctags").text(),  "card_N_tag,footag", "card tags field");
            equals(c.find("cbody").html(),  "Card N free-form text here<br>line 2<br>line3<br>yellow", "card body field");
            c.model("shuffl:title", "Card N updated");
            c.model("shuffl:tags", "card_N_tag,bartag");
            c.model("shuffl:text", "Card N updated text<br/>more");
            equals(c.find("ctitle").text(), "Card N updated", "updated title field");
            equals(c.find("ctags").text(),  "card_N_tag,bartag", "updated tags field");
            equals(c.find("cbody").html(),  "Card N updated text<br>more", "updated body field");
        });

};

// End
