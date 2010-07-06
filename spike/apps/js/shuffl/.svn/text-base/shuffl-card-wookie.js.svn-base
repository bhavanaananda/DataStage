/** 
 * @fileoverview 
 *  Shuffl card plug-in for wookie widget (illustration).
 * 
 * @author Graham Klyne 
 *  (based on an idea by Scott Wilson:
 *  http://groups.google.com/group/shuffl-discuss/browse_frm/thread/1c236df7e334c233)
 * @version $Id$
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

// ---------------------------------------------------------------- 
// Globals and data 
// ---------------------------------------------------------------- 

// TODO: move out of global namespace; use card-based (meta)data instead?
var WOOKIE_SERVER = "http://localhost:8080/wookie/widgetinstances"; 
var API_KEY = "test"; 

/** 
 * create shuffl namespace 
 */ 
if (typeof shuffl == "undefined") { 
    alert("shuffl-card-wookie.js: shuffl.js must be loaded before this file"); 
} ;

shuffl.card_wookie_data = 
    { 'shuffl:title':   undefined 
    , 'shuffl:tags':    [ undefined ] 
    // TODO: Wookie values here?
    }; 

/** 
 * jQuery base element for building new cards (used by shuffl.makeCard) 
 */ 
shuffl.card_wookie_blank = jQuery( 
    "<div class='shuffl-card-setsize' style='z-index:10;'>\n"+ 
    "  <chead>\n"+ 
    "    <chandle><c></c></chandle>" + 
    "    <ctitle>card title</ctitle>\n"+ 
    "  </chead>\n"+ 
    "  <iframe id='widget' src=''></iframe>"+ 
    "  <cfoot>\n"+ 
    "    <cident>card_ZZZ_ident</cident>:<cclass>card_ZZZ class</cclass>\n"+ 
    "    (<ctags>card_ZZZ tags</ctags>)\n"+ 
    "  </cfoot>"+ 
    "</div>");

/** 
 * Creates and returns a new card instance. 
 * 
 * @param cardtype  type identifier for the new card element 
 * @param cardcss   CSS class name(s) for the new card element 
 * @param cardid    local card identifier - a local name for the card, which 
 *                  may be combined with a base URI to form a URI for the card. 
 * @param carddata  an object or string containing additional data used in 
 *                  constructing the body of the card.  This is either a string
 *                  or an object structure with fields as "card_wookie_data"
 *                  above.
 * @return a jQuery object representing the new card. 
 */ 
shuffl.makeWookieCard = function (cardtype, cardcss, cardid, carddata) 
{ 
    var card = shuffl.card_wookie_blank.clone(); 
    card.data('shuffl:type' ,  cardtype); 
    card.data('shuffl:id',     cardid); 
    card.data("shuffl:tojson", shuffl.jsonWookieCard); 
    card.attr('id', cardid); 
    card.addClass(cardcss); 
    card.find("cident").text(cardid);           // Set card id text
    card.find("cclass").text(cardtype);         // Set card class/type text
    card.data("resizeAlso", "cbody");
    card.resizable();
    // Set up model listener and user input handlers
    shuffl.bindLineEditable(card, "shuffl:title",   "ctitle");
    shuffl.bindLineEditable(card, "shuffl:tags",    "ctags");
    card.data("resizeAlso", "cbody"); 
    card.resizable(); 
    // Initialize the model
    var cardtitle = shuffl.get(carddata, 'shuffl:title', cardid+" - type "+cardtype);
    var cardtags  = shuffl.get(carddata, 'shuffl:tags',  [cardid,cardtype]);
    card.model("shuffl:title", cardtitle);
    card.model("shuffl:tags",  cardtags.join(","));
    // Initialize the widget
    shuffl.getWidget(card, "http://www.getwookie.org/widgets/weather"); 
    return card; 
}; 

/**
 * Create a wookie widget and attach it to the iframe in a card.
 * 
 * TODO:  think about asynchronous creation logic
 *        do we need to suspend card activation until the widget returns?
 *        Or just put a message in the iframe?
 * 
 * TODO:  think about publication as web data:  maybe we just need to publish
 *        the metadata used to create the widget?
 * 
 * @param card        card for which the widget is grabbed
 * @param widgetType  a URI identifying the type of widget to be created
 */
shuffl.getWidget = function(card, widgetType)
{ 
    jQuery.post(WOOKIE_SERVER, 
        { api_key: API_KEY
        , shareddatakey: card.find("cident").text()
        , userid: "test"
        , widgetid: widgetType
        }, 
        function(xml)
        { 
            var url = jQuery(xml).find('url').text(); 
            var title = jQuery(xml).find('title').text(); 
            card.find("ctitle").text(title); 
            card.find("iframe").attr({src:url}); 
        }, 
        "xml"); 
};

/** 
 * Serializes a free-text card to JSON for storage 
 * 
 * TODO: serialize Wookie metadata?
 * 
 * @param card      a jQuery object corresponding to the card 
 * @return          an object containing the card data 
 */ 
shuffl.jsonWookieCard = function (card) 
{ 
    var carddata = shuffl.card_wookie_data; 
    carddata['shuffl:title'] = card.find("ctitle").text(); 
    carddata['shuffl:tags']  = jQuery.trim(card.find("ctags").text()).split(/[\s]*,[\s]*/); 
    return carddata; 
}; 

/** 
 *   Add new card type factory/ies 
 */ 
shuffl.addCardFactory("shuffl-wookie-yellow", "stock-yellow", shuffl.makeWookieCard); 

// End. 
