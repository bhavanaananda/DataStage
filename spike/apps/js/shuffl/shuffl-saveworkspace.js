/**
 * @fileoverview
 *  Shuffl code to save workspace and card data to an AtomPub service.
 *  
 * @author Graham Klyne
 * @version $Id: shuffl-saveworkspace.js 837 2010-06-16 16:57:18Z gk-google@ninebynine.org $
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
// Helper functions
// ----------------------------------------------------------------

/**
 * Test for an invalid collection URI or workspace name. The collection URI
 * must contain a non-relative path ending in '/'.  The workspace name and
 * path segments may consist of letters, digits, '.', '+' or '-' characters.
 * 
 * @param wscol     is a string containing a workspace collection URI
 * @param wsname    is a string containing a proposed workspace name
 * @param callback  is a callback function that is invoked with an error value
 *                  if the feed path is not valid
 * @return          'true' if the feed path is invalied, in which case the 
 *                  callback has been invoked and the calling function MUST NOT
 *                  invoke it again;  otherwise 'false', in which the calling 
 *                  function should continue.
 */
shuffl.invalidWorkspaceName = function (wscol, wsname, callback)
{
    wscol = wscol.toString();
    ////log.debug("shuffl.invalidWorkspaceName: "+wsuri+", "+wsname);
    //                 [scheme.:] [//auth..........]  /(path......../)*
    if (!wscol.match(/^([\w-+]+:)?(\/\/(\w|[-+.:])+)?\/((\w|[-+.])+\/)*$/))
    {
        log.error("shuffl.saveNewWorkspace: invalid feed path: "+wscol);
        callback(new shuffl.Error("shuffl.saveNewWorkspace: invalid collection URI: "+wscol));
        return true;
    };
    if (!wsname.match(/^(\w|[-+.])+$/))
    {
        log.error("shuffl.saveNewWorkspace: invalid workspace name: "+wsname);
        callback(new shuffl.Error("shuffl.saveNewWorkspace: invalid workspace name: "+wsname));
        return true;
    };
    return false;
}

// ----------------------------------------------------------------
// Delete card
// ----------------------------------------------------------------

/**
 * Delete card at indicated location
 * 
 * @param carduri   is the uri of the card to be deleted, 
 *                  possibly relative to the feed.
 * @param callback  called when the operation is complete
 * 
 * The callback is invoked with an Error value, or null if the named 
 * card has been successfully deleted.
 */
shuffl.deleteCard = function(carduri, callback) 
{
    // Set up and issue the HTTP request to delete the card data
    log.debug("shuffl.deleteCard, carduri: "+carduri);
    // Delete card media resource
    var session = shuffl.makeStorageSession(carduri);
    if (shuffl.noStorageHandler(session, carduri, callback)) return;
    session.remove(carduri, callback);
};

// ----------------------------------------------------------------
// Update card
// ----------------------------------------------------------------

/**
 * Update card
 * 
 * @param session   is the storage session to be used to save the card
 * @param wscoluri  is the URI of the workspace collection with which the card
 *                  is saved.  This may be relative to the session base URI.
 * @param card      is the card jQuery object to be saved
 * @param callback  called when the operation is complete
 * 
 * The callback supplies an Error instance, or information about the updated
 * card, thus:
 *   carduri:   URI of the workspace description file
 *   cardref:   reference for the workspace description relative to the
 *              workspace collection URI.
 *   cardid:    local identifier string for the workstation, unique within
 *              the containing collection.
 */
shuffl.updateCard = function(session, wscoluri, card, callback) 
{
    wscoluri = jQuery.uri(wscoluri, session.getBaseUri());
    var cardid    = card.data('shuffl:id');
    var cardref   = card.data('shuffl:dataref');
    log.debug("shuffl.updateCard: "+cardid+", wscoluri: "+wscoluri+", cardref: "+cardref);
    var cardext = shuffl.createDataFromCard(card);
    ////log.debug("- cardext: "+shuffl.objectString(cardext));

    // Helper function extracts saved location from posted item response and 
    // returns it via callback
    var putComplete = function(data) {
        if (data instanceof shuffl.Error) { 
            callback(data); 
        } else {
            //log.debug("shuffl.updateCard:putComplete "+shuffl.objectString(data));
            callback({carduri: data.uri, cardref: data.relref, cardid: cardid});
        };
    };

    var carduri = jQuery.uri(cardref, wscoluri);
    session.put(carduri, cardext, putComplete);
};

// ----------------------------------------------------------------
// Save card
// ----------------------------------------------------------------

/**
 * Save card to indicated location
 * 
 * @param session   is a storage session object used for writing the
 *                  workspace data.
 * @param wscoluri  is the URI of the workspace collection with which the card
 *                  is saved.  This may be relative to the session base URI.
 * @param cardref   is a suggested name for the dard data to be located 
 *                  within the workspace collection.
 * @param card      is the card jQuery object to be saved
 * @param callback  called when the operation is complete
 * 
 * The callback is invoked with an Error value, or the URI of the location
 * where the card data is saved, possibly expressed relative to the workspace 
 * collection URI.
 */
shuffl.saveCard = function(session, wscoluri, cardref, card, callback) 
{
    // Helper function extracts saved location from posted item response and 
    // returns it via callback
    wscoluri = jQuery.uri(wscoluri, session.getBaseUri());
    var createComplete = function (data) 
    {
        if (data instanceof shuffl.Error) 
        {
            shuffl.showError(data.toString());
            callback(data); 
        } else {
            ////log.debug("shuffl.saveCard:createComplete "+shuffl.objectString(data));
            callback(data.relref);
        };
    };
    // Set up and issue the HTTP request to save the card data
    var cardid    = card.data('shuffl:id');
    log.debug("shuffl.saveCard: "+cardid+", cardref: "+cardref);
    // Build the card external object
    var cardext  = shuffl.createDataFromCard(card);
    session.create(wscoluri, cardref, cardext, createComplete);
};

/**
 * Save card to indicated location if the location is relative 
 * (i.e. card is copied along with workspace), 
 * otherwise absolute card location is accessed by reference.
 */
shuffl.saveRelativeCard = function(session, wscoluri, card, callback) 
{
    var cardid    = card.data('shuffl:id');
    var cardref   = card.data('shuffl:dataref');
    ////log.debug("shuffl.saveRelativeCard: "+cardid+", wscoluri: "+wscoluri+", cardref: "+cardref);
    if (shuffl.isRelativeUri(cardref)) {
        shuffl.saveCard(session, wscoluri, cardref, card, callback);
    } else {
        callback(null);
    }
};

// ----------------------------------------------------------------
// Assemble workspace description
// ----------------------------------------------------------------

/**
 * Scan the current workspace and assemble a description that can be written to 
 * persistent storage.  The description is returned as a JSON structure which
 * will be serialized as required when written.
 * 
 * @param session   is a storage session object used for writing the workspace
 *                  data.
 * @param wscoluri  is the URI of the collection to which the current workspace
 *                  cards are being written
 * @return          a Javascript object containing a description of the current
 *                  workspace, ready to be serialized and written out.
 */
shuffl.assembleWorkspaceDescription = function (session, wscoluri) 
{
    ////log.debug("Assemble workspace description "+wscoluri);
    // Assemble card layout info
    var layout   = [];
    jQuery("div.shuffl-card").each(
        function (i) {
            var card = jQuery(this);
            var size = {width:card.width(), height:card.height()} ;
            var cardlayout =
                { 'id':     card.data('shuffl:id')
                , 'class':  card.data('shuffl:type' )
                , 'data':   card.data('shuffl:dataref')
                , 'pos':    card.position()
                , 'size':   size
                , 'zindex': parseInt(card.css('zIndex'), 10)
                };
            layout.push(cardlayout);
        });
    // Assemble and save workspace description
    var wsload = jQuery('#workspace').data('wsdata');
    var ws = 
        { 'shuffl:id':            wsload['shuffl:id']
        , 'shuffl:class':         'shuffl:Workspace'
        , 'shuffl:version':       '0.1'
        , 'shuffl:base-uri':      '#'
        , 'shuffl:uses-prefixes': wsload['shuffl:uses-prefixes']
        , 'shuffl:workspace':
          { 'shuffl:stockbar':      wsload['shuffl:workspace']['shuffl:stockbar']
          , 'shuffl:layout':        layout
          }
        };
    //log.debug("Workspace description: "+jQuery.toJSON(ws));
    return ws;
};

// ----------------------------------------------------------------
// Process cards in workspace with asynchronous function
// ----------------------------------------------------------------

/**
 * Perform some asynchronous-completing operation on each card in the workspace,
 * then call a supplied function when all are done.
 * 
 * @param firstval  a parameter value passed to the first function in the
 *                  constructed callback chain.
 * @param firstcall a function called with the supplied parameter and a 
 *                  callback function before processing the card data.
 * @param proccard  a function called with a jQuery card object and callback 
 *                  function for each card in the workspace.
 * @param thencall  a function called with the result from the last card-
 *                  processing function called when all cards have been 
 *                  processed.
 */
shuffl.processWorkspaceCards = function(firstval, firstcall, proccard, thencall) 
{
        ////log.debug("shuffl.processWorkspaceCards");
        var m = new shuffl.AsyncComputation();
        m.eval(firstcall);
        jQuery("div.shuffl-card").each(
            function (i) {
                var card = jQuery(this);
                ////log.debug("- card "+i+", id "+card.id);
                // TODO: catch errors and pass along chain?
                m.eval(function (val, next) { proccard(card, next); });
            });
        m.exec(firstval, thencall);
    };

/**
 * Helper function for processing return value when a new card is created, 
 * to save the card details into the jQuery card object.
 * 
 * @param card      is the jQuery card object to be updated
 * @param next      callback function to invoke when the results from card 
 *                  creation have been saved.
 * @return          a function that is used as a callback with shuffl.saveCard
 *                  or shuffl.saveRelativeCard.
 */
shuffl.storeNewCardDetails = function (card, next) 
{
    var saveDetails = function(ret) {
        // Update card location with result from shuffl.saveCard
        // See: http://code.google.com/p/shuffl/wiki/CardReadWriteOptions
        //log.debug("shuffl.storeNewCardDetails: "+ret);
        card.data('shuffl:dataref', shuffl.uriName(ret));
        card.data('shuffl:datauri', ret);
        card.data('shuffl:dataRW',  true);
        card.data('shuffl:datamod', false);
        next(card);
    };
    return saveDetails;
};

// ----------------------------------------------------------------
// Save workspace
// ----------------------------------------------------------------

/**
 * Save current data as new workspace.  Cards referenced by relative URIs are
 * saved as part of the new workspace.  Cards referenced using absolute URIs
 * are not saved, and are referenced at their current locations.
 * 
 * @param coluri      URI of storage collection in which the new workspace will
 *                    be created.
 * @param wsname      is the name of a workspace collection to be created 
 *                    within the indicated parent collection.
 * @param callback    function called when the save is complete.
 * 
 * The callback supplies an Error instance, or information about the newly
 * saved workspace, thus:
 *   wscoluri:  URI of the workspace collection
 *   wsuri:     URI of the workspace description file
 *   wsref:     reference for the workspace description relative to the
 *              workspace collection URI.
 *   wsid:      local identifier string for the workstation, unique within
 *              the containing collection.
 */
shuffl.saveNewWorkspace = function (coluri, wsname, callback) 
{
    log.debug("shuffl.saveNewWorkspace: "+coluri+", "+wsname);
    if (shuffl.invalidWorkspaceName(coluri, wsname, callback)) return;
    var session  = shuffl.makeStorageSession(coluri);
    if (shuffl.noStorageHandler(session, coluri, callback)) return;
    var wscoluri = undefined;     // URI of workspace collection
    var wsdata   = undefined;     // Accumulates layout details

    // Create workspace collection and save URI of created collection
    var localCreateCollection = function (val, next)
    {
        session.createCollection(coluri, wsname, function (info) 
        {
            if (!(info instanceof shuffl.Error)) 
            { 
                wscoluri = info.uri;
            };
            next(val);
        });
    }

    // Helper function to save card then invoke the next step
    var localSaveCard = function(card, next) 
    {
        //log.debug("shuffl.saveNewWorkspace:saveCard: "+card.id);
        shuffl.saveRelativeCard(session, wscoluri, card, 
            shuffl.storeNewCardDetails(card, next));
    };

    // Save all cards in the workspace
    var saveWorkspaceCards = function(thencall) 
    {
        shuffl.processWorkspaceCards(
            null,
            localCreateCollection,
            localSaveCard, 
            thencall);
    };

    // Create workspace descriotion callback: 
    // store details and assemble final return value
    var createComplete = function(val) 
    {
        ////log.debug("shuffl.saveNewWorkspace, done.");
        if (val instanceof shuffl.Error) 
        {
            shuffl.showError(val.toString());
            callback(val); 
        } 
        else 
        {
            ////log.debug("shuffl.saveNewWorkspace:createComplete "+shuffl.objectString(val));
            shuffl.showLocation(val.uri.toString());
            jQuery('#workspace').data('location', val.uri);
            jQuery('#workspace').data('wsname',   wsname);
            jQuery('#workspace').data('wsdata',   wsdata);
            var ret = 
                { wscoluri: wscoluri
                , wsuri:    val.uri
                , wsref:    jQuery.uri.relative(val.uri, wscoluri)
                , wsid:     wsname
                };
            callback(ret);
        };
    };

    // Save layout once all cards have been saved
    var saveWorkspaceDescription = function(val) 
    {
        wsdata = shuffl.assembleWorkspaceDescription(session, wscoluri);
        if (wsname == undefined || wsname == "") 
        {
            //ÊDefault name from workspace Id + ".json"
            wsname = wsdata['shuffl:id'];
        }
        session.create(wscoluri, wsname+".json", wsdata, createComplete);
    };

    // Initiate workspace save now
    saveWorkspaceCards(saveWorkspaceDescription);
    ////log.debug("shuffl.saveNewWorkspace, returning.");
};

// ----------------------------------------------------------------
// Update workspace
// ----------------------------------------------------------------

/**
 * Save current data as updated version of current workspace.
 * 
 * @param callback    function called when the update is complete.
 * 
 * The callback supplies an Error instance, or information about the 
 * updated workspace, thus:
 *   wscoluri:  URI of the workspace collection
 *   wsuri:     URI of the workspace description file
 *   wsref:     reference for the workspace description relative to the
 *              workspace collection URI.
 *   wsid:      local identifier string for the workstation, unique within
 *              the containing collection.
 */
shuffl.updateWorkspace = function (callback) {
    var wsdata   = jQuery('#workspace').data('wsdata');
    var wsuri    = jQuery('#workspace').data('location');
    var wscoluri = jQuery.uri(".", wsuri);
    log.debug("shuffl.updateWorkspace: "+wscoluri+", "+wsuri);
    var session  = shuffl.makeStorageSession(wscoluri);
    if (shuffl.noStorageHandler(session, wscoluri, callback)) return;

    // Helper function extracts return values following update
    var updateComplete = function(val) {
        if (val instanceof shuffl.Error) { 
            callback(val); 
        } else {
            //log.debug("shuffl.saveCard:updateComplete "+shuffl.objectString(val));
            var ret = 
                { wscoluri: wscoluri
                , wsuri:    val.uri
                , wsref:    val.relref
                , wsid:     val.relref.replace(/\.[^.]*$/, "")
                };
            callback(ret);
        };
    };

    // Helper function to update card then invoke the next step
    var localUpdateCard = function(card, next)
    {
        //log.debug("shuffl.updateWorkspace:localUpdateCard: "+card.id);
        if (card.data('shuffl:datauri') == null) 
        {
            shuffl.saveRelativeCard(session, wscoluri, card, 
                shuffl.storeNewCardDetails(card, next));
        } 
        else if (card.data('shuffl:datamod')) 
        {
            shuffl.updateCard(session, wscoluri, card, next);
        } 
        else 
        {
            next({});   // Nod modified: skip this card, invoke callback
        };
    };

    // Update all cards in workspace
    var updateWorkspaceCards = function(thencall) 
    {
        shuffl.processWorkspaceCards(
            null,
            function (val, next) { next(val); },
            localUpdateCard,
            thencall);
    };

    // Update layout once all cards have been saved
    var updateWorkspaceDescription = function(val) 
    {
        var wsdata = shuffl.assembleWorkspaceDescription(session, wscoluri);
        session.put(wsuri, wsdata, updateComplete);
    };

    // Initiate workspace update
    updateWorkspaceCards(updateWorkspaceDescription);
    ////log.debug("shuffl.updateWorkspace, returning.");
};

// ----------------------------------------------------------------
// Delete workspace
// ----------------------------------------------------------------

/**
 * Delete workspace.
 * 
 * @param wsuri       is a a workspace description URI
 * @param callback    function called when the update is complete.
 * 
 * The callback supplies a null value, or an Error instance
 */
shuffl.deleteWorkspace = function (wsuri, callback) {
    log.debug("shuffl.deleteWorkspace: "+wsuri);
    var wscoluri = jQuery.uri(".", wsuri);
    ////log.debug("shuffl.deleteWorkspace: "+wscoluri);
    var session  = shuffl.makeStorageSession(wscoluri);
    if (shuffl.noStorageHandler(session, wscoluri, callback)) return;
    session.removeCollection(wscoluri, callback);
};

// End.
