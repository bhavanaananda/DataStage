/**
 * @fileoverview
 *  Shuffl card plug-in for simple card containing an image and associated notes
 *  
 * @author Graham Klyne
 * @version $Id: shuffl-card-imagenotes.js 828 2010-06-14 15:26:11Z gk-google@ninebynine.org $
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
    alert("shuffl-card-imagenotes.js: shuffl-base.js must be loaded first");
}
if (typeof shuffl.card == "undefined") 
{
    alert("shuffl-card-imagenotes.js: shuffl-cardhandlers.js must be loaded before this");
}

/**
 * Create namespace for this card type
 */
shuffl.card.imagenotes = {};

/**
 * Template for initializing a card model, and 
 * creating new card object for serialization.
 */
shuffl.card.imagenotes.datamap =
    { 'shuffl:title':   { def: '@id' }
    , 'shuffl:tags':    { def: '@tags', type: 'array' }
    , 'shuffl:uri':     { def: '' }
    , 'shuffl:text':    { def: '' }
    //// @@more
    };

/**
 * jQuery base element for building new cards (used by shuffl.makeCard)
 */
shuffl.card.imagenotes.blank = jQuery(
    "<div class='shuffl-card-setsize' style='z-index:10;'>\n"+
    "  <chead>\n"+
    "    <chandle><c></c></chandle>" +
    "    <ctitle>card title</ctitle>\n"+
    "  </chead>\n"+
    "  <crow>\n"+
    "    <curi>card_ZZZ uri</curi>\n"+
    "  </crow>\n"+
    "  <crow>\n"+
    "    <cbody class='shuffl-nodrag'>\n"+
    "      <cimage>\n"+
    "        (img src='...' alt='...'/)\n"+
    "      </cimage>\n"+
    "    </cbody>\n"+
    "  </crow>\n"+
    "  <cfoot>\n"+
    "    <ctagslabel>Tags: </ctagslabel><ctags>card_ZZZ tags</ctags>\n"+
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
shuffl.card.imagenotes.newCard = function (cardtype, cardcss, cardid, carddata) {
    log.debug("shuffl.card.imagenotes.newCard: "+
        cardtype+", "+cardcss+", "+cardid+", "+carddata);
    // Initialize the card object
    var card = shuffl.card.imagenotes.blank.clone();
    card.data('shuffl:type' ,  cardtype);
    card.data('shuffl:id',     cardid);
    card.data("shuffl:tojson", shuffl.card.imagenotes.serialize);
    card.attr('id', cardid);
    card.addClass(cardcss);
    card.data("resizeAlso", "cbody");
    card.resizable();
    // Set up model listener and user input handlers
    shuffl.bindLineEditable(card, "shuffl:title", "ctitle");
    shuffl.bindLineEditable(card, "shuffl:tags",  "ctags");
    shuffl.bindLineEditable(card, "shuffl:uri",   "curi");
    card.modelBind("shuffl:uri", function(event, data) {
    	var imgelem = shuffl.interpolate(
    		"<img src='%(uri)s' alt='%(uri)s'/>", 
    		{uri: data.newval});
    	card.find("cimage").html(imgelem);
        });
    ////var cbody = card.find("cbody");
    var cnotes = card.find("cnotes");
    card.modelBind("shuffl:text", shuffl.modelSetHtml(cnotes, true));
    shuffl.blockEditable(card, cnotes, shuffl.editSetModel(card, "shuffl:text"));
    // Initialize the model
    shuffl.initModel(card, carddata, shuffl.card.imagenotes.datamap,
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
shuffl.card.imagenotes.serialize = function (card) {
    return shuffl.serializeModel(card, shuffl.card.imagenotes.datamap);
};

/**
 *   Add new card type factories
 */
shuffl.addCardFactory("shuffl-imagenotes-yellow", "stock-yellow", shuffl.card.imagenotes.newCard);
shuffl.addCardFactory("shuffl-imagenotes-blue",   "stock-blue",   shuffl.card.imagenotes.newCard);
shuffl.addCardFactory("shuffl-imagenotes-green",  "stock-green",  shuffl.card.imagenotes.newCard);
shuffl.addCardFactory("shuffl-imagenotes-orange", "stock-orange", shuffl.card.imagenotes.newCard);
shuffl.addCardFactory("shuffl-imagenotes-pink",   "stock-pink",   shuffl.card.imagenotes.newCard);
shuffl.addCardFactory("shuffl-imagenotes-purple", "stock-purple", shuffl.card.imagenotes.newCard);

// End.
