/**
 * @fileoverview
 *  Shuffl card plug-in for simple card containing just free text.
 *  
 * @author Graham Klyne
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
 
/**
 * create shuffl namespace
 */
if (typeof shuffl == "undefined") 
{
    alert("shuffl-card-freetext.js: shuffl-base.js must be loaded first");
}
if (typeof shuffl.card == "undefined") 
{
    alert("shuffl-card-freetext.js: shuffl-cardhandlers.js must be loaded before this");
}

/**
 * Create namespace for this card type
 */
shuffl.card.freetext = {};

/**
 * Template for initializing a card model, and 
 * creating new card object for serialization.
 */
shuffl.card.freetext.datamap =
    { 'shuffl:title':   { def: '@id' }
    , 'shuffl:tags':    { def: '@tags', type: 'array' }
    , 'shuffl:text':    { def: '' }
    };

/**
 * jQuery base element for building new cards (used by shuffl.makeCard)
 */
shuffl.card.freetext.blank = jQuery(
    "<div class='shuffl-card-setsize' style='z-index:10;'>\n"+
    "  <chead>\n"+
    "    <chandle><c></c></chandle>" +
    "    <ctitle>card title</ctitle>\n"+
    "  </chead>\n"+
    "  <crow>\n"+
    "    <cbody class='shuffl-nodrag'>card_ZZZ body</cbody>\n"+
    "  </crow>\n"+
    "  <cfoot>\n"+
    "    <cident>card_ZZZ_ident</cident>:<cclass>card_ZZZ class</cclass>\n"+
    "    (<ctags>card_ZZZ tags</ctags>)\n"+
    "  </cfoot>"+
    "</div>");

/**
 * Creates and return a new card instance.
 * 
 * @param cardtype      type identifier for the new card element
 * @param cardcss       CSS class name(s) for the new card element
 * @param cardid        local card identifier - a local name for the card, 
 *                      which may be combined with a base URI to form a URI 
 *                      for the card.
 * @param carddata      an object or string containing additional data used in 
 *                      constructing the body of the card.  This is either a 
 *                      string or an object structure with fields 
 *                      'shuffl:title', 'shuffl:tags' and 'shuffl:text'.
 * @return              a jQuery object representing the new card.
 */
shuffl.card.freetext.newCard = function (cardtype, cardcss, cardid, carddata) {
    //log.debug("shuffl.card.freetext.newCard: "+
    //    cardtype+", "+cardcss+", "+cardid+", "+carddata);
    // Initialize the card object
    var card = shuffl.card.freetext.blank.clone();
    card.data('shuffl:type' ,  cardtype);
    card.data('shuffl:id',     cardid);
    card.data("shuffl:tojson", shuffl.card.freetext.serialize);
    card.attr('id', cardid);
    card.addClass(cardcss);
    card.find("cident").text(cardid);           // Set card id text
    card.find("cclass").text(cardtype);         // Set card class/type text
    card.data("resizeAlso", "cbody");
    card.resizable();
    // Set up model listener and user input handlers
    shuffl.bindLineEditable(card, "shuffl:title", "ctitle");
    shuffl.bindLineEditable(card, "shuffl:tags",  "ctags");
    var cbody = card.find("cbody");
    card.modelBind("shuffl:text", shuffl.modelSetHtml(cbody, true));
    shuffl.blockEditable(card, cbody, shuffl.editSetModel(card, "shuffl:text"));
    // Initialize the model
    shuffl.initModel(card, carddata, shuffl.card.freetext.datamap,
        {id: cardid, tags: [cardtype]} 
        );
    return card;
};

/**
 * Serializes a free-text card to JSON for storage
 * 
 * @param card      a jQuery object corresponding to the card
 * @return an object containing the card data
 */
shuffl.card.freetext.serialize = function (card) {
    return shuffl.serializeModel(card, shuffl.card.freetext.datamap);
};

/**
 *   Add new card type factories
 */
shuffl.addCardFactory("shuffl-freetext-yellow", "stock-yellow", shuffl.card.freetext.newCard);
shuffl.addCardFactory("shuffl-freetext-blue",   "stock-blue",   shuffl.card.freetext.newCard);
shuffl.addCardFactory("shuffl-freetext-green",  "stock-green",  shuffl.card.freetext.newCard);
shuffl.addCardFactory("shuffl-freetext-orange", "stock-orange", shuffl.card.freetext.newCard);
shuffl.addCardFactory("shuffl-freetext-pink",   "stock-pink",   shuffl.card.freetext.newCard);
shuffl.addCardFactory("shuffl-freetext-purple", "stock-purple", shuffl.card.freetext.newCard);

// End.
