/**
 * @fileoverview
 *  Shuffl application generic card handloing code.  This provides the main 
 *  facility for registering and invoking plugin card factories, and for
 *  placing cards on the Shuffl workspace.  It also contains logic that
 *  may be used by multiple card plugins.
 *  
 * @author Graham Klyne
 * @version $Id: shuffl-cardhandlers.js 828 2010-06-14 15:26:11Z gk-google@ninebynine.org $
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
// Initialize global data values
// ----------------------------------------------------------------

/**
 * Ensure card-related values are initialized in the shuffl namespace
 */
if (typeof shuffl == "undefined") 
{
    alert("shuffl-cardhndlers.js: shuffl-base.js must be loaded first");
};
if (typeof shuffl.card == "undefined") 
{
    shuffl.card = {};                   // Namespace for card types
};
if (typeof shuffl.CardFactoryMap == "undefined") 
{
    shuffl.CardFactoryMap = {};         // Initial empty card factory map
};
if (typeof shuffl.idnext == "undefined") 
{
    shuffl.idnext         = 100;        // Counter for unique id generation    
};
if (typeof shuffl.idpref == "undefined") 
{
    shuffl.idpref         = "card_";   // Prefix for unique id generation    
};

// ----------------------------------------------------------------
// Blank object for externally stored card data
// ----------------------------------------------------------------

shuffl.ExternalCardData =
    { 'shuffl:id':        undefined
    , 'shuffl:type':      undefined
    , 'shuffl:version':   '0.1'
    , 'shuffl:base-uri':  '#'
    , 'shuffl:uses-prefixes':
      [ { 'shuffl:prefix':  'shuffl', 'shuffl:uri': 'http://purl.org/NET/Shuffl/vocab#' }
      , { 'shuffl:prefix':  'rdf',    'shuffl:uri': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' }
      , { 'shuffl:prefix':  'rdfs',   'shuffl:uri': 'http://www.w3.org/2000/01/rdf-schema#' }
      , { 'shuffl:prefix':  'owl',    'shuffl:uri': 'http://www.w3.org/2002/07/owl#' }
      , { 'shuffl:prefix':  'xsd',    'shuffl:uri': 'http://www.w3.org/2001/XMLSchema#' }
      ]
    , 'shuffl:data': undefined
    };

// ----------------------------------------------------------------
// Card factory functions
// ----------------------------------------------------------------

/**
 * Add factory for new card type to the factory map
 */
shuffl.addCardFactory = function (cardtype, cssclass, factory) 
{
    shuffl.CardFactoryMap[cardtype] = { cardcss: cssclass, cardfactory: factory };
};

/**
 * Return factory for creating new cards given a card type/class.
 */
shuffl.getCardFactory = function (cardtype) 
{
    ////log.debug("getCardFactory: cardtype '"+cardtype+"'");
    ////log.debug("cardFactory "+shuffl.objectString(shuffl.cardFactory));
    var factory = shuffl.CardFactoryMap[jQuery.trim(cardtype)];
    if ( factory == undefined) 
    {
        log.warn("getCardFactory: unrecognized card type: "+cardtype+", returning default factory");
        factory = mk.partial(shuffl.card.defaultcard.newCard, cardtype, "stock-default");
    } 
    else
    {
        var cssclass = factory.cardcss;
        ////log.debug("getCardFactory: card type: "+cardtype+", card CSS class: "+cssclass);
        factory = mk.partial(factory.cardfactory, cardtype, cssclass);
    }
    ////log.debug("factory "+factory);
    return factory;
};

// ----------------------------------------------------------------
// Default card functions
// ----------------------------------------------------------------

shuffl.card.defaultcard = {};

shuffl.card.defaultcard.data =
    { 'shuffl:title':   undefined
    };

/**
 * jQuery base element for building new default cards
 */
shuffl.card.defaultcard.blank = jQuery(
    "<div class='shuffl-card-autosize' style='z-index:10;'>\n"+
    "  <chead>\n"+
    "    <chandle><c></c></chandle>" +
    "    <ctitle>card title</ctitle>\n"+
    "  </chead>\n"+
    "</div>");

/**
 * Default card factory: title only
 * 
 * @param cardtype      card factory type identifier for the new element
 * @param cardcss       CSS class name(s) added to the new card element
 * @param cardid        local card identifier - a local name for the card, 
 *                      which may be combined with a base URI to form a URI
 *                      for the card.
 * @param carddata      an object or string containing additional data used in 
 *                      constructing the body of the card.  
 *                      This is an object structure with field 'shuffl:title'.
 * @return              a jQuery object representing the new card.
 */
shuffl.card.defaultcard.newCard = function (cardtype, cardcss, cardid, carddata) 
{
    ////log.debug("shuffl.shuffl.card.defaultcard.newCard: "+cardid+", "+shuffl.objectString(carddata));
    var card = shuffl.card.defaultcard.blank.clone();
    card.model('shuffl:type' ,  cardtype);
    card.model('shuffl:id',     cardid);
    card.model("shuffl:tojson", shuffl.card.defaultcard.serialize);
    card.attr('id', cardid);
    card.addClass(cardcss);
    // Set up model listener and user input handlers
    var ctitle = card.find("ctitle");
    card.modelBind("shuffl:title", shuffl.modelSetText(ctitle, true));
    shuffl.lineEditable(
        card, ctitle, shuffl.editSetModel(card, true, "shuffl:title"));
    // Initialze card model
    shuffl.initModelVar(card, 'shuffl:title', carddata, cardid+" - class "+cardtype);
    return card;
};

/**
 * Serializes a default card to JSON for storage
 * 
 * @param card      a jQuery object corresponding to the card
 * @return an object containing the card data
 */
shuffl.card.defaultcard.serialize = function (card) 
{
    var carddata = shuffl.card.defaultcard.data;
    carddata['shuffl:title'] = card.model("shuffl:title");
    return carddata;
};

// ----------------------------------------------------------------
// Stockpile and card id generation functions
// ----------------------------------------------------------------

/**
 * Generate a new identifier string using a supplied prefix
 */
shuffl.makeId = function(pref) 
{
    shuffl.idnext++;
    return pref+shuffl.idnext;
};

/**
 * Return identifier string based on last value returned (used for testing)
 */
shuffl.lastId = function(pref) 
{
    return pref+shuffl.idnext;
};

/**
 * Update ID generator if necessary to prevent clash with loaded card.
 */
shuffl.loadId = function(cardid) 
{
    var l = shuffl.idpref.length;
    if (cardid.slice(0,l) == shuffl.idpref) 
    {
        var n = parseInt(cardid.slice(l));
        if (typeof n == "number" && shuffl.idnext < n) 
        {
            log.debug("Load card id "+cardid+", "+n);
            shuffl.idnext = n;
        }
    };
};

/**
 * Draggable options for stockpiles
 */
shuffl.stockDraggable = 
{ 
    opacity: 0.8, 
    containment: [0,0,10000,100001],
    revert: true, 
    revertDuration: 0, 
    ////old jQuery.ui stack: { group: '.shuffl-card', min: 10 }
    stack: '.shuffl-card' 
};

/**
 * Draggable options for cards
 */
shuffl.cardDraggable = 
{ 
    opacity: 0.5,
    containment: [0,0,10000,100001],
    revert: 'valid',                          // revert if dropped on a valid target
    cancel: '.shuffl-nodrag, :input, option', // add to default no-drag sub-elements
    ////old jQuery.ui stack: { group: '.shuffl-card', min: 10 }
    stack: '.shuffl-card' 
};

/**
 * jQuery base element for building stockbar entries
 */
shuffl.stockpile_blank = jQuery("<div class='shuffl-stockpile' style='z-index:1;' />");

/**
 * jQuery element for stockpile spacer in stock bar
 */
shuffl.stockpile_space = jQuery("<div class='shuffl-spacer' />");

/**
 * Create a new stockpile
 */
shuffl.createStockpile = function(sid, sclass, slabel, stype) 
{
    // Create new blank stockpile element
    var stockpile = shuffl.stockpile_blank.clone();
    stockpile.attr('id', sid);
    stockpile.addClass(sclass);
    stockpile.text(slabel);
    stockpile.data( 'makeCard', shuffl.createCardFromStock );
    stockpile.data( 'CardType', stype);
    stockpile.draggable(shuffl.stockDraggable);
    jQuery('#stockbar').append(shuffl.stockpile_space.clone())
    jQuery('#stockbar').append(stockpile);
    return stockpile;
};

/**
 * Function attached to stockpile to liberate a new card from that pile
 */
shuffl.createCardFromStock = function (stockpile) { 
    log.debug("createCardFromStock "+stockpile);
    var cardtype = stockpile.data("CardType");
    var cardid   = shuffl.makeId(shuffl.idpref);
    // log.debug("cardclass '"+cardclass+"'");
    var newcard = shuffl.getCardFactory(cardtype)(cardid, {});
    newcard.addClass('shuffl-card');
    // Initialize card workspace parameters
    // See: http://code.google.com/p/shuffl/wiki/CardReadWriteOptions
    // Use id of new card as hint for file name
    newcard.data('shuffl:dataref', cardid+".json");
    newcard.data('shuffl:datauri', undefined);
    newcard.data('shuffl:dataRW',  true);
    newcard.data('shuffl:datamod', true);
    // Instantiate external data values
    var extdata = {};
    jQuery.extend(true, extdata, shuffl.ExternalCardData);  // Deep copy..
    extdata['shuffl:id']    = cardid;
    extdata['shuffl:type' ] = cardtype;
    newcard.data('shuffl:external', extdata);
    return newcard;
};

// ----------------------------------------------------------------
// Card and workspace placement functions
// ----------------------------------------------------------------

/**
 * Create a new card using a supplied layout value and card data
 * 
 * Note: layout provides default values for card id and class; the primary 
 * source is the card data.
 * 
 * Note: the supplied card data is assumed to be initialized with data
 * reference, data URI and data writeable values.
 * 
 * @param cardid    the new card identifier
 * @param cardtype  a card factory type for the new card
 * @param origdata  structure indicating attributes of the card, as well as
 *                  card-type-dependent data values.
 * @return          a jQuery object representing the new card.
 */
shuffl.createCardFromData = function (cardid, cardtype, origdata) 
{ 
    ////log.debug("shuffl.createCardFromData, card data: "+shuffl.objectString(origdata));
    ////log.debug("shuffl.createCardFromData, cardid: "+cardid+", cardtype: "+cardtype);
    var copydata = {};  // Make deep copy..
    jQuery.extend(true, copydata, origdata);
    var carddata = copydata['shuffl:data'];  // Card-type specific data
    // Create card using card factory
    var newcard   = shuffl.getCardFactory(cardtype)(cardid, carddata);
    newcard.addClass('shuffl-card');
    // Initialize card workspace parameters
    // See: http://code.google.com/p/shuffl/wiki/CardReadWriteOptions
    newcard.data('shuffl:dataref', copydata['shuffl:dataref']);
    newcard.data('shuffl:datauri', copydata['shuffl:datauri']);
    newcard.data('shuffl:dataRW',  copydata['shuffl:dataRW']);
    newcard.data('shuffl:datamod', false);
    // Save full copy of external data in jQuery card object
    newcard.data('shuffl:external', copydata);
    return newcard;
};

/**
 * Create and place a new card using a supplied layout value and card data
 * 
 * Note: layout provides default values for card id and class; the primary 
 * source is the card data.
 * 
 * @param layout    structure indicating where and how the card appears in
 *                  the shuffl workspace, and a URI reference to where the card 
 *                  data (purports) to come from.
 * @param data      structure indicating attributes of the card, as well as
 *                  card-type-dependent data values.
 */
shuffl.placeCardFromData = function (layout, data) 
{ 
    ////log.debug("shuffl.placeCardFromData, layout:    "+shuffl.objectString(layout));
    ////log.debug("shuffl.placeCardFromData, card data: "+shuffl.objectString(data));
    var cardid   = shuffl.get(data, 'shuffl:id',    layout['id']);
    var cardtype = shuffl.get(data, 'shuffl:type' , layout['class']);
    // Create card using card factory
    ////log.debug("shuffl.placeCardFromData, cardid: "+cardid+", cardtype: "+cardtype);
    var newcard = shuffl.createCardFromData(cardid, cardtype, data);
    shuffl.loadId(cardid);
    // Place card on layout
    var cardsize = layout['size'] || shuffl.defaultSize;
    shuffl.placeCard(jQuery('#layout'), newcard, 
        layout['pos'], cardsize, layout['zindex']);
};

/**
 * Create a new card and place it in the element referenced by a supplied
 * jQuery object.  This function is provided for allowing cards to be used
 * separately than as normal Shuffl cards, e.g. as modal dialogs.
 * 
 * NOTE: for this to work properly, the element to which the card is 
 * added must be visible when this function is invoked.
 * 
 * @param cardid    the new card identifier
 * @param cardtype  a card factory type for the new card
 * @param carddata  is an object containing card-specific data to be added to
 *                  the card
 * @param jqelem    is a jQuery object corresponding to the DOM element to 
 *                  which the new card is added.
 * @param zindex    if specified, is a zIndex value applied to the card
 * @param pos       if specified, is the position for the new card
 * @param siz       if specified, is the size for the new card
 */
shuffl.createAndPlaceCard = 
function (cardid, cardtype, carddata, jqelem, zindex, pos, siz)
{
    //TODO: refactor this (see createCardFromData, etc)
    // Create card using card factory
    var newcard = shuffl.getCardFactory(cardtype)(cardid, carddata);
    jqelem.append(newcard);
    newcard.addClass('shuffl-card');
    var resizefn = shuffl.resizeHandler(
        newcard, newcard.data("resizeAlso"), newcard.data("redrawFunc"));
    newcard.data("resizeFunc", resizefn);
    if (resizefn) { newcard.bind('resize', resizefn) };
    // Sort out placement
    newcard.css('position', 'absolute');
    if (zindex) { newcard.css("zIndex", zindex) };
    if (pos)    { newcard.css(pos) };   // {left:x, top:y}
    if (siz)    { shuffl.setCardSize(newcard, siz) };
    return newcard;
};

// ----------------------------------------------------------------
// Card workspace placement support functions
// ----------------------------------------------------------------

shuffl.defaultSize = {width:0, height:0};

shuffl.defaultSetSize = {width:"20em", height:"10em"};

/**
 * Invoke the supplied function to redraw the current card after a specified
 * delay.  Any previous pending redraws are cancelld.
 * 
 * @param card      is the card to be redrawn (a jQuery object).  If null,
 *                  any outstanding redraw is cancelled, but no new redraw is 
 *                  scheduled.
 * @param redrawfn  is a function called to redraw the card.  The card object
 *                  is supplied as the first parameter and the value of 'this'.
 * @param delay     a number of milliseconds to delay before doing the redraw.
 */
shuffl.redrawAfter = function (card, redrawfn, delay)
{
    var t = card.data("redrawTimer");
    if (t) 
    { 
        clearTimeout(t);        // Cancel pending redraw
        t = null;
    };
    if (redrawfn)
    {
        t = setTimeout(function () { redrawfn.call(card, card); }, delay);
    };
    card.data("redrawTimer", t);
};

/**
 * Returns a function that catches a resize event to resize specified 
 * sub-elements in sync with any changes the main card element.
 * 
 * Contains logic to delay the redraw for 0.25 second, so that redraws
 * don't happen while the card is actively being resized.
 * 
 * @param card      card element jQuery object whose resize events are to 
 *                  be tracked.
 * @param selector  jQuery selector string for the sub-element to be resized 
 *                  with changes to the card element.
 * @param redrawfn  a function called to redraw card elements when the card 
 *                  is resized.  When called, the current card is supplied
 *                  as 'this' and also as the single call argument.
 * @return          a function that serves as a resize handler for the
 *                  selected sub-element.
 */
shuffl.resizeHandler = function (card, selector, redrawfn) 
{
    //log.debug("shuffl.resizeHandler "+selector);
    var elem = card.find(selector);
    if (elem.length == 1) {
        var dw = card.width() - elem.width();
        var dh = card.height() - elem.height();
        log.debug("shuffl.resizeHandler "+card.width()+", dw: "+dw);
        var handleResize = function (/*event, ui*/) 
        {
            // Track changes in width and height
            var c = jQuery(this);
            ////log.debug("handleResize "+c.width()+", dw: "+dw);
            elem.width(c.width()-dw);
            elem.height(c.height()-dh);
            ////log.debug("shuffl.resizeHandler:handleResize elem "+elem.width()+", "+elem.height());
            shuffl.redrawAfter(card, redrawfn, 250.0);
        };
        return handleResize;
    };
    return undefined;
};

/**
 * Place card on the shuffl layout area, and set up common event handlers
 * and properties.
 * 
 * All cards are draggable, and clicking on them brings them to the front
 * of the display stack.
 * 
 * If card data value "resizeAlso" is specified, it is a jQuery selector for
 * an element within the card that is resized in sync with the main card.
 * 
 * If card data value "redrawFunc" is specified, it is called when parts of
 * the card may need redrawing to accommodate a changed card size (this value
 * is used only when "resizeAlso" is defined).
 * 
 * @param layout    the layout area where the card will be placed
 * @param card      the card to be placed
 * @param pos       the position at which the card is to be placed
 * @param size      the size for the created card (zero dimensions leave the
 *                  default values (e.g. from CSS) in effect).
 * @param zindex    the z-index for the created card; zero or undefined brings
 *                  the new card to the top of the display stack.
 */
shuffl.placeCard = function (layout, card, pos, size, zindex) 
{
    ////log.debug("shuffl.placeCard pos: "+jQuery.toJSON(pos)+", size: "+jQuery.toJSON(size));
    layout.append(card);
    var resizefn = shuffl.resizeHandler(
        card, card.data("resizeAlso"), card.data("redrawFunc"));
    card.data("resizeFunc", resizefn);
    if (resizefn) { card.bind('resize', resizefn); };
    card.css(pos).css('position', 'absolute');
    shuffl.setCardSize(card, size);
    // Make card draggable and to front of display
    card.draggable(shuffl.cardDraggable);
    if (zindex) 
    {
        card.css('zIndex', zindex)
    } 
    else 
    {
        shuffl.toFront(card);
    };
    // Click brings card back to top
    card.click( function () { shuffl.toFront(jQuery(this)); });
    // TODO: Consider making card-sized drag
    ////log.debug("shuffl.placeCard End.");
};

/**
 * Create a new card where a stock pile has been dropped
 * 
 * @param frompile  the stock pile jQuery object from which a new card will
 *                  be derived
 * @param tolayout  the layout area jQuery obejct in which the new card will
 *                  be displayed.
 * @param pos       the position within the layout area where the new card 
 *                  will be displayed
 */
shuffl.dropCard = function(frompile, tolayout, pos) 
{
    ////log.debug("shuffl.dropCard: "+shuffl.objectString(pos));
    // Create card using stockpile card factory
    var newcard = frompile.data('makeCard')(frompile);
    //�Place card on layout
    pos = shuffl.positionRelative(pos, tolayout);
    pos = shuffl.positionRel(pos, { left:5, top:1 });   // TODO calculate this properly
    shuffl.placeCard(tolayout, newcard, pos, shuffl.defaultSize, 0);
    if (newcard.hasClass("shuffl-card-setsize")) {
        shuffl.setCardSize(newcard, shuffl.defaultSetSize);
    };
};

/**
 * Resize card, invoking the card resize handler as needed to adjust internal
 * component sizes and redraw card contents.
 */
shuffl.setCardSize = function (card, size) {
    if (size.height) { card.height(size.height); };
    if (size.width)  { card.width(size.width); };
    var resizefn = card.data("resizeFunc");
    if (resizefn) { resizefn.call(card /*, null, null*/); };        
};

/**
 * Move indicated element to front in its draggable group
 * 
 * Code adapted from jQuery 
 * (jquery.ui.draggable.js: $.ui.plugin.add("draggable", "stack", ...) )
 */
shuffl.toFront = function (elem) 
{
    if (elem.data("draggable")) 
    {
        var opts  = elem.data("draggable").options;
        var group = jQuery.makeArray(jQuery(opts.stack)).sort(function(a,b) 
            {
                return shuffl.parseInt(jQuery(a).css("zIndex"), 10, 0) - 
                       shuffl.parseInt(jQuery(b).css("zIndex"), 10, 0);
            });
        if (!group.length) { return; }   
        var min = shuffl.parseInt(group[0].style.zIndex, 10, 0);
        jQuery(group).each(function(i) 
            {
                this.style.zIndex = min + i;
            });
        elem[0].style.zIndex = min + group.length;
    };
};

// ----------------------------------------------------------------
// Card serialization and deserialization functions
// ----------------------------------------------------------------

/**
 * Create an external representation object for a card
 * 
 * Note: JSON is represented internally as a Javascript structure, and is
 * serialized on transmission by ther jQuery AJAX components.
 */
shuffl.createDataFromCard = function (card) 
{ 
    var extdata = card.data('shuffl:external');
    extdata['shuffl:id']    = card.data('shuffl:id');
    extdata['shuffl:type' ] = card.data('shuffl:type' );
    extdata['shuffl:data']  = card.data('shuffl:tojson')(card);
    ////log.debug("shuffl.createDataFromCard, extdata: "+shuffl.objectString(extdata));
    ////log.debug("shuffl.createDataFromCard, data: "+shuffl.objectString(extdata['shuffl:data']));
    ////log.debug("shuffl.createDataFromCard, id: "+extdata['shuffl:id']+", class: "+extdata['shuffl:type' ]);
    return extdata;
};

/**
 * Return tags from card as list
 * 
 * @param card      card from which tags are returned.
 * @param selector  jQuery selector for element containing tag list
 */
shuffl.getTagList = function (card, selector)
{
    ////log.debug("shuffl.getTagList "+selector);
    return shuffl.makeTagList(card.find(selector).text());
};

/**
 * Make list of tags from string
 * 
 * @param text      string containing a comma-separated list of tag names
 * @return          an array of tag names
 */
shuffl.makeTagList = function (ttext)
{
    ////log.debug("shuffl.makeTagList "+ttext);
    return jQuery.trim(ttext).split(/[\s]*,[\s]*/);
};

/**
 * Initialize model variable from data, or using default value.
 * 
 * @param card      card object whose model is being initialized
 * @param modelvar  model variable to initialize, also used as field name in
 *                  card data provided.
 * @param carddata  an object containing values used to initialize a card,
 *                  usually obtained from a serialized card description. 
 * @param valdef    a default value to use if no value is given by carddata
 * @param valtype   if present, indicates the type of value to be initialized:
 *                  this affects conversion from the supplied value for
 *                  storage in the model.  The following values are recognized:
 *                    array   value is an array, stored internaly as a comma-
 *                            separated list.
 */
shuffl.initModelVar = function (card, modelvar, carddata, valdef, valtype)
{
    var val = shuffl.get(carddata, modelvar, valdef);
    ////log.debug("shuffl.initModelVar "+modelvar+", "+val+", "+valtype);
    if (valtype == 'array')  { val = val.join(","); };
    card.model(modelvar, val);
};

/**
 * Initialize model data from the supplied card data, using the supplied
 * data map structure.
 * 
 * @param card      card object whose model is being initialized
 * @param carddata  an object containing values used to initialize a card,
 *                  usually obtained from a serialized card description. 
 * @param datamap   an object that describes the mapping between serialized 
 *                  data and the card model user internally.  Also defines
 *                  default values for initializing a new card.
 * @param defvals   a dictionary of default values referenced by datamap 
 *                  references of the form '@key'
 */
shuffl.initModel = function (card, carddata, datamap, defvals)
{
    var pass = [];
    var p;
    for ( var k in datamap )
    {
        if (p = datamap[k].pass)
        {
            // pass number specified: save for later
            if (!pass[p]) { pass[p] = []; };
            pass[p].push(k);
        }
        else
        {
            // Initiualize now
            var d = datamap[k].def;
            if (typeof d == "string" && d.slice(0,1) == '@')
            {
                d = defvals[d.slice(1)];
            }
            shuffl.initModelVar(card, k, carddata, d, datamap[k].type);          
        }
    };
    // Now initialize stuff saved for later
    for (p = 0 ; p < pass.length ; p++)
    {
        var l = 0;
        if (pass[p] && pass[p].length) { l = pass[p].length; };
        for (var i = 0 ; i < l ; i++)
        {
            k = pass[p][i];
            shuffl.initModelVar(card, k, carddata, datamap[k].def, datamap[k].type);          
        };
    }
};

/**
 * Serialize a supplied card model using the supplied data map structure
 * 
 * @param card      card object whose model is being initialized
 * @param datamap   an object that describes the mapping between serialized 
 *                  data and the card model user internally.  Also defines
 *                  default values for initializing a new card.
 * @return          a card descriptionb as a Javascript object ready for 
 *                  serialization as JSON or some other format.
 */
shuffl.serializeModel = function (card, datamap)
{
    var carddata = {};
    for ( var k in datamap )
    {
        var v = card.model(k);
        if (datamap[k].type == 'array')
        {
            v = shuffl.makeTagList(v);
        }
        carddata[k] = v;
    };
    return carddata;
};

// ----------------------------------------------------------------
// Card MVC support functions
// ----------------------------------------------------------------

/**
 * Return a model-change event handler that sets the text value in a supplied
 * field, or a placeholder value if the model text value is empty.
 * 
 * @param fieldobj  is a jQuery object corresponding to a field that is to be 
 *                  updated with new values assigned to a model element.
 * @param holder    is a placeholder string which, if defined, is displayed 
 *                  if the model value is an empty string, or true to use
 *                  the default placeholder value at shuffl.placeHolder.
 * @param thencall  if defined, this is an additional function to call
 *                  after the card text has been updated.
 * @return          a function to be used as the update handler for a model
 *                  field.
 * 
 * Example:
 *    card.modelBind("shuffl:title", modelSetText(card.find("ctitle"),true));
 * 
 * The callback is invoked thus:
 *   thencall(event, data) {
 *      // this  = jQuery object containing changed model variable
 *      // event = jQuery event object
 *      // data  = {name:modelvarname, oldval:oldval, newval:value}
 *   };
 */
shuffl.modelSetText = function (fieldobj, holder, thencall)
{
    function setText(event, data) {
        var newtext = jQuery.trim(data.newval);
        fieldobj.text(newtext || holder);
        if (thencall !== undefined) { thencall(event, data); };
    }
    if (holder === true)      { holder = shuffl.PlaceHolder; };
    if (holder === undefined) { holder = ""; };
    return setText;
};

/**
 * Return a model-change event handler that sets the innerHTML value in a 
 * supplied field.
 * 
 * @param fieldobj  is a jQuery object correspondingto a field that is to be 
 *                  updated with new values assigned to a model element.
 * @param holder    is a placeholder string which, if defined, is displayed 
 *                  if the model value is an empty string.
 * @param thencall  if defined, this is an additional function to call
 *                  after the card text has been updated.
 * @return          a function to be used as the update handler for a model
 *                  field.
 * 
 * Example:
 *    card.modelBind("shuffl:title", modelSetHTML(card.find("ctitle"));
 */
shuffl.modelSetHtml = function (fieldobj, holder, thencall)
{
    function setHtml(event, data) {
        ////log.debug("shuffl.modelSetHtml: "+jQuery.toJSON(data.newval));
        var newtext = jQuery.trim(data.newval);
        fieldobj.html(newtext || holder);
        if (thencall !== undefined) { thencall(event, data); };
    }
    if (holder === true)      { holder = shuffl.PlaceHolder; };
    if (holder === undefined) { holder = ""; };
    return setHtml;
};

/**
 * Return a model-change event handler that sets a formatted number value in 
 * a supplied field, or a placeholder value if the model text value is empty.
 * 
 * @param fieldobj  is a jQuery object corresponding to a field that is to be 
 *                  updated with new values assigned to a model element.
 * @param numdig    the number of fractional digits to display
 * @param thencall  if defined, this is an additional function to call
 *                  after the card text has been updated.
 * @return          a function to be used as the update handler for a model
 *                  field.
 */
shuffl.modelSetFloat = function (fieldobj, numdig, thencall)
{
    function setFloat(event, data) {
        var newtext = data.newval;
        if (typeof newtext == "number")
        { 
            newtext = data.newval.toFixed(numdig);
        };
        fieldobj.text(newtext);
        if (thencall !== undefined) { thencall(event, data); };
    }
    return setFloat;
};

/**
 * Return a model-change event handler that sets a table value in a supplied
 * field.
 *
 * @param fieldobj  is a jQuery object corresponding to a field that is to be 
 *                  updated with new values assigned to a model element.
 * @param nh        number of table rows to be treated as headers in the
 *                  rendered table object.
 * @param thencall  if defined, this is an additional function to call
 *                  after the card text has been updated.
 * @return          a function to be used as the update handler for a model
 *                  field.
 */
shuffl.modelSetTable = function (fieldobj, nh, thencall)
{
    function setTable(event, data) {
        fieldobj.table(data.newval || [], nh);
        if (thencall !== undefined) { thencall(event, data); };
    }
    return setTable;
};

/**
 * Returns a function to set series data from an assigned table, where the 
 * graph labels, X-values, and Y-values for each graph are extracted from
 * the table as defined by the 'options' value (defaulting to 1st row for
 * labels, 2nd-to-final rows for graph data, 1st column for X-values and 
 * the remaining columns for successive Y-values).
 * 
 * @param card      is a jQuery card object whose model is updated with series
 *                  data extracted from the new table value.
 * @param options   is an object containing options for extracting data from 
 *                  the table value and creating the series data.
 *
 * Options value fields (default values):
 *   labelrow   (0) table row from which series labels are taken
 *   firstrow   (1) first row of table from which data values are taken
 *   lastrow    (0) last row +1 from which data values are taken
 *              Zero means last row of table. 
 *              Negative values are offsets back from end of table.
 *   datacols   ([[0,1,['x1','y1']],[0,2,['x1','y1']],...[0,width-1],['x1','y1']]) 
 *              list of column numbers from which [x,y] values are taken for 
 *              each series, and the graph axes against which they are plotted 
 *              ('x1', 'x2', 'y1', 'y2').
 *              The second element (Y-column) of each entry is also used to
 *              access the series label from the row designated by 'labelrow'.
 *   setaxes    name of model field that recieves series graph axis tags
 *   setlabels  name of model field that recieves series label values
 *   setseries  name of model field that recieves series data values
 */
shuffl.modelSetSeries = function (card, options) 
{
    ////log.debug("shuffl.modelSetSeries card:"+shuffl.objectString(card));
    ////log.debug("shuffl.modelSetSeries options:"+shuffl.objectString(options));
    // Sort out options
    var useopts = 
        { labelrow:   0
        , firstrow:   1
        , lastrow:    0
        , datacols:   null
        , setaxes:    'shuffl:axes'
        , setlabels:  'shuffl:labels'
        , setseries:  'shuffl:series'
        };
    if (options) jQuery.extend(useopts, options);
    // Function returned
    function setseriesvalues(_event, data)
    {
        ////log.debug("setseriesvalues");
        ////log.debug("- data "+jQuery.toJSON(data));
        ////log.debug("- opts "+jQuery.toJSON(useopts));
        // Sort out table value and options
        var table = data.newval;
        if (table)
        {
            var firstrow = useopts.firstrow;
            var lastrow  = useopts.lastrow;
            if (lastrow <= 0) { lastrow = table.length+lastrow-1; };
            if (firstrow <  0)            {firstrow = 0; };
            if (firstrow >= table.length) {firstrow = table.length-1; };
            if (lastrow  <  0)            {lastrow  = 0; };
            if (lastrow  >= table.length) {lastrow  = table.length-1; };
            var datacols = useopts.datacols;
            if (datacols == null)
            {
                datacols = [];
                for (var j = 1 ; j < table[useopts.labelrow].length ; j++)
                {
                    datacols.push({ xcol:0, ycol:j, xaxis:'x1', yaxis:'y1' });
                };
            };
            ////log.debug("- lastrow "+lastrow);
            ////log.debug("- datacols "+jQuery.toJSON(datacols));
            // Construct label and series data
            var labels = [];
            var series = [];
            var axes   = [];
            for (var k = 0 ; k < datacols.length ; k++)
            {
                var xcol = datacols[k].xcol;
                var ycol = datacols[k].ycol;
                var graph = [];
                for (var i = firstrow ; i <= lastrow ; i++)
                {
                    ////log.debug("- row "+i+", series "+k+", xcol "+xcol+", ycol "+ycol);
                    graph.push(
                        [ parseFloat(table[i][xcol])
                        , parseFloat(table[i][ycol])
                        ]);
                };
                // TODO: combine labels and axes into a list of objects; e.g. "graphs"
                labels.push(table[useopts.labelrow][ycol]);
                axes.push( [datacols[k].xaxis, datacols[k].yaxis] );
                series.push(graph);
            };
            // Store label and series data into model
            card.data(useopts.setlabels,  labels);
            card.data(useopts.setaxes,    axes);
            card.model(useopts.setseries, series);
        };
        card.data('shuffl:datamod',   true);
    };
    return setseriesvalues;
};

// ----------------------------------------------------------------
// Card model editing functions
// ----------------------------------------------------------------

/**
 * Return an edit-completion function that sets a model value on a given card
 * 
 * @param card      is a jQuery card object whose model is linked to an 
 *                  editable field.
 * @param name      is the name of the field to be updated with changes to the
 *                  editable field.
 * @return          a function to be used as an edit-completion function.
 * 
 * The returned function uses its first argument as the new value to be 
 * stored in the card model.
 * 
 * Example:
 *    shuffl.lineEditable(card, ctitle, shuffl.editSetModel(card, "shuffl:title")); 
 */
shuffl.editSetModel = function (card, name)
{
    function setModel(val, _settings) {
        ////log.debug("shuffl.editSetModel: "+val);
        card.model(name, val);
        card.data('shuffl:datamod', true);
    };
    return setModel;
};

/**
 * Function to initialize a single-line editable field and bind its value
 * to a text-valued model variable. 
 * 
 * Updates to the model variable are reflected in the card field, and changes
 * to the field are reflected back to the model variable.
 * 
 * @param card      is a jQuery card object being set up.
 * @param modelvar  is the name of a card model variable that is associated
 *                  with the field.
 * @param fieldsel  is a jQuery selector string for a field within the card
 * @param onchange  if defined, is a function that is called when the model
 *                  value is changed by user interaction or by program action.
 */
shuffl.bindLineEditable = function (card, modelvar, fieldsel, onchange)
{
    var cfield = card.find(fieldsel);
    card.modelBind(modelvar, shuffl.modelSetText(cfield, true, onchange));
    shuffl.lineEditable(card, cfield, shuffl.editSetModel(card, modelvar));
};

/**
 * Function to initialize a single-line editable field and bind its value
 * to a float-valued model variable. 
 * 
 * Updates to the model variable are reflected in the card field, and changes
 * to the field are reflected back to the model variable.
 * 
 * @param card      is a jQuery card object being set up.
 * @param modelvar  is the name of a card model variable that is associated
 *                  with the field.
 * @param fieldsel  is a jQuery selector string for a field within the card
 * @param numdig    the number of fractional digits to display
 * @param onchange  if defined, is a function that is called when the model
 *                  value is changed by user interaction or by program action.
 */
shuffl.bindFloatEditable = function (card, modelvar, fieldsel, numdig, onchange)
{
    var cfield = card.find(fieldsel);
    card.modelBind(modelvar, shuffl.modelSetFloat(cfield, numdig, onchange));
    shuffl.floatEditable(card, cfield, shuffl.editSetModel(card, modelvar));
};

/**
 * Function to buind a field to a click hander that cycles the field content
 * through a supplied list of values.
 * 
 * Updates to the model variable are reflected in the card field, and changes
 * to the field are reflected back to the model variable.
 * 
 * @param card      is a jQuery card object.
 * @param modelvar  is the name of a card model variable that is associated
 *                  with the field.
 * @param fieldsel  is a jQuery selector string for a field within the card
 * @param vals      is a list of values through which the field/model value
 *                  are cycled with each click on the field.
 * @param onchange  if defined, is a function that is called when the model
 *                  value is changed by user interaction or by program action.
 * 
 */
shuffl.bindOptionClickCycle = function (card, modelvar, fieldsel, vals, onchange)
{
    var cfield = card.find(fieldsel);
    card.modelBind(modelvar, 
        shuffl.modelSetText(cfield, "???", shuffl.modifiedCard(card, onchange)));
    cfield.click(function (_event) {
        var old = card.model(modelvar);
        for (var i = 0 ; i < vals.length ; i++)
        {
            if (old == vals[i]) break;
        };
        i = (i+1 >= vals.length ? 0 : i+1);
        card.model(modelvar, vals[i]);
    });
};

// ----------------------------------------------------------------
// Text and content editing support functions
// ----------------------------------------------------------------

/**
 * Placeholder string (if no text on display, it's not possible to click
 * on it to edit in a value.)
 */
shuffl.PlaceHolder = "(Double-click to edit)"

/**
 * Compose a supplied completion function with logic to flag a card as 
 * having been modified.
 * 
 * cf. http://code.google.com/p/shuffl/wiki/CardReadWriteOptions
 * 
 * @param card      jQuery card object to be flagged as modified.
 * @param fn        completion function to be called to process result
 *                  values before they are used to update the card content.
 */
shuffl.modifiedCard = function(card, fn) 
{
    function modified() {
        ////log.debug("shuffl.modifiedCard:editDone");
        card.data('shuffl:datamod', true);
        return ( fn ? fn.apply(this, arguments) : undefined );
    };
    return modified;
}

/**
 * Function called before a text element is edited with a copy of the text,
 * and returning a modified version.  In this case, the raw text is extracted.
 */
shuffl.initEditText = function(value) 
{
    ////log.debug("shuffl.initEditText: "+value);
    return value.replace(/<br[^>]*>/g, "\n\n").replace(/&lt;/g, "<");
};

/**
 * Function called when done editing text: newlines are converted back to <br/>
 * and '<' to '&lt;.
 */
shuffl.doneEditText = function(value, settings) 
{
    ////log.debug("shuffl.doneEditText: "+value);
    return value.replace(/</g,"&lt;").replace(/\n\n/g, "<br/>");
};

/**
 * Function that can be used for submitting new edit text unchanged.
 */
shuffl.passEditText = function(value, settings)
{
    ////log.debug("shuffl.passEditText: "+value);
    return value;
};

/**
 * Set up single line inline edit field
 * 
 * See: http://www.appelsiini.net/projects/jeditable
 */
shuffl.lineEditable = function (card, field, callback) 
{
    field.editable(shuffl.passEditText,
        { data: shuffl.passEditText
        , onblur: 'submit'
        //, tooltip: 'Click to edit...'
        , tooltip: 'Double-click to edit...'
        , placeholder: shuffl.PlaceHolder
        , event:   'dblclick'
        , submit: 'OK'
        , cancel: 'cancel'
        , cssclass: 'shuffl-lineedit'
        , width: 400
        , select: true
        , callback: callback    // (new inerHTML, settings)
        });
};

/**
 * Set up multiline inline edit field
 * 
 * See: http://www.appelsiini.net/projects/jeditable
 */
shuffl.blockEditable = function (card, field, callback) 
{
    field.editable(shuffl.doneEditText, 
        { data: shuffl.initEditText
        , type: 'textarea'
        , onblur: 'submit'
        //, tooltip: 'Click to edit...'
        , tooltip: 'Double-click to edit...'
        , placeholder: shuffl.PlaceHolder
        , event:   'dblclick'
        , submit: 'OK'
        , cancel: 'cancel'
        , cssclass: 'shuffl-blockedit'
        , select: true
        , callback: callback    // (new inerHTML, settings)
        });
};

/**
 * Set up floating point number edit field
 */
shuffl.floatEditable = function (card, field, callback) 
{
    function parseEditFloat(newtext, _s)
    {
        if (newtext.match(/^\s*[+-]?\d+(.\d*)?\s*$/))
        {
            callback(parseFloat(newtext), _s);
        } 
        else 
        {
            // TODO: flag problem with bad syntax
        };
    };
    field.editable(shuffl.passEditText,
        { data: shuffl.passEditText
        , onblur: 'submit'
        //, tooltip: 'Click to edit...'
        , tooltip: 'Double-click to edit...'
        , placeholder: shuffl.PlaceHolder
        , event:   'dblclick'
        , submit: 'OK'
        , cancel: 'cancel'
        , cssclass: 'shuffl-lineedit'
        , width: 40
        , callback: parseEditFloat  // (new inerHTML, settings)
        });
};

// ----------------------------------------------------------------
// Miscellaneous positioning support functions
// ----------------------------------------------------------------

/**
 * Calculate supplied absolute position as offset from supplied object
 */
shuffl.positionRelative = function (pos, obj) 
{
    var base = obj.position();
    ////log.debug("positionRelative: pos  "+pos.left+", "+pos.top);
    ////log.debug("positionRelative: base "+base.left+", "+base.top);
    return shuffl.positionRel(pos, base);
};

/**
 * Calculate absolute position supplied as offset from object
 */
shuffl.positionAbsolute = function (off, obj) 
{
    var base = obj.position();
    ////log.debug("positionAbsolute: off  "+off.left+", "+off.top);
    ////log.debug("positionAbsolute: base "+base.left+", "+base.top);
    return shuffl.positionAbs(base, off);
};

/**
 * Calculate supplied absolute position as offset from supplied object
 */
shuffl.positionRel = function (pos, base) 
{
    return { left: pos.left-base.left, top: pos.top-base.top };
};

/**
 * Calculate absolute position from supplied base and offset
 */
shuffl.positionAbs = function (base, off) 
{
    return { left: base.left+off.left, top: base.top+off.top };
};

// ----------------------------------------------------------------
// Card linking support functions
// ----------------------------------------------------------------

/**
 * Set up indicated card as a drop target.
 * 
 * @param card      jQuery card object to be configured as drop target
 * @param sourcesel source object selector string:  specifies what draggable 
 *                  source objects may be dropped on this card.
 * @param srcvar    name of model variable that is set to the source object
 *                  dropped onto this target. The target should use model 
 *                  listener functions to respond to the drop.
 */
shuffl.dropTarget = function (card, sourcesel, srcvar)
{
    card.droppable(
        { accept:     sourcesel
        , hoverClass: 'shuffl-highlight'
        , tolerance:  'pointer'
        , drop:       function (_event, ui)
              {
              // ui.draggable - current draggable element, a jQuery object.
              // ui.helper - current draggable helper, a jQuery object
              // ui.position - current position of the draggable helper { top: , left: }
              // ui.offset - current absolute position of the draggable helper { top: , left: }
              var tc = ui.draggable;
              ////log.debug("shuffl.card.datagraph - drop "+tc.attr('id')+", "+tc.attr('class'));
              card.model(srcvar, tc);
              }
        ////, over:       function  (_event, _ui) {}
        ////, out:        function  (_event, _ui) {}
        });
};

// End.
