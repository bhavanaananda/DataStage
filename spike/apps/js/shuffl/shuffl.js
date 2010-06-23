/**
 * @fileoverview
 *  Shuffl application main code.
 *  
 * @author Graham Klyne
 * @version $Id: shuffl.js 825 2010-06-09 16:22:57Z gk-google@ninebynine.org $
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

// If errors are seen, run Eclipse "(right-click project) > Validate" option

// Meanwhile, this suppresses many distracting errors:
jQuery = jQuery;

// ----------------------------------------------------------------
// Workspace layout and sizing
// ----------------------------------------------------------------

/**
 * Resize main shuffl spaces to fit current window
 */    
shuffl.resize = function()
{
    log.debug("Resize workspace");
    // Adjust height of layout area
    var layout  = jQuery("#layout");
    var sheight = jQuery("#stockbar").outerHeight();
    var fheight = jQuery("#footer").outerHeight();
    var vmargin = parseInt(layout.css('margin-bottom'), 10);
    layout.height(layout.parent().innerHeight() - sheight - vmargin*7 - fheight);
};

// ----------------------------------------------------------------
// Workspace menu command handlers
// ----------------------------------------------------------------

/**
 * Load workspace completion handler that resets the workspace when an error 
 * is returned
 */
shuffl.resetWorkspaceOnError = function (val)
{
    if (val instanceof Error)
    {
        shuffl.resetWorkspace(function () { shuffl.showError(val); });
    }
};

/**
 * Display message when an error is returned
 */
shuffl.showMessageOnError = function (val)
{
    if (val instanceof Error)
    {
        shuffl.showError(val);
    }
    else
    {
        shuffl.showLocation(jQuery('#workspace').data('location').toString());
    }
};

/**
 * Save current workspace values as defaults in subsequent dialogs
 */
shuffl.saveWorkspaceDefaults = function ()
{
    log.debug("shuffl.saveWorkspaceDefaults");
    var ws     = jQuery('#workspace');
    var wsdata = ws.data('wsdata');
    if (wsdata)
    {
        log.debug("- wsuri "+wsdata['shuffl:wsuri']);
        ws.data('default_wsuri',   wsdata['shuffl:wsuri']);
    }
    else
    {
        shuffl.showError("No default workspace established");
    }
};

/**
 * Helper function for file open dialog
 */
shuffl.openFileDialog = function(title, uri, closelabel, callback)
{
    log.debug("shuffl.openFileDialog "+title+", "+uri);

    // Callback on hiding modal box: remove file selector and clean up
    var closeBox = function(obj)
    {
        obj.w.hide();
        select.modelUnbind("shuffl:closeUri");
        select = null;
        obj.w.children().remove();
        obj.o.remove();
    };

    // Configure modal box, and display
    jQuery("#modal_box")
      .jqm({modal: false, onHide: closeBox, trigger: false})
      .jqmShow();

    // Create file brose-and-select card in modal box
    var select = shuffl.createAndPlaceCard(
        "workspace_open", "shuffl-selectfile", 
        { 'shuffl:title':   title
        , 'shuffl:fileuri': uri
        , 'shuffl:close':   closelabel
        , 'shuffl:cancel':  "Cancel"
        },
        jQuery("#modal_box"), 3000, {left:"4em", top:"4em"}, {width:400, height:320}
        );

    // On clicking close button, load new workspace from specified URI,
    // and hide modal box
    select.modelBind("shuffl:closeUri", function(_event, val)
        {
            if (val.newval) { callback(val.newval.toString()) };
            jQuery("#modal_box").jqmHide();           
        });
};

/**
 * Menu command "Open workspace..."
 */
shuffl.menuOpenWorkspace = function ()
{
    // Use current location as default base
    log.debug("shuffl.menuLoadWorkspace");
    var wsuri  = jQuery('#workspace').data('default_wsuri');
    var wsdata = jQuery('#workspace').data('wsdata');
    if (wsdata)
    {
        wsuri  = jQuery('#workspace').data('location');
    };
    shuffl.openFileDialog("Open workspace", wsuri, "Open",
        function (newuri)
        {
            shuffl.resetWorkspace(function()
            {
                shuffl.loadWorkspace(newuri, shuffl.resetWorkspaceOnError);                    
            });
        });
};

/**
 * Menu command "Save workspace"
 */
shuffl.menuSaveWorkspace = function ()
{
    log.debug("shuffl.menuSaveWorkspace");
    shuffl.updateWorkspace(shuffl.showMessageOnError);
};

/**
 * Menu command "Save as new workspace..."
 */
shuffl.menuSaveNewWorkspace = function ()
{
    // Use current location (atomuri/feeduri) as default base
    log.debug("shuffl.menuSaveNewWorkspace");
    var wsuri  = jQuery('#workspace').data('location');
    var wsdata = jQuery('#workspace').data('wsdata');
    shuffl.openFileDialog("Save new workspace", wsuri, "Save",
        function (newuri)
        {
            var coluri   = jQuery.uri("../", newuri);
            var wscoluri = jQuery.uri("./", newuri);
            var wsname   = jQuery.uri.relative(wscoluri, coluri).toString().slice(0,-1);
            log.debug("- Save new: newuri "+newuri+", coluri "+coluri+", wsname "+wsname);
            if (shuffl.invalidWorkspaceName(coluri, wsname, shuffl.showMessageOnError)) return;
            shuffl.deleteWorkspace(newuri, function(val,next)
            {
                shuffl.saveNewWorkspace(coluri, wsname, 
                    shuffl.showMessageOnError);
            });
        });
};

// ----------------------------------------------------------------
// Menu and dialogs HTML templates
// ----------------------------------------------------------------

shuffl.MainMenuHTML =
    "<div class='contextMenu' id='workspacemenuoptions'  style='display:none;'>\n"+
    "  <ul>\n"+
    "    <li id='open'><img src='folder.png' />Open workspace...</li>\n"+
    "    <li id='save'><img src='folder.png' />Save workspace</li>\n"+
    "    <li id='savenew'><img src='folder.png' />Save as new workspace...</li>\n"+
    "  </ul>\n"+
    "</div>\n";

shuffl.ModalBoxHTML =
    "<div id='modal_box' style='display:none; position:absolute; left:0; top:0;' >\n"+
    "</div>\n";

shuffl.OpenDialogHTML =
    "<div id='dialog_open' title='Open workspace' style='display:none;'>\n"+
    "  <p>Enter the URI of an Atom Publishing Protocol service, AtomPub feed path and workspace name where the workspace is to be loaded from.</p>\n"+
    "  <form>\n"+
    "    <fieldset>\n"+
    "      <legend>Location of workspace data</legend>\n"+
    "      <label for='open_atomuri'>Workspace URI:</label>\n"+
    "      <input type='text' name='wsuri' id='open_wsuri' class='text ui-widget-content ui-corner-all' size='80'/>\n"+
    "    </fieldset>\n"+
    "  </form>\n"+
    "</div>\n";

shuffl.SaveNewDialogHTML =
    "<div id='dialog_save' title='Save as new workspace' style='display:none;'>\n"+
    "  <p>Enter the URI of an Atom Publishing Protocol service, AtomPub feed path and workspace name where the new workspace is to be saved.</p>\n"+
    "  <form>\n"+
    "    <fieldset>\n"+
    "      <legend>Location for saved workspace</legend>\n"+
    "      <label for='save_atomuri'>Workspace URI:</label>\n"+
    "      <input type='text' name='wsuri' id='save_wsuri' class='text ui-widget-content ui-corner-all' size='80'/>\n"+
    "    </fieldset>\n"+
    "  </form>\n"+
    "</div>\n";

// ----------------------------------------------------------------
// Start-up logic
// ----------------------------------------------------------------

jQuery(document).ready(function()
{
    log.info("shuffl starting");

    // Add menus and dialogs to the workspace
    jQuery("body").append(shuffl.MainMenuHTML);
    jQuery("body").append(shuffl.ModalBoxHTML);
    jQuery("body").append(shuffl.OpenDialogHTML);
    jQuery("body").append(shuffl.SaveNewDialogHTML);

    // Attach card-creation functions to stockpile cards
    log.debug("shuffl: attach card-creation functions to stockpile");
    jQuery("div.shuffl-stockpile").data( 'makeCard', shuffl.createCardFromStock);

    // Size workspace to fit within window (by default, it doesn't on Safari)
    log.debug("shuffl: attach window resize handler)");
    jQuery(window).resize( shuffl.resize );
    shuffl.resize();

    // Connect up drag and drop for creating and moving cards
    // Only cards predefined in the original HTML are hooked up here
    log.debug("shuffl: connect drag-and-drop logic");
    jQuery("div.shuffl-stockpile").draggable(shuffl.stockDraggable);
    jQuery("div.shuffl-card").draggable(shuffl.cardDraggable);
    jQuery("div.shuffl-card").click( function () { shuffl.toFront(jQuery(this)) } );
    jQuery("#layout").droppable({
        accept: "div.shuffl-stockpile",
        drop: 
            function(event, ui) {
                /*
                 * ui.draggable - current draggable element, a jQuery object.
                 * ui.helper - current draggable helper, a jQuery object
                 * ui.position - current position of the draggable helper { top: , left: }
                 * ui.offset - current absolute position of the draggable helper { top: , left: }
                 */
                log.debug("shuffl: drop "+ui.draggable);
                shuffl.dropCard(ui.draggable, jQuery(this), ui.offset);
            }
        });
    
    // TODO: connect up logic for saving changes on-the-fly to backend store
    log.debug("shuffl TODO: connect content save logic");

    // Initialize menu defaults
    jQuery("#workspace").data('default_wsuri', "");

    // Create a pop-up workspace menu
    log.debug("shuffl: connect connect workspace menu");
    jQuery('div.shuffl-workspacemenu').contextMenu('workspacemenuoptions', {
        menuStyle: {
            'class': 'shuffl-contextmenu',
            'font-weight': 'bold',
            'background-color': '#DDDDDD',
            'border': 'thin #666666 solid'
            },
        showOnClick: true,
        bindings: {
            'open': function(t) {
                    log.debug('Menu trigger '+t.id+'\nAction is shuffl.menuOpenWorkspace');
                    shuffl.menuOpenWorkspace();
                },
            'save': function(t) {
                    log.debug('Menu trigger '+t.id+'\nAction is shuffl.menuSaveWorkspace');
                    shuffl.menuSaveWorkspace();
                },
            'savenew': function(t) {
                    log.debug('Menu trigger '+t.id+'\nAction is shuffl.menuSaveNewWorkspace');
                    shuffl.menuSaveNewWorkspace();
                }
          }
      });

    // Initialization is done - now it's all event-driven
    log.info("shuffl initialization done");
});

// End.
