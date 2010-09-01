/**
 * @fileoverview
 * Shuffl card plug-in for simple card containing tabular data.
 * 
 * The original intent was to have a collection card for the table, and 
 * represent each row as a separate card, but on closer examination this 
 * would create problems about when or which cards should be deleted, 
 * e.g., when the table is reloaded.  So, instead, I've gone for a table
 * resource, with the intent that, in due course, individual rows can be 
 * pulled out as separate cards when required.
 * 
 * Also, I think this approach is better suited for working with existing
 * research data sets - the card-first approach may be more appropriate for 
 * primary data capture activities.
 *  
 * @author Graham Klyne
 * @version $Id: shuffl-card-datatable.js 828 2010-06-14 15:26:11Z gk-google@ninebynine.org $
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
 * Check shuffl namespace
 */
if (typeof shuffl == "undefined") 
{
    alert("shuffl-card-datatable.js: shuffl-base.js must be loaded first");
}
if (typeof shuffl.card == "undefined") 
{
    alert("shuffl-card-datatable.js: shuffl-cardhandlers.js must be loaded before this");
}

/**
 * Create namespace for this card type
 */
shuffl.card.datatable = {};

/**
 * Temporary default data for testing...
 * TODO: reset this when done testing
 */
shuffl.card.datatable.table =
    [ [ "",  "col1", "col2", "col3", "col4_is_much_wider", "col5" ]
    , [ "1", "1.1",  "1.2",  "1.3",  "1.4",                "1.5"  ]
    , [ "2", "2.1",  "2.2",  "2.3",  "2.4",                "2.5"  ]
    , [ "3", "3.1",  "3.2",  "3.3",  "3.4",                "3.5"  ]
    , [ "4", "4.1",  "4.2",  "4.3",  "4.4",                "4.5"  ]
    , [ "5", "5.1",  "5.2",  "5.3",  "5.4",                "5.5"  ]
    , [ "6", "6.1",  "6.2",  "6.3",  "6.4",                "6.5"  ]
    , [ "7", "7.1",  "7.2",  "7.3",  "7.4",                "7.5"  ]
    , [ "8", "8.1",  "8.2",  "8.3",  "8.4",                "8.5"  ]
    , [ "End." ]
    ];

/**
 * jQuery base element for building new cards (used by shuffl.makeCard)
 */
shuffl.card.datatable.blank = jQuery(
    "<div class='shuffl-card-setsize shuffl-series' style='z-index:10;'>\n"+
    "  <chead>\n"+
    "    <chandle><c></c></chandle>" +
    "    <ctitle>card title</ctitle>\n"+
    "  </chead>\n"+
    "  <crow>\n"+
    "    <curi>card_ZZZ uri</curi>\n"+
    "  </crow>\n"+
    "  <crow>\n"+
    "    <cbody class='shuffl-nodrag'>\n"+
    "      <table>\n"+
    "        <tr><th></th><th>col1</th><th>col2</th><th>col3</th></tr>\n"+
    "        <tr><td>row1</td><td>1.1</td><td>1.2</td><td>1.3</td></tr>\n"+
    "        <tr><td>row1</td><td>2.1</td><td>2.2</td><td>2.3</td></tr>\n"+
    "        <tr><td>End.</td></tr>\n"+
    "      </table>\n"+
    "    </cbody>\n"+
    "  </crow>\n"+
    "  <cfoot>\n"+
    "    <cident>card_ZZZ_ident</cident>:<cclass>card_ZZZ class</cclass>\n"+
    "    (<ctags>card_ZZZ tags</ctags>)\n"+
    "  </cfoot>"+
    "</div>");

/**
 * Template for initializing a card model, and 
 * creating new card object for serialization.
 */
shuffl.card.datatable.datamap =
    { 'shuffl:title':     { def: '@id' }
    , 'shuffl:tags':      { def: '@tags', type: 'array' }
    , 'shuffl:uri':       { def: "" }
    , 'shuffl:table':     { def: shuffl.card.datatable.table }
    };

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
 *                      'shuffl:title', 'shuffl:tags' and 'shuffl:table'.
 * @return              a jQuery object representing the new card.
 */
shuffl.card.datatable.newCard = function (cardtype, cardcss, cardid, carddata) {
    //log.debug("shuffl.card.datatable.newCard: "+
    //    cardtype+", "+cardcss+", "+cardid+", "+carddata);
    // Initialize the card object
    var card = shuffl.card.datatable.blank.clone();
    card.data('shuffl:type' ,  cardtype);
    card.data('shuffl:id',     cardid);
    card.data("shuffl:tojson", shuffl.card.datatable.serialize);
    card.attr('id', cardid);
    card.addClass(cardcss);
    card.find("cident").text(cardid);           // Set card id text
    card.find("cclass").text(cardtype);         // Set card class/type text
    card.data("resizeAlso", "cbody");
    card.resizable();
    // Set up model listener and user input handlers
    shuffl.bindLineEditable(card, "shuffl:title", "ctitle");
    shuffl.bindLineEditable(card, "shuffl:tags",  "ctags");
    shuffl.bindLineEditable(card, "shuffl:uri",   "curi");
    var cbody = card.find("cbody");
    card.modelBind("shuffl:table", 
        shuffl.modelSetTable(cbody, 1, shuffl.modelSetSeries(card)));
    // Initialize the model
    shuffl.initModel(card, carddata, shuffl.card.datatable.datamap,
        {id: cardid, tags: [cardtype]} 
        );
    // Finally, set listener for changes to URI value to read new data
    // This comes last so that the initialization of shuffl:uri does not
    // trigger a read when initializing a card.
    card.modelBind("shuffl:uri", function (event, data) {
        log.debug("Read "+data.newval+" into data table");
        jQuery.getCSV(data.newval, function (data, status) {
            ////log.debug("- data "+jQuery.toJSON(data));
            card.model("shuffl:table", data);
            card.data('shuffl:datamod', true);
        });
    });
    return card;
};

/**
 * Serializes a tabular data card to JSON for storage
 * 
 * @param card      a jQuery object corresponding to the card
 * @return          an object containing the card data
 */
shuffl.card.datatable.serialize = function (card) {
    return shuffl.serializeModel(card, shuffl.card.datatable.datamap);
};

/**
 *   Add new card type factories
 */
shuffl.addCardFactory("shuffl-datatable-yellow", "stock-yellow", shuffl.card.datatable.newCard);
shuffl.addCardFactory("shuffl-datatable-blue",   "stock-blue",   shuffl.card.datatable.newCard);
shuffl.addCardFactory("shuffl-datatable-green",  "stock-green",  shuffl.card.datatable.newCard);
shuffl.addCardFactory("shuffl-datatable-orange", "stock-orange", shuffl.card.datatable.newCard);
shuffl.addCardFactory("shuffl-datatable-pink",   "stock-pink",   shuffl.card.datatable.newCard);
shuffl.addCardFactory("shuffl-datatable-purple", "stock-purple", shuffl.card.datatable.newCard);

// End.
