/**
 * @fileoverview
 *  Shuffl storage access framework.  This module defines storage session 
 *  discovery and factory methods, and also defines a default storage object 
 *  that performs read-only access to the local file system.
 * 
 *  Each storage handler is associated with a hierarchical-form URI.  All URIs
 *  that fall hierachically under that URI must be accessed using the 
 *  corresponding storage handler.
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

// TODO: Refactor so that storage implemetations can just use base class for unimplemented methods
// TODO: implement variant of create, put with type parameter

// ------------------------------------------------
// Global data
// ------------------------------------------------
 
/**
 * Check for shuffl and shuffl.stoage namespaces
 */
if (typeof shuffl == "undefined") 
{
    alert("shuffl-storage-common.js: shuffl-base.js must be loaded first");
};
if (typeof shuffl.storage == "undefined") 
{
    shuffl.storage = {};
};

/**
 * Storage handler registry
 * 
 * This is a list of storage handler options, each in the same form as passed
 * to shuffl.addStorageHandler.
 */
shuffl.storage.handlers = [];

// ------------------------------------------------
// Storage handler discovery and session factory
// ------------------------------------------------

/**
 * Reset storage handler registry.  This function is provided primarily for
 * testing, so that the test environment registry starts in a known state.
 */
shuffl.resetStorageHandlers = function ()
{
    shuffl.storage.handlers = [];
};

/**
 * Add a new storage handler to the registry of storage handlers
 * 
 * @param options   is an object containing details of the new handler.
 * 
 * Fields of the new handler options are:
 *   uri:       a base URI to be associated with this handler.  
 *              When performing I/O operations, URIs are examined to select
 *              a corresponding handler based on the leading part of the URI
 *              matching the base URI of the handler.
 *   name:      a textual name associated with this handler (used mainly 
 *              for diagnostic purposes).
 *   factory:   a storage handler "class" (actually the constructor function)
 *              used to create an instance of the handler.
 */
shuffl.addStorageHandler = function(options)
{
    log.debug("shuffl.addStorageHandler");
    log.debug("- options "+shuffl.objectString(options));
    shuffl.storage.handlers.push(
        { uri:      options.uri.toString()
        , name:     options.name
        , factory:  options.factory
        });
};

/**
 * List storage handler URIs, and the associated capabilities.
 * 
 * @return          a list of entries, where each entry is an object with the
 *                  fields described below.
 * 
 * Storage handler description fields:
 *    uri       root URI serviced by the storage handler
 *    name      name associated with handler (diagnostic)
 *    canList   'true' if the handler can list data resource collections 
 *              identified by the associated URIs
 *    canRead   'true' if the handler can read data resources identified by 
 *              the associated URIs
 *    canWrite  'true' if the handler can write data resources identified by 
 *              the associated URIs
 *    canDelete 'true' if the handler can delete data resources identified by 
 *              the associated URIs
 */
shuffl.listStorageHandlers = function ()
{
    ////log.debug("shuffl.listStorageHandlers");
    var silist = [];
    for (var i = 0 ; i < shuffl.storage.handlers.length ; i++)
    {
        var sh = shuffl.storage.handlers[i];
        var si = jQuery.extend({},
            sh.factory.prototype.capInfo,
            { uri:        sh.uri
            , name:       sh.name
            });
        silist.push(si);
    };
    return silist;
};

/**
 * Create a storage handler session, and return an object for performing
 * operations in that session.
 * 
 * @param baseuri   a base URI for the new session.  Relative URI references
 *                  are considered to be relative to this value.
 * @return          a new storage session object is returned, or null if no 
 *                  handler is available to service the specified URI.
 */
shuffl.makeStorageSession = function (baseuri)
{
    log.debug("shuffl.makeStorageSession "+baseuri);
    baseuri = jQuery.uri(baseuri).toString();
    for (var i = 0 ; i < shuffl.storage.handlers.length ; i++)
    {
        if (shuffl.starts(shuffl.storage.handlers[i].uri, baseuri))
        {
            log.debug("- handler uri: "+shuffl.storage.handlers[i].uri);
            return new shuffl.storage.handlers[i].factory(
                baseuri,
                shuffl.storage.handlers[i].uri,
                shuffl.storage.handlers[i].name);
        };
    };
    return null;
};

// ------------------------------------------------
// Common storage session handler base class
// ------------------------------------------------

/**
 * Create a storage session object
 * 
 * @constructor
 * @param baseuri   a base URI for the new session.  Relative URI references
 *                  are considered to be relative to this value.
 * @param rooturi   a root URI for the  session.  URIs that do not start with
 *                  this string cannot be used with this session.
 * @param hname     a handler name to be associated with this handler instance
 */
shuffl.StorageCommon = function (baseuri, rooturi, hname)
{
    ////log.debug("shuffl.StorageCommon "+rooturi+", "+baseuri+", "+hname);
    this.className    = "shuffl.StorageCommon";
    this.baseUri      = baseuri;
    this.rootUri      = rooturi;
    this.handlerName  = hname;
};

shuffl.StorageCommon.capInfo =
    { canList:    false
    , canRead:    false
    , canWrite:   false
    , canDelete:  false
    } ;

/**
 * Retrieve a name for the current storage handler
 * 
 * @return          an name associated with the storage handler for the
 *                  current session.  This function is mainly for diagnostic
 *                  and testing purposes.
 */
shuffl.StorageCommon.prototype.getHandlerName = function ()
{
    return this.handlerName;
};

/**
 * Retrieve a root URI for the current session handler
 * 
 * @return          an root URI associated with the current session handler.
 */
shuffl.StorageCommon.prototype.getRootUri = function ()
{
    return this.rootUri;
};

/**
 * Retrieve a base URI for the current session
 * 
 * @return          a base URI associated with the current session.
 */
shuffl.StorageCommon.prototype.getBaseUri = function ()
{
    return this.baseUri;
};

/**
 * Resolve a URI handled by the current storage handler session.
 * 
 * @param uri       a URI to be resolved.  This may be a relative URI reference,
 *                  in which case it is interpreted relative to the supplied
 *                  base URI or the base URI for the current session.
 * @param baseuri   if present, a base URI against which the supplied URI is
 *                  resolved.  If relative, this URI is resolved against the
 *                  session base URI.  Typically, this would be used for
 *                  resolving a resource URI relative to a collection.
 * @return          an object containing information about the supplied URI,
 *                  or null if the URI is not handled by the current session.
 * 
 * Fields in the return value include:
 *    uri       the fully qualified URI as a jQuery.uri object.
 *    relref    the URI expressed as relative to the session base URI.
 *    (others may be added as required)
 */
shuffl.StorageCommon.prototype.resolve = function (uri, baseuri)
{
    ////log.debug("shuffl.StorageCommon.prototype.resolve "+uri+", "+baseuri);
    if (!baseuri) baseuri = "";
    var info = {uri:null};
    var baseuri = jQuery.uri(baseuri, this.baseUri);
    var u = jQuery.uri(uri, baseuri);
    if (shuffl.starts(this.rootUri, u.toString()))
    {
        info.uri    = u.toString();
        info.relref = jQuery.uri.relative(u, baseuri);
    };
    return info;
};

/**
 * Return information about the capabilities of the storage handler.
 * 
 * @return is an Error value, or an object with the following fields:
 *    canList   'true' if storage collections can be listed
 *    canRead   'true' if storage resources can be read
 *    canWrite  'true' if storage resource can be modified
 *    canDelete 'true' if storage resource can be deleted
 */
shuffl.StorageCommon.prototype.handlerInfo = function ()
{
    ////log.debug("shuffl.StorageCommon.prototype.handlerInfo "+uri);
    return this.capInfo;
};

/**
 * Return information about the resource associated with the supplied URI.
 * 
 * @param uri       a resource URI reference
 * @param callback  is a function called when the outcome of the request is
 *                  known.
 * 
 * The callback function is called as:
 *    callback(response) {
 *        // this = session object
 *    };
 * 
 * where 'response' is an Error value, or an object with the following fields:
 *    uri       the fully qualified URI as a jQuery.uri object.
 *    relref    the URI expressed as relative to the session base URI.
 *    type      'collection' or 'item'
 *    canList   'true' if collection can be listed
 *    canRead   'true' if resource can be read
 *    canWrite  'true' is resource can be modified
 *    canDelete 'true' is resource can be deleted
 */
shuffl.StorageCommon.prototype.info = function (uri)
{
    ////log.debug("shuffl.StorageCommon.prototype.info "+uri);
    throw new shuffl.Error("shuffl.StorageCommon.prototype.info not implemented");
};

/**
 * Create a new collection resource.
 * 
 * @param coluri    is the URI reference of an existing collection within 
 *                  which the new collection is created.  The base URI of
 *                  a session can be used as a 'root' collection for this
 * @param colslug   is a suggested URI for the new collection, if a new
 *                  collection is successfully created, the actual URI used is
 *                  returned in the callback response.
 * @param callback  is a function called when the outcome of the request is
 *                  known.
 * 
 * The callback function is called as:
 *    callback(response) {
 *        // this = session object
 *    };
 * where 'response' is an Error value, or an object with the following fields:
 *    uri       the fully qualified URI of the created collection as a 
 *              jQuery.uri object.
 *    relref    the URI expressed as relative to the session base URI.
 */
shuffl.StorageCommon.prototype.createCollection = function (coluri, colslug, callback)
{
    ////log.debug("shuffl.StorageCommon.prototype.createCollection "+coluri+", "+colslug);
    throw new shuffl.Error("shuffl.StorageCommon.prototype.createCollection not implemented");
};

/**
 * List entries in a collection.
 * 
 * @param coluri    is the URI reference of a collection to be listed. 
 *                  The base URI of a session can be used as a 'root' 
 *                  collection for enumerating all the collections accessible
 *                  by a session handler.
 * @param callback  is a function called when the outcome of the request is
 *                  known.
 * 
 * The callback function is called as:
 *    callback(response) {
 *        // this = session object
 *    };
 * where 'response' is an Error value, or a list of objects with the following 
 * fields:
 *    uri       the fully qualified URI of a resource within the collection,
 *              returned as a jQuery.uri object.
 *    relref    the URI expressed as relative to the session base URI.
 *    type      'collection' or 'item'
 */
shuffl.StorageCommon.prototype.listCollection = function (coluri, callback)
{
    ////log.debug("shuffl.StorageCommon.prototype.listCollection "+coluri);
    throw new shuffl.Error("shuffl.StorageCommon.prototype.listCollection not implemented");
};

/**
 * Delete a collection.
 * 
 * @param coluri    is the URI reference of a collection to be listed. 
 *                  The base URI of a session can be used as a 'root' 
 *                  collection for enumerating all the collections accessible
 *                  by a session handler.
 * @param callback  is a function called when the outcome of the request is
 *                  known.
 * 
 * The callback function is called as:
 *    callback(response) {
 *        // this = session object
 *    };
 * where 'response' is an Error value, or null if the named collection has
 * been successfully deleted.
 */
shuffl.StorageCommon.prototype.removeCollection = function (coluri, callback)
{
    ////log.debug("shuffl.StorageCommon.prototype.removeCollection "+coluri);
    throw new shuffl.Error("shuffl.StorageCommon.prototype.removeCollection not implemented");
};

/**
 * Create a data resource in a collection.
 * 
 * @param coluri    is the URI reference of an existing collection within 
 *                  which the new resourcve is created.  The base URI of
 *                  a session can be used as a 'root' collection for this.
 * @param slug      is a suggested URI for the new resource.  If a new
 *                  resource is successfully created, the actual URI used is
 *                  returned in the callback response.
 * @param data      is a string or object containing data that is written to
 *                  the created resource.  If a string, it is written verbatim
 *                  as a byte sequence.  If an object, it is converted to a
 *                  suitable representation (JSON) and written.
 * @param callback  is a function called when the outcome of the request is
 *                  known.
 * 
 * The callback function is called as:
 *    callback(response) {
 *        // this = session object
 *    };
 * where 'response' is an Error value, or an object with the following fields:
 *    uri       the fully qualified URI of the created resource as a 
 *              jQuery.uri object.
 *    relref    the URI expressed as relative to the session base URI.
 */
shuffl.StorageCommon.prototype.create = 
    function (coluri, slug, data, callback)
{
    ////log.debug("shuffl.StorageCommon.prototype.create "+coluri+", "+slug);
    throw new shuffl.Error("shuffl.StorageCommon.prototype.create not implemented");
};

/**
 * Read resource data of a given type.
 * 
 * @param uri       the URI of a resource to be read.
 * @param type      type of result expected: "xml", "json", or "text"
 * @param callback  is a function called when the outcome of the request is
 *                  known.
 * 
 * The callback function is called as:
 *    callback(response) {
 *        // this = session object
 *    };
 * where 'response' is an Error value, or an object with the following fields:
 *    uri       the fully qualified URI of the created resource as a 
 *              jQuery.uri object.
 *    relref    the URI expressed as relative to the session base URI.
 *    data      the data read, either as an object value if the type of the
 *              data resource could be decoded, otherwise as a string value. 
 */
shuffl.StorageCommon.prototype.getData = function (uri, type, callback)
{
    ////log.debug(this.className+".getData "+uri+", "+type);
    info = this.resolve(uri);
    ////log.debug(this.className+".getData "+jQuery.toJSON(info));
    if (info.uri == null)
    {
        var e = new shuffl.Error(this.className+".getData can't handle uri "+uri);
        log.error(e.toString());
        log.debug("baseuri: "+this.getBaseUri());
        log.debug("rooturi: "+this.getRootUri());
        callback(e);
        return;
    };
    shuffl.ajax.get(info.uri, type, function (val) {
        if (!(val instanceof shuffl.Error))
        {
            val =
                { uri:        info.uri
                , relref:     info.relref
                , data:       val
                };
        };
        callback(val);
    });
};

/**
 * Read resource data.
 * 
 * @param uri       the URI of a resource to be read.
 * @param callback  is a function called when the outcome of the request is
 *                  known.
 * 
 * The callback function is called as:
 *    callback(response) {
 *        // this = session object
 *    };
 * where 'response' is an Error value, or an object with the following fields:
 *    uri       the fully qualified URI of the created resource as a 
 *              jQuery.uri object.
 *    relref    the URI expressed as relative to the session base URI.
 *    data      the data read, either as an object value if the type of the
 *              data resource could be decoded, otherwise as a string value. 
 */
shuffl.StorageCommon.prototype.get = function (uri, callback)
{
    ////log.debug("shuffl.StorageCommon.prototype.get "+uri);
    throw new shuffl.Error("shuffl.StorageCommon.prototype.get not implemented");
};

/**
 * Update resource data.
 * 
 * @param uri       the URI of a resource to be updated.
 * @param data      is a string or object containing data that is written to
 *                  the created resource.  If a string, it is written verbatim
 *                  as a byte sequence.  If an object, it is converted to a
 *                  suitable representation (JSON) and written.
 * @param callback  is a function called when the outcome of the request is
 *                  known.
 * 
 * The callback function is called as:
 *    callback(response) {
 *        // this = session object
 *    };
 * where 'response' is an Error value, or an object with the following fields:
 *    uri       the fully qualified URI of the updated resource as a 
 *              jQuery.uri object.
 *    relref    the URI expressed as relative to the session base URI.
 */
 // TODO: add function with type parameter?
shuffl.StorageCommon.prototype.put = function (uri, data, callback)
{
    ////log.debug("shuffl.StorageCommon.prototype.put "+uri);
    throw new shuffl.Error("shuffl.StorageCommon.prototype.put not implemented");
};

/**
 * Delete a resource.
 * 
 * @param uri       the URI of a resource to be deleted.
 * @param callback  is a function called when the outcome of the request is
 *                  known.
 * 
 * The callback function is called as:
 *    callback(response) {
 *        // this = session object
 *    };
 * where 'response' is an Error value, or null if the named item has
 * been successfully deleted.
 */
shuffl.StorageCommon.prototype.remove = function (uri, callback)
{
    ////log.debug("shuffl.StorageCommon.prototype.remove "+uri);
    throw new shuffl.Error("shuffl.StorageCommon.prototype.remove not implemented");
};

// ------------------------------------------------
// Helper functions
// ------------------------------------------------

/**
 * Helper function to return a function that can be used as a callback to 
 * resolve the URI returned (typically by a create function) and call the
 * indicated callback with the result thus obtained.
 */
shuffl.StorageCommon.resolveReturnedUri = function (self, callback)
{
    function resolveReturnedUri (val)
    {
        if (!(val instanceof shuffl.Error))
        {
            val = self.resolve(val.uri);
        };
        callback(val);
    }
    return resolveReturnedUri;
};

/**
 * Helper function to return a function that can be used as a callback to 
 * resolve the returned value as an error or null (typically by a delete 
 * function) and call the indicated callback with the result thus obtained.
 */
shuffl.StorageCommon.resolveNullOrError = function (callback)
{
    function resolveReturnedUri (val)
    {
        if (!(val instanceof shuffl.Error))
        {
            val = null;
        };
        callback(val);
    }
    return resolveReturnedUri;
};

/**
 * Helper function to return a function for handling a success response from
 * jQuery.ajax, returning a structure containing the fully qualified and 
 * relative URI reference (per shuffl.StorageCommon.resolve).
 */
shuffl.StorageCommon.resolveUriOnSuccess = function (self, uri, callback)
{
    function resolveUri (data, statusText, XHR)
    {
        ////log.debug("shuffl.StorageCommon.resolveUriOnSuccess "+uri);
        callback(self.resolve(uri));
    }
    return resolveUri
}

// End.
