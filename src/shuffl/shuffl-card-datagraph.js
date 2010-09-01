/**
 * @fileoverview
 * Shuffl card plug-in for a card graphing tabular data.
 * 
 * This plugin is initially based on the shuffl-card-datatable plugin, except
 * that the display area is rendered using 'flot' rather than as an HTML table.
 *  
 * @author Graham Klyne
 * @version $Id: shuffl-card-datagraph.js 828 2010-06-14 15:26:11Z gk-google@ninebynine.org $
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
    alert("shuffl-card-datagraph.js: shuffl-base.js must be loaded first");
}
if (typeof shuffl.card == "undefined") 
{
    alert("shuffl-card-datagraph.js: shuffl-cardhandlers.js must be loaded before this");
}

/**
 * Create namespace for this card type
 */
shuffl.card.datagraph = {};

/**
 * Template for initializing a card model, and 
 * creating new card object for serialization.
 */
shuffl.card.datagraph.datamap =
    { 'shuffl:title':     { def: '@id' }
    , 'shuffl:tags':      { def: '@tags', type: 'array' }
    , 'shuffl:source_id': { def: undefined }
    , 'shuffl:labels':    { def: undefined }
    , 'shuffl:axes':      { def: undefined }
    , 'shuffl:series':    { def: undefined }
    , 'shuffl:dataminy':  { def: undefined }
    , 'shuffl:datamaxy':  { def: undefined }
    , 'shuffl:x1axis':    { def: 'lin' }
    , 'shuffl:y1axis':    { def: 'lin' }
    , 'shuffl:y2axis':    { def: 'lin' }
    };

/*
 * Default data...
 */
shuffl.card.datagraph.table = [ [] ];

/**
 * jQuery base element for building new cards (used by shuffl.makeCard)
 */
shuffl.card.datagraph.blank = jQuery(
    "<div class='shuffl-card-setsize' style='z-index:10;'>\n"+
    "  <chead>\n"+
    "    <chandle><c></c></chandle>" +
    "    <ctitle>card title</ctitle>\n"+
    "  </chead>\n"+
    "  <crow>\n"+
    "    <cbody>\n"+
    "      <div style='width:98%; height:98%;'/>\n"+
    "    </cbody>\n"+
    "  </crow>\n"+
    "  <crow style='width: 100%; white-space: nowrap;'>\n"+
    "    <span style='display: inline-block; width: 14%;'>x1: <cx1axis/></span>\n"+
    "    <span style='display: inline-block; width: 14%;'>y1: <cy1axis/></span>\n"+
    "    <span style='display: inline-block; width: 14%;'>y2: <cy2axis/></span>\n"+
    "    <span style='display: inline-block; width: 25%;'>min Y: <cdataminy style='display: inline-block;'>-1.0</cdataminy></span>\n"+
    "    <span style='display: inline-block; width: 25%;'>max Y: <cdatamaxy style='display: inline-block;'> 1.0</cdatamaxy></span>\n"+
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
 *                      'shuffl:title', 'shuffl:tags', 'shuffl:labels', etc.
 * @return              a jQuery object representing the new card.
 */
shuffl.card.datagraph.newCard = function (cardtype, cardcss, cardid, carddata) 
{
    ////log.debug("shuffl.card.datagraph.newCard: "+cardtype+", "+cardcss+", "+cardid);
    ////log.debug("- data: "+jQuery.toJSON(carddata));
    // Initialize the card object
    var card = shuffl.card.datagraph.blank.clone();
    card.data('shuffl:type' ,  cardtype);
    card.data('shuffl:id',     cardid);
    card.data("shuffl:tojson", shuffl.card.datagraph.serialize);
    card.attr('id', cardid);
    card.addClass(cardcss);
    card.find("cident").text(cardid);       // Set card id text
    card.find("cclass").text(cardtype);     // Set card class/type text
    card.data("resizeAlso", "cbody");
    card.resizable();
    // Set up function to (re)draw the card when placed or resized
    var redraw = shuffl.card.datagraph.redraw(card);
    card.data("redrawFunc", redraw);
    // Set up card as drop-target for data table
    shuffl.dropTarget(card, '.shuffl-series', 'shuffl:source');
    // Set up model listener and user input handlers
    shuffl.bindLineEditable(card, "shuffl:title", "ctitle");
    shuffl.bindLineEditable(card, "shuffl:tags",  "ctags");
    shuffl.bindOptionClickCycle(
        card, "shuffl:x1axis", "cx1axis", ["lin", "log"], redraw);
    shuffl.bindOptionClickCycle(
        card, "shuffl:y1axis", "cy1axis", ["lin", "log"], redraw);
    shuffl.bindOptionClickCycle(
        card, "shuffl:y2axis", "cy2axis", ["lin", "log"], redraw);
    shuffl.bindFloatEditable(
        card, "shuffl:dataminy", "cdataminy", 2, redraw);
    shuffl.bindFloatEditable(
        card, "shuffl:datamaxy", "cdatamaxy", 2, redraw);
    card.modelBind("shuffl:labels", redraw);
    card.modelBind("shuffl:axes",   redraw);
    card.modelBind("shuffl:series", shuffl.card.datagraph.setseriesdata(card));
    card.modelBind("shuffl:table",  shuffl.card.datagraph.setgraphdata(card));
    // Handle source drop, including subscription to changes in the source data
    card.modelBind("shuffl:source", function (_event, data) 
    {
        var oldsub = card.data("updatesubs");
        if (oldsub)
        {
            var oldsrc = data.oldval;
            oldsrc.modelUnbind("shuffl:title",  oldsub);
            oldsrc.modelUnbind("shuffl:labels", oldsub);
            oldsrc.modelUnbind("shuffl:axes",   oldsub);
            oldsrc.modelUnbind("shuffl:series", oldsub);
        };
        var src    = data.newval;
        var newsub = shuffl.card.datagraph.updatedata(card, src);
        newsub();
        src.modelBind("shuffl:title",  newsub);
        src.modelBind("shuffl:labels", newsub);
        src.modelBind("shuffl:axes",   newsub);
        src.modelBind("shuffl:series", newsub);
        card.data("updatesubs", newsub);
        card.data("shuffl:source_id", src.data('shuffl:id'));
    });
    // Initialize the model
    shuffl.initModel(card, carddata, shuffl.card.datagraph.datamap,
        {id: cardid, tags: [cardtype]} 
        );
    // If card is linked, complete setting link when all cards have been loaded
    // (shuffl.LoadWorkspace triggers an event when all cards have been loaded)
    var cardsrcid = card.model('shuffl:source_id');
    if (cardsrcid)
    {
        card.one("shuffl:AllCardsLoaded", function () {
            var src = jQuery(document.getElementById(cardsrcid));
            if (src.length == 1)
            {
                card.model("shuffl:source", src.eq(0));
            };
        });
    };
    if (!card.model('shuffl:series'))
    {
        card.model("shuffl:table", shuffl.card.datagraph.table);
    };
    return card;
};

/**
 * Returns a function to set graphing data from an assigned table, where the 
 * first row of the table is graph labels, the first column contains X-values, 
 * and the remaining columns contain Y-values for each graph.
 */
shuffl.card.datagraph.setgraphdata = function (card) 
{
    function setgraphvalues(_event, data)
    {
        ////log.debug("- data "+jQuery.toJSON(data));
        card.data("shuffl:table",  null);
        shuffl.modelSetSeries(card)(_event, data);
    };
    return setgraphvalues;
};

/**
 * Returns a function to handle new graph data assigned to a series, which
 * is an array, each element of which is a list of [x,y] pairs.
 *   
 * Minimum and maximum Y values are recalculated, and a redraw is scheduled.
 */
shuffl.card.datagraph.setseriesdata = function (card) 
{
    function setseriesvalues(_event, data)
    {
        var series = data.newval;
        if (series && series.length)
        {
            ////log.debug("- series "+jQuery.toJSON(series));
            var ymin = series[0][0][1];
            var ymax = series[0][0][1];
            ////log.debug("- ymin "+ymin+", ymax "+ymax);
            for (var i = 0 ; i < series.length ; i++)
            {
                var graph = series[i];
                for (var j = 0 ; j < graph.length ; j++)
                {
                    var y = graph[j][1];
                    if (isFinite(y))
                    {
                        ymin = Math.min(ymin, y);
                        ymax = Math.max(ymax, graph[j][1]);
                    };
                };
            };
            ////log.debug("- ymin "+ymin+", ymax "+ymax);
            card.model("shuffl:dataminy", ymin);
            card.model("shuffl:datamaxy", ymax);
            shuffl.card.datagraph.redraw(card)();
        };
    };
    return setseriesvalues;
};

/**
 * Return function to update graph data from the supplied drop source
 */
shuffl.card.datagraph.updatedata = function (card, src)
{
    function update(_event, _data)
    {
        var srctitle = src.model("shuffl:title");
        if (srctitle)
        {
            var title = card.model("shuffl:title").replace(/ \([^)]+\)$/,"");
            card.model("shuffl:title", title+" ("+src.model("shuffl:title")+")");
        }
        card.data("shuffl:labels",  src.model("shuffl:labels"));
        card.data("shuffl:axes",    src.model("shuffl:axes"));
        card.model("shuffl:series", src.model("shuffl:series"));
    };
    return update;
};

/**
 * Return function to redraw the graph in a supplied datagraph card
 * following an update to the card model.
 */
shuffl.card.datagraph.redraw = function (card)
{
    function drawgraph(_event, _data)
    {
        // Redraw after 50ms
        shuffl.redrawAfter(card, shuffl.card.datagraph.draw, 50.0);
        card.data('shuffl:datamod', true);
    };
    return drawgraph;
};

/**
 * Variable transform Log10
 */
shuffl.card.datagraph.log10transform =
    { transform:        function (x) 
        { 
            if (typeof x != "number" || x<=0.0) { return null; };
            return Math.LOG10E*Math.log(x); 
        }
    , inverseTransform: function (x) { return Math.exp(x/Math.LOG10E); }
    };

/**
 * Log10 transform tick generator
 */
shuffl.card.datagraph.log10tickgenerator = function (axis)
{
    function label(log)
    {
        return (log == 0 ? "1" : (log > 0 ? "1E+"+log : "1E"+log));
    };
    var log10  = shuffl.card.datagraph.log10transform;
    var minlog = Math.floor(log10.transform(axis.min)+1.0E-8 || -10);
    var maxlog = Math.ceil(log10.transform(axis.max)-1.0E-8  ||   0);
    var ticks = [];
    for (var l = minlog ; l < maxlog ; l++)
    {
        var t = log10.inverseTransform(l);
        ticks.push([t,label(l)]);
        for (var f = 2.0 ; f <= 8.0 ; f += 2.0) ticks.push([t*f,""]);
    };
    ticks.push([log10.inverseTransform(maxlog),label(maxlog)]);
    return ticks;
};

/**
 * Function to draw the graph in a supplied datagraph card
 */
shuffl.card.datagraph.draw = function (card)
{
    var ymin   = card.model('shuffl:dataminy');
    var ymax   = card.model('shuffl:datamaxy');
    var x1axis = card.model('shuffl:x1axis');
    var y1axis = card.model('shuffl:y1axis');
    var y2axis = card.model('shuffl:y2axis');
    var labels = card.model('shuffl:labels');
    var axes   = card.model('shuffl:axes');
    var series = card.model('shuffl:series');
    var cbody  = card.find("cbody");
    var gelem  = cbody.find("div");
    ////log.debug("shuffl.card.datagraph.draw "+cbody.width()+", "+cbody.height());
    ////log.debug("shuffl.card.datagraph.draw "+gelem.width()+", "+gelem.height());
    if (labels && series && gelem.width() && gelem.height())
    {
        ////log.debug("- plot graphs "+ymin+", "+ymax);
        var data   = [];
        for (var i = 0 ; i < labels.length ; i++)
        {
            var yaxis = ( axes[i][1] == 'y2' ? 2 : 1 );
            data.push(
                { data: series[i]
                , label: labels[i]
                , xaxis: 1
                , yaxis: yaxis
                });
        }
        var options =
            { series:
                { lines:  { show: true }
                , points: { show: false, fill: false }
                }
            , xaxis:
                { labelWidth: 40
                }
            , yaxis: {}
            , y2axis: {}
            };
        if (isFinite(ymin) && isFinite(ymax) && (ymin<ymax))
        {
            options.yaxis = { min: ymin, max: ymax };
        }
        if (x1axis == 'log')
        {
            jQuery.extend(options.xaxis, shuffl.card.datagraph.log10transform);
            options.xaxis.ticks = shuffl.card.datagraph.log10tickgenerator;
        }
        if (y1axis == 'log')
        {
            jQuery.extend(options.yaxis, shuffl.card.datagraph.log10transform);
            options.yaxis.ticks = shuffl.card.datagraph.log10tickgenerator;
        }
        if (y2axis == 'log')
        {
            jQuery.extend(options.y2axis, shuffl.card.datagraph.log10transform);
            options.y2axis.ticks = shuffl.card.datagraph.log10tickgenerator;
        }
        var plot = jQuery.plot(gelem, data, options);
    };
};

/**
 * Serializes a tabular data card to JSON for storage
 * 
 * @param card      a jQuery object corresponding to the card
 * @return          an object containing the card data
 */
shuffl.card.datagraph.serialize = function (card) 
{
    return shuffl.serializeModel(card, shuffl.card.datagraph.datamap);
};

/**
 *   Add new card type factories
 */
shuffl.addCardFactory("shuffl-datagraph-yellow", "stock-yellow", shuffl.card.datagraph.newCard);
shuffl.addCardFactory("shuffl-datagraph-blue",   "stock-blue",   shuffl.card.datagraph.newCard);
shuffl.addCardFactory("shuffl-datagraph-green",  "stock-green",  shuffl.card.datagraph.newCard);
shuffl.addCardFactory("shuffl-datagraph-orange", "stock-orange", shuffl.card.datagraph.newCard);
shuffl.addCardFactory("shuffl-datagraph-pink",   "stock-pink",   shuffl.card.datagraph.newCard);
shuffl.addCardFactory("shuffl-datagraph-purple", "stock-purple", shuffl.card.datagraph.newCard);

// End.
