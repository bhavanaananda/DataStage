/**
 * @fileoverview
 * Shuffl card plug-in for a card containing a data worksheet.
 * 
 * This card is based on the "datatable" card, but expects a general 
 * spreadsheet worksheet from which label rows, data rows and data columns
 * can be selected from arbitrary locations.
 *  
 * @author Graham Klyne
 * @version $Id: shuffl-card-dataworksheet.js 828 2010-06-14 15:26:11Z gk-google@ninebynine.org $
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
    alert("shuffl-card-dataworksheet.js: shuffl-base.js must be loaded first");
}
if (typeof shuffl.card == "undefined") 
{
    alert("shuffl-card-dataworksheet.js: shuffl-cardhandlers.js must be loaded before this");
}

/**
 * Create namespace for this card type
 */
shuffl.card.dataworksheet = {};

/**
 * Default table data
 */
shuffl.card.dataworksheet.table = [ [] ];

/**
 * jQuery base element for building new cards (used by shuffl.makeCard)
 */
shuffl.card.dataworksheet.blank = jQuery(
    "<div class='shuffl-card-setsize shuffl-series' style='z-index:10;'>\n"+
    "  <chead>\n"+
    "    <chandle><c></c></chandle>" +
    "    <ctitle>card title</ctitle>\n"+
    "  </chead>\n"+
    "  <crow>\n"+
    "    <curi>card_ZZZ uri</curi>\n"+
    "    <cbrowse><button>Browse...</button></cbrowse>\n"+
    "  </crow>\n"+
    "  <crow>\n"+
    "    <cbody class='shuffl-nodrag'>\n"+
    "      <table>\n"+
    "        <tr><td></td><td>col1</td><td>col2</td><td>col3</td></tr>\n"+
    "        <tr><td>row1</td><td>1.1</td><td>1.2</td><td>1.3</td></tr>\n"+
    "        <tr><td>End.</td></tr>\n"+
    "      </table>\n"+
    "    </cbody>\n"+
    "  </crow>\n"+
    "  <cfoot>\n"+
    "    <ctagslabel>Tags: </ctagslabel><ctags>card_ZZZ tags</ctags>\n"+
    "  </cfoot>\n"+
    "</div>");

/**
 * Template for initializing a card model, and 
 * creating new card object for serialization.
 * 
 * 'shuffl:coluse' is a list of values:
 *   null         column ignored
 *   {axis: 'x1'} value used for 'x1' axis
 *   {axis: 'x2'} value used for 'x2' axis
 *   {axis: 'y1'} value plotted on 'y1' axis (against 'x1')
 *   {axis: 'y2'} value plotted on 'y2' axis (against 'x2')
 * 
 * For {axis: 'y1'} and {axis: 'y2'} values, additional fields may be defined:
 *   col: colour  colour of graph, as index number or CSS value
 */
shuffl.card.dataworksheet.datamap =
    { 'shuffl:title':         { def: '@id' }
    , 'shuffl:tags':          { def: '@tags', type: 'array' }
    , 'shuffl:uri':           { def: "" }
    , 'shuffl:table':         { def: shuffl.card.dataworksheet.table }
    // Initialize these *after* shuffl:table:
    , 'shuffl:header_row':    { def: 0,  pass: 2 }
    , 'shuffl:data_firstrow': { def: 1,  pass: 2 }
    , 'shuffl:data_lastrow':  { def: 0,  pass: 2 }
    , 'shuffl:coluse':        { def: [], pass: 2 }
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
shuffl.card.dataworksheet.newCard = function (cardtype, cardcss, cardid, carddata)
{
    log.debug("shuffl.card.dataworksheet.newCard: "+
        cardtype+", "+cardcss+", "+cardid+", "+carddata);
    // Initialize the card object
    var card = shuffl.card.dataworksheet.blank.clone();
    card.data('shuffl:type' ,  cardtype);
    card.data('shuffl:id',     cardid);
    card.data("shuffl:tojson", shuffl.card.dataworksheet.serialize);
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
    var cbody    = card.find("cbody");
    var updatefn = shuffl.card.dataworksheet.updatedata(card, cbody);
    card.modelBind("shuffl:table", function (_event, data)
    {
        log.debug("shuffl.card.dataworksheet: shuffl:table updated");
        card.data("shuffl:header_row",    0);
        card.data("shuffl:data_firstrow", 1);
        card.data("shuffl:data_lastrow",  0);
        card.data("shuffl:coluse",        []);
        updatefn(_event, undefined);
    });
    card.modelBind("shuffl:header_row", function (_event, data)
    {
        log.debug("shuffl.card.dataworksheet: shuffl:data_firstrow updated: "+data.newval);
        card.data("shuffl:data_firstrow", data.newval+1);
        updatefn(_event, undefined);
    });
    card.modelBind("shuffl:data_firstrow", updatefn);
    card.modelBind("shuffl:data_lastrow",  updatefn);
    card.modelBind("shuffl:coluse",        updatefn);
    // Hook up the browse button
    function browseClicked(event)
    {
        shuffl.card.dataworksheet.browseClicked(card, event);
    };
    card.find("cbrowse").click(browseClicked);
    card.modelBind("shuffl:browse", browseClicked); // For testing
    // Hook up the row-selection pop-up menu
    shuffl.card.dataworksheet.contextMenu(card, cbody);
    // Initialize the model
    shuffl.initModel(card, carddata, shuffl.card.dataworksheet.datamap,
        {id: cardid, tags: [cardtype]} 
        );
    // Note that setting the table resets the row values..
    ////shuffl.initModelVar(card, 'shuffl:header_row',    carddata, 0);
    ////shuffl.initModelVar(card, 'shuffl:data_firstrow', carddata, 1);
    ////shuffl.initModelVar(card, 'shuffl:data_lastrow',  carddata, 0);
    // Finally, set listener for changes to URI value to read new data
    // This comes last so that the setting of shuffl:uri (above) does not
    // trigger a read when initializing a card.
    card.modelBind("shuffl:uri", function (event, data) {
        log.debug("Read "+data.newval+" into data table");
        if (shuffl.ends("/",data.newval))
        {
            card.model("shuffl:table", [[]]);
        }
        else
        {
            jQuery.getCSV(data.newval, function (data, status) {
                ////log.debug("- status "+status+", data "+jQuery.toJSON(data));
                if (status == "success") card.model("shuffl:table", data);
            });
        };
    });
    return card;
};

/**
 * Serializes a tabular data card to JSON for storage
 * 
 * @param card      a jQuery object corresponding to the card
 * @return          an object containing the card data
 */
shuffl.card.dataworksheet.serialize = function (card) 
{
    return shuffl.serializeModel(card, shuffl.card.dataworksheet.datamap);
};

/**
 * Helper function invokes a selectfile card for data file browsing,
 * called in response to a click on the "browse" button
 * 
 * @param card      a jQuery object corresponding to the current card
 * @param event     the button-click event causing this function to be invoked
 */
shuffl.card.dataworksheet.browseClicked = function (card, event)
{
    // Create selectfile card
    ////log.debug("shuffl.card.dataworksheet.browseClicked");
    var selectfile = shuffl.card.selectfile.newCard("shuffl-selectfile", "stock-default", "card-1",
        { 'shuffl:title':   "Select worksheet file"
        , 'shuffl:fileuri': card.model("shuffl:uri")
        });
    // shuffl.placeCard(layout, card, pos, size, zindex) 
    shuffl.placeCard(
        jQuery('#layout'), 
        selectfile, 
        shuffl.positionAbsolute({"left":10, "top":10}, card),
        ////{"left":10, "top":10},
        {width:"30em", height:"15em"}
        );
    // Listen to shuffl:fileuri - update local URI
    //   fn(event, data) {
    //      // this  = jQuery object containing changed model variable
    //      // event = jQuery event object
    //      // data  = {name:modelvarname, oldval:oldval, newval:value}
    //   };
    selectfile.modelBind("shuffl:fileuri", 
        function (event, val)
        {
            try 
            {
                log.debug("Selectfile card fileuri updated "+val.newval);
                card.model("shuffl:uri", val.newval.toString());
            } 
            catch(e) 
            {
                log.error("selectfile new fileuri error "+e);
            };
        });
    // Listen for shuffl:closeuri - unhook handlers
    selectfile.modelBind("shuffl:closeUri", 
        function (event, val)
        {
            log.debug("Selectfile card fileuri closing "+val.newval);
            selectfile.modelUnbind("shuffl:fileuri");
            selectfile.modelUnbind("shuffl:closeUri");
        });
};

/**
 * Helper function sets an indicated card model variable to the previously 
 * saved row number.
 * 
 * @param card      is the card object containing the table data for display.
 * @param modelvar  is the card model variable that is set to the row number.
 */
shuffl.card.dataworksheet.setRowNumber = function (card, modelvar)
{
    var rownum = card.data("rownum");
    log.debug("- menu select: modelvar "+modelvar+", row "+rownum);
    card.model(modelvar, rownum);
    card.model('shuffl:datamod', true);
};

/**
 * Helper function saves column use selected by context menu selection.
 * 
 * Manual selection causes the column use to be explicitly fixed rather
 * that dynamically responding to, say, the header row selection.
 * 
 * @param card      is the card object containing the table data for display.
 * @param newcoluse is an object that describes the purpose of the currently
 *                  selected column.
 */
shuffl.card.dataworksheet.setColumnUse = function (card, newcoluse)
{
    var colnum = card.data("colnum");
    log.debug("- menu select: newcoluse "+jQuery.toJSON(newcoluse)+", col "+colnum);
    // Get current column usage (may calculated default)
    var table  = card.model("shuffl:table");
    var hrow   = card.model("shuffl:header_row");
    var coluse = shuffl.card.dataworksheet.coluse(card, table[hrow]);
    // Pad out coluse to new length
    for (var i = coluse.length ; i <= colnum ; i++) coluse[i] = {};
    // Preserve x-axis selection count by swap with current setting (if any)
    var oldcoluse = coluse[colnum];
    var swap  = -1;
    var oldy1 = -1;
    var oldy2 = -1;
    if (newcoluse.axis == 'x1' || newcoluse.axis == 'x2' ||
        oldcoluse.axis == 'x1' || oldcoluse.axis == 'x2')
    {
        for (i = 0 ; i < coluse.length ; i++)
        {
            if (oldy1 < 0 && coluse[i].axis == 'y1') oldy1 = i;
            if (oldy2 < 0 && coluse[i].axis == 'y2') oldy2 = i;
            if (i != colnum && coluse[i].axis == newcoluse.axis)
            {
                swap = i;
                break;
            };
        };
        // Swap with first y1 or first y2 if no match seen
        if (swap < 0) swap = (oldy1 >= 0 ? oldy1 : oldy2);
    };
    if (swap >= 0)
    {
        coluse[swap] = oldcoluse;
    }
    // Set new value
    coluse[colnum] = newcoluse;
    // Save new column use as explicitly stored model value
    card.model("shuffl:coluse", coluse);
    card.model('shuffl:datamod', true);
};

/**
 * Helper function to update data labels and series values in model, using
 * dynamically set row values from the card model.
 * 
 * @param card      is the card object containing the table data for display.
 * @param cbody     is the card element where the table data is displayed.
 */
shuffl.card.dataworksheet.updatedata = function (card, cbody)
{
    function update(_event, _data)
    {
        ////log.debug("shuffl.card.dataworksheet.updatedata:update");
        // Set header row above table
        var table = card.model("shuffl:table");
        if (table)
        {
            // Sort out header row and data
            var hrow = card.model("shuffl:header_row");
            var hdrs = table[hrow];
            // Set new table data
            var htbl = [ hdrs ].concat(table);
            cbody.table(htbl, 1);
            // Sort out first and last data rows, and column usage
            var datarows = shuffl.card.dataworksheet.rowuse(card, table);
            var coluse   = shuffl.card.dataworksheet.coluse(card, hdrs);
            var dataplot = shuffl.card.dataworksheet.dataplot(card, coluse);
            // Highlight selected data in the table display
            shuffl.card.dataworksheet.highlightData(cbody, datarows, coluse);
            // Set up graph labels and series data
            var options =
                { labelrow:   hrow
                , firstrow:   datarows.first
                , lastrow:    datarows.last
                , datacols:   dataplot
                , setaxes:    'shuffl:axes'
                , setlabels:  'shuffl:labels'
                , setseries:  'shuffl:series'
                };
            shuffl.modelSetSeries(card, options)(_event, {newval: table});
            card.model('shuffl:datamod', true);
        };
    };
    return update;
};

// ----------------------------------------------------------------
// Helper functions
// ----------------------------------------------------------------

/**
 * Attach context menu for data selection to the card body element used to
 * display the tabular data.
 */
shuffl.card.dataworksheet.contextMenu = function (card, cbody)
{
    cbody.contextMenu('dataworksheet_rowSelectMenu', {
        menuStyle: {
            'font-weight': 'bold',
            'background-color': '#DDDDDD',
            'border': 'thin #666666 solid'
            },
        showOnClick: true,
        onContextMenu: function (event)
        {
            ////log.debug("- onContextMenu "+this);
            ////jQuery(event.target).css("border", "2px dotted blue");
            // TODO: is there a better way to find which row was clicked?
            var cur = this;
            cbody.find("tbody tr").each(function (rownum)
            {
                // this = dom element
                // TODO: is there a better way to test for ancestry?
                if (jQuery(this).find("*").index(event.target) >= 0) 
                {
                    ////log.debug("- rownum "+rownum);
                    card.data("rownum", rownum);
                    card.data("colnum", -1);
                };
            });
            ////cbody.find("thead th").css("border", "2px dotted blue");
            cbody.find("thead th").each(function (colnum)
            {
                if (jQuery(this).filter("*").index(event.target) >= 0) 
                {
                    ////log.debug("- colnum "+colnum);
                    card.data("colnum", colnum);
                };
            });
            return true;
        },
        onShowMenu: function (e, menu) {
            ////log.debug("- onShowMenu "+this);
            if (card.data("colnum") >= 0)
            {
                menu.find("li.shuffl-rowoption").hide();
            }
            else
            {
                menu.find("li.shuffl-coloption").hide();
            }
            return menu;
        },
        bindings: {
            'dataworksheet_labelrow': function (_elem)
            {
                log.debug('Row select dataworksheet_labelrow');
                shuffl.card.dataworksheet.setRowNumber(card, 'shuffl:header_row');
            },
            'dataworksheet_firstrow': function (_elem)
            {
                log.debug('Row select dataworksheet_firstrow');
                shuffl.card.dataworksheet.setRowNumber(card, 'shuffl:data_firstrow');
            },
            'dataworksheet_lastrow': function (_elem)
            {
                log.debug('Row select dataworksheet_lastrow');
                shuffl.card.dataworksheet.setRowNumber(card, 'shuffl:data_lastrow');
            },
            'dataworksheet_noaxis': function (_elem)
            {
                log.debug('Col select dataworksheet_noaxis');
                shuffl.card.dataworksheet.setColumnUse(card, {});
            },
            'dataworksheet_x1axis': function (_elem)
            {
                log.debug('Col select dataworksheet_x1axis');
                shuffl.card.dataworksheet.setColumnUse(card, { axis: 'x1' });
            },
            'dataworksheet_x2axis': function (_elem)
            {
                log.debug('Col select dataworksheet_x2axis');
                shuffl.card.dataworksheet.setColumnUse(card, { axis: 'x2' });
            },
            'dataworksheet_y1axis': function (_elem)
            {
                log.debug('Col select dataworksheet_y1axis');
                shuffl.card.dataworksheet.setColumnUse(card, { axis: 'y1' });
            },
            'dataworksheet_y2axis': function (_elem)
            {
                log.debug('Col select dataworksheet_y2axis');
                shuffl.card.dataworksheet.setColumnUse(card, { axis: 'y2' });
            },
        }
    });
};

/**
 * Determine first and last data rows of data in the table.
 * 
 * @param card      reference to card object
 * @param table     data table contained within the card object
 * @return          an object {first:rownum, last: rownum}, indicating the 
 *                  first and last rows (inclusive) of data.
 */
shuffl.card.dataworksheet.rowuse = function (card, table)
{
    ////log.debug("shuffl.card.dataworksheet.rowuse");
    var frow = card.model("shuffl:data_firstrow");
    var lrow = card.model("shuffl:data_lastrow");
    if (frow <  0 || frow >= table.length) { frow = 0; }
    if (lrow <= 0 || lrow >= table.length) { lrow = table.length-1; }
    if (frow > lrow)
    {
        frow = lrow;
        lrow = card.model("shuffl:data_firstrow");
    }
    return {first: frow, last:lrow};
};

/**
 * Sort out columns to use.  This function establishes a default column-usage 
 * based on the selected header row.  If an explicit coluse value is defined,
 * that is used instead.
 * 
 * @param card      reference to card object
 * @param hdrs      column headers: by default, columns used are those with
 *                  non-empty header labels, with the first such column being 
 *                  the x-axis variable.
 * @return          a list of column-use values, {} for unused columns, or
 *                  an object {axis:axisname}, where:
 *                  axis:'x1' indicates an x1-axis variable
 *                  axis:'y1' indicates a variable to be plotted on the y1-axis
 */
shuffl.card.dataworksheet.coluse = function (card, hdrs)
{
    var coluse   = card.data("shuffl:coluse");
    ////log.debug("- coluse "+jQuery.toJSON(coluse));
    if (!coluse || !coluse.length)
    {
        ////log.debug("- coluse default");
        coluse = [];
        var nxtuse = {axis: 'x1'};
        for (var i = 0 ; i < hdrs.length ; i++)
        {
            if (hdrs[i])
            {
                coluse.push(nxtuse);
                nxtuse = {axis: 'y1'};
            }
            else
            {
                coluse.push({});
            }
        };
    };
    return coluse;
};

/**
 * Return list of data plots to be generated
 * 
 * @param card      reference to card object
 * @param coluse    Column usage array, as returned by shuffl.card.dataworksheet.coluse
 * @return          a list of graph descriptors, where each descriptor consists
 *                  of {xcol:col, ycol:col, xaxis:axis, yaxis:axis}
 */
shuffl.card.dataworksheet.dataplot = function (card, coluse)
{
    var x1 = undefined;
    var x2 = undefined;
    for (var i=0 ; i<coluse.length ; i++)
    {
        if (coluse[i] && coluse[i].axis == 'x1') { x1 = i; };
        if (coluse[i] && coluse[i].axis == 'x2') { x2 = i; };
    };
    var dataplot = [];
    for (i=0 ; i<coluse.length ; i++)
    {
        var yaxis = undefined;
        if (coluse[i]) 
        {
            yaxis = coluse[i].axis;
            if ((yaxis == 'y1' || yaxis == 'y2'))
            {
                dataplot.push({xcol:x1, ycol:i, xaxis:'x1', yaxis:yaxis});
            };
        };
    };
    return dataplot;
};

/**
 * Grey out rows and columns that are not part of selected data 
 * (apply 'shuffl-deselected' style).
 * 
 * @param cbody     reference to the card body displaying the worksheet.
 * @param datarows  first and last data rows, as returned by
 *                  shuffl.card.dataworksheet.rowuse.
 * @param coluse    column use descriptor, as returned by 
 *                  shuffl.card.dataworksheet.coluse.
 */
shuffl.card.dataworksheet.highlightData = function (cbody, datarows, coluse)
{
    ////log.debug("shuffl.card.dataworksheet.highlightData");
    ////log.debug("- datarows "+datarows.first+", "+datarows.last);
    ////log.debug("- dataplot "+jQuery.toJSON(coluse));
    cbody.find("thead th").each(function (colnum)
        {
            ////log.debug("- colnum "+colnum+", coluse "+coluse[colnum]);
            var thelem = jQuery(this);
            if (coluse[colnum] && coluse[colnum].axis)
            {
                thelem.removeClass("shuffl-deselected");
            }
            else
            {
                thelem.addClass("shuffl-deselected");
            };
        });
    cbody.find("tbody tr").each(function (rownum)
    {
        // this = dom element
        var trelem = jQuery(this);
        if (rownum >= datarows.first && rownum <= datarows.last)
        {
            // In row range: select/deselect columns
            trelem.removeClass("shuffl-deselected");
            trelem.find("td").each(function (colnum)
            {
                ////log.debug("- colnum "+colnum+", coluse "+coluse[colnum]);
                var tdelem = jQuery(this);
                if (coluse[colnum] && coluse[colnum].axis)
                {
                    tdelem.removeClass("shuffl-deselected");
                }
                else
                {
                    tdelem.addClass("shuffl-deselected");
                };
            });
        } 
        else 
        {
            // Out of row range: deselect row
            trelem.addClass("shuffl-deselected");
        };
   });
};

// ----------------------------------------------------------------
// Initialization
// ----------------------------------------------------------------

/**
 * Add row-selector menu to main workspace
 */
jQuery(document).ready(function() 
{
    var contextRowColSelectMenu = 
        "  <div class='contextMenu' id='dataworksheet_rowSelectMenu' style='display:none;'>\n"+
        "    <ul>\n"+
        "      <li id='dataworksheet_labelrow' class='shuffl-rowoption'>Label row</li>\n"+
        "      <li id='dataworksheet_firstrow' class='shuffl-rowoption'>First data row</li>\n"+
        "      <li id='dataworksheet_lastrow'  class='shuffl-rowoption'>Last data row</li>\n"+
        "      <li id='dataworksheet_noaxis'   class='shuffl-coloption'>no data</li>\n"+
        "      <li id='dataworksheet_x1axis'   class='shuffl-coloption'>x1 axis</li>\n"+
        "      <li id='dataworksheet_y1axis'   class='shuffl-coloption'>y1 axis</li>\n"+
        "      <li id='dataworksheet_y2axis'   class='shuffl-coloption'>y2 axis</li>\n"+
        "    </ul>\n"+
        "  </div>\n";
    jQuery("body").append(contextRowColSelectMenu);
});

/**
 *   Add new card type factories
 */
shuffl.addCardFactory("shuffl-dataworksheet-yellow", "stock-yellow", shuffl.card.dataworksheet.newCard);
shuffl.addCardFactory("shuffl-dataworksheet-blue",   "stock-blue",   shuffl.card.dataworksheet.newCard);
shuffl.addCardFactory("shuffl-dataworksheet-green",  "stock-green",  shuffl.card.dataworksheet.newCard);
shuffl.addCardFactory("shuffl-dataworksheet-orange", "stock-orange", shuffl.card.dataworksheet.newCard);
shuffl.addCardFactory("shuffl-dataworksheet-pink",   "stock-pink",   shuffl.card.dataworksheet.newCard);
shuffl.addCardFactory("shuffl-dataworksheet-purple", "stock-purple", shuffl.card.dataworksheet.newCard);

// End.
