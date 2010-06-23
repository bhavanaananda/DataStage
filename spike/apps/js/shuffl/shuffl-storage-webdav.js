/**
 * @fileoverview
 *  Shuffl storage access framework.  This module defines storage session 
 *  class that performs read/write access to data accessed using a WebDAV 
 *  service.
 *  
 * @author Graham Klyne
 * @version $Id: shuffl-storage-webdav.js 671 2009-11-16 18:02:24Z gk-google@ninebynine.org $
 * 
 * Coypyright (C) 2010, University of Oxford
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

// ------------------------------------------------
// Global data
// ------------------------------------------------
 
/**
 * Check for shuffl and shuffl.stoage namespaces
 */
if (typeof shuffl == "undefined") 
{
    alert("shuffl-storage-webdav.js: shuffl-base.js must be loaded first");
};
if (typeof shuffl.storage == "undefined") 
{
    alert("shuffl-storage-webdav.js: shuffl-storage-common.js must be loaded before this");
};

// ------------------------------------------------
// WebDAV storage session handler
// ------------------------------------------------

/**
 * Create a local file storage session handler.
 * 
 * @constructor
 * @param baseuri   a base URI for the new session.  Relative URI references
 *                  are considered to be relative to this value.
 * @param rooturi   a root URI for the  session.  URIs that do not start with
 *                  this string cannot be used with this session.
 * @param hname     a handler name to be associated with this handler instance
 */
shuffl.WebDAVStorage = function (baseuri, rooturi, hname)
{
    // Invoke common initializer
    shuffl.WebDAVStorage.prototype.constructor.call(this, baseuri, rooturi, hname);
    this.className = "shuffl.WebDAVStorage";
};

shuffl.WebDAVStorage.canList    = true;
shuffl.WebDAVStorage.canRead    = true;
shuffl.WebDAVStorage.canWrite   = true;
shuffl.WebDAVStorage.canDelete  = true;

// Inherit from StorageCommon, and set default session handler name
shuffl.WebDAVStorage.prototype      = new shuffl.StorageCommon(null, null, null);
shuffl.WebDAVStorage.prototype.name = "WebDAVStorage";    

// Storage handler capability information
shuffl.WebDAVStorage.prototype.capInfo =
    { canList:    true
    , canRead:    true
    , canWrite:   true
    , canDelete:  true
    } ;

/**
 * Return information about the resource associated with the supplied URI.
 * 
 * @param uri       a resource URI reference
 * @param callback  is a function called when the outcome of the request is
 *                  known.
 * @return          an object containing information about the identified
 *                  resource, or null if no such resource is accessible to
 *                  this handler.
 * The callback function is called as:
 *    callback(response) {
 *        // this = session object
 *    };
 * where 'response' is an Error value, or an object with the following fields:
 *    uri       the fully qualified URI as a jQuery.uri object.
 *    relref    the URI expressed as relative to the session base URI.
 *    type      'collection' or 'item'
 *    canList   'true' if collection can be listed
 *    canRead   'true' if resource can be read
 *    canWrite  'true' is resource can be modified
 *    canDelete 'true' is resource can be deleted
 */
shuffl.WebDAVStorage.prototype.info = function (uri, callback)
{
    log.debug(this.className+".info "+uri);
    if (!uri)
    {
        callback({ uri: null, relref: null });
        return;
    }
    var capinfo = jQuery.extend({}, this.capInfo);
    var info    = this.resolve(uri);
    ////log.debug("shuffl.WebDAVStorage.prototype.info "+jQuery.toJSON(info));
    shuffl.ajax.get(info.uri, "text", function (val) {
        if (val instanceof shuffl.Error)
        {
            callback(val);
        }
        else
        {
            callback(jQuery.extend(capinfo,
                { uri:        info.uri
                , relref:     info.relref
                , type:       shuffl.ends("/", info.uri) ? "collection" : "item"
                }));
        };
    });
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
shuffl.WebDAVStorage.prototype.createCollection = function (coluri, colslug, callback)
{
    ////log.debug(this.className+".createCollection "+coluri+", "+colslug);
    ////var newuri = shuffl.normalizeUri(coluri,"",true).resolve(colslug).toString();
    var newuri = shuffl.normalizeUri(coluri,"",true);
    newuri=shuffl.normalizeUri(newuri,colslug,true).toString();
    jQuery.ajax({
            type:         "MKCOL",
            url:          newuri,
            success:      shuffl.StorageCommon.resolveUriOnSuccess(this, newuri, callback),
            error:        shuffl.ajax.requestFailed(newuri, callback),
            cache:        false
        });
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
shuffl.WebDAVStorage.prototype.listCollection = function (coluri, callback)
{
    log.debug(this.className+".listCollection "+coluri);
    if (coluri===undefined)
    {
        callback({ uri: null, relref: null });
        return;
    };
    var session = this;
    var colinfo = this.resolve(coluri);
    ////log.debug("shuffl.WebDAVStorage.prototype.listCollection "+jQuery.toJSON(colinfo));
    var m = new shuffl.AsyncComputation();
    var propResourceType = 
        "<?xml version=\"1.0\"?>\r\n"+
        "<d:propfind xmlns:d='DAV:'><d:prop><d:resourcetype/></d:prop></d:propfind>\r\n";
    function addDepthHeader(XHR)
    {
        XHR.setRequestHeader("Depth", "1");
        XHR.setRequestHeader("Content-Type", "text/xml");
        return true;
    };
    m.eval( function (val, callback) {
        function successResponse(data, statustext, xhr)
        {
            if (xhr==undefined) {
                xhr={status:207, statusText: "Multi-Status"}; // TODO: remove when using jQuery 1.4
            }
            ////log.debug("XML data "+shuffl.elemString(data));
            callback({uri: colinfo.uri, relref:colinfo.relref, status: xhr.status, statusText:xhr.statusText, data:jQuery(data)});
        }
        jQuery.ajax({
                type:         "PROPFIND",
                url:          colinfo.uri,
                data:         propResourceType,
                dataType:     "xml",
                beforeSend:   addDepthHeader,
                success:      successResponse,
                error:        shuffl.ajax.requestFailed(colinfo.uri, callback),
                cache:        false
            });        
    });
    m.eval( function (val, callback) {
        ////log.debug("WebDAVStorage.prototype.listCollection: PROPFIND returned "+shuffl.objectString(val));
        if (val instanceof shuffl.Error)
        {
            callback(val);
        }
        else
        {
            // Success: val is a structure containing a jQuery object
            if (val.status != 207)
            {
                var e = new shuffl.Error("shuffl.WebDAVStorage.listCollection: unexpected PROPFIND status "+ val.status);
                callback(e);
                return
            }
            var rr =
                { "uri":        val.uri
                , "relref":     val.relref
                , "status":     val.status
                , "statusText": val.statusText
                , "members": []
                } ;
            //TODO: revise this to be more namespace-aware
            val.data.find("D\\:response").each(function (index) {
                ////log.debug("Index "+index);
                if (index != 0)
                {
                    var i = session.resolve(jQuery(this).find("D\\:href").text());
                    // this = DOM element
                    //if (jQuery.contains(this, "D\\:collection")) TODO: should work in jQuery 1.4
                    if (jQuery(this).find("D\\:collection").length != 0)
                    {
                        i.type = "collection"
                    } else {
                        i.type = "item"
                    };
                    rr.members.push(i);
                    ////log.debug("- list "+index+", entry "+shuffl.objectString(i));
                }
            });
            ////log.debug("- return "+shuffl.objectString(rr));
            callback(rr);
        };
    });
    m.exec(coluri, callback);
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
shuffl.WebDAVStorage.prototype.removeCollection = function (coluri, callback)
{
    ////log.debug(this.className+".removeCollection "+coluri);
    jQuery.ajax({
          type:         "DELETE",
          url:          coluri.toString(),
          //data:         jQuery.toJSON(cardext), 
          //contentType:  "application/json",
          //dataType:     "xml",    // Atom feed info expected as XML
          //beforeSend:   function (xhr, opts) { xhr.setRequestHeader("SLUG", "cardloc"); },
          //dataFilter:   examineRawData,
          success:      shuffl.ajax.decodeResponse(coluri, function (x) { callback(null) }, false),
          error:        shuffl.ajax.requestFailed(coluri, callback),
          //complete:     responseComplete,
          //username:     "...",
          //password:     "...",
          //timeout:      20000,     // Milliseconds
          //async:        true,
          cache:        false
      });
};

/**
 * Create a data resource in a collection.
 * 
 * @param coluri    is the URI reference of an existing collection within 
 *                  which the new resource is created.  The base URI of
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
 // TODO: add type parameter
shuffl.WebDAVStorage.prototype.create = function (coluri, slug, data, callback)
{
    log.debug(this.className+".create "+coluri+", "+slug);
    var self = this;
    //TODO: resolve against session base URI?
    var newuri = shuffl.normalizeUri(coluri,"",true).resolve(slug).toString();
    var m = new shuffl.AsyncComputation();
    ////log.debug("HEAD "+newuri);
    m.eval( function (val, callback)
        {
        jQuery.ajax({
                type:         "HEAD",
                url:          newuri,
                success:      shuffl.ajax.decodeResponse(newuri, callback),
                error:        shuffl.ajax.requestFailed(newuri, callback),
                cache:        false
            });     
        });
    m.eval( function (val, callback) {
        ////log.debug("HEAD response: "+shuffl.objectString(val));
        if (val instanceof shuffl.Error)
        {
            if (val.HTTPstatus == 404)
            {
                // Resource does not exist: OK to create
                if (typeof data != "string") { data = jQuery.toJSON(data); };
                //TODO: sort out content-type
                log.debug("PUT "+newuri);
                jQuery.ajax({
                        type:         "PUT",
                        url:          newuri,
                        data:         data,
                        contentType:  "application/octet-stream",
                        success:      shuffl.StorageCommon.resolveUriOnSuccess(self, newuri, callback),
                        error:        shuffl.ajax.requestFailed(newuri, callback),
                        cache:        false
                    });
                return;
            }
        } else {
            // Resource already exists: error
            //TODO: this is probably a bug - take 'var' off val
            var val = new shuffl.Error(
                "Create failed: resource already exists", newuri);
            val.HTTPstatus     = 400;
            val.HTTPstatusText = "Resource already exists";
            val.status         = "exists";
        }
        callback(val);
    });
    m.exec(newuri, callback);
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
shuffl.WebDAVStorage.prototype.get = function (uri, callback)
{
    ////log.debug(this.className+".get "+uri);
    this.getData(uri, "text", callback);
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
 // TODO: add type parameter
 // TODO: consider renaming as "update", say
 
shuffl.WebDAVStorage.prototype.put = function (uri, data, callback)
{
    log.debug(this.className+".put "+uri);
    var self = this;
    uri = shuffl.normalizeUri(this.resolve(uri).uri,"",false).toString();
    var m = new shuffl.AsyncComputation();
    m.eval( function (val, callback) {
        log.debug("Issue HEAD "+uri);
        jQuery.ajax({
                type:         "HEAD",
                url:          uri,
                success:      shuffl.ajax.decodeResponse(uri, callback),
                error:        shuffl.ajax.requestFailed(uri, callback),
                cache:        false
            });     
        });
    m.eval( function (val, callback) {
        ////log.debug("HEAD returned "+shuffl.objectString(val));
        if (val instanceof shuffl.Error)
        {
            callback(val);
            return;
        }
        if (typeof data != "string") { data = jQuery.toJSON(data); };
        //TODO: sort out proper content-type
        jQuery.ajax({
                type:         "PUT",
                url:          uri,
                data:         data,
                contentType:  "application/octet-stream",
                success:      shuffl.StorageCommon.resolveUriOnSuccess(self, uri, callback),
                error:        shuffl.ajax.requestFailed(uri, callback),
                cache:        false
            });
        });
    m.exec(uri, callback);
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
 * where 'response' is an Error value, or null if the named collection has
 * been successfully deleted.
 */
shuffl.WebDAVStorage.prototype.remove = function (uri, callback)
{
    ////log.debug(this.className+".remove "+uri);
    info = this.resolve(uri);
    ////log.debug(this.className+".remove "+info.uri);
    jQuery.ajax({
            type:         "DELETE",
            url:          info.uri.toString(),
            success:      shuffl.ajax.decodeResponse(uri, function (x) { callback(null) }, false),
            error:        shuffl.ajax.requestFailed(uri, callback),
            cache:        false
        });
};

// ------------------------------------------------
// Initialize on load
// ------------------------------------------------


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
 * where 'response' is an Error value, or null if the named collection has
 * been successfully deleted.
 * /
shuffl.WebDAVStorage.prototype.remove = function (uri, callback)
{
    ////log.debug(this.className+".remove "+uri);
    info = this.resolve(uri);
    ////log.debug(this.className+".remove "+info.uri);
    throw "shuffl.WebDAVStorage.prototype.remove not implemented";

    var m = new shuffl.AsyncComputation();
    m.eval( function (val, callback) {
        jQuery.ajax({
                type:         "PROPFIND",
                url:          colinfo.uri,
                data:         propResourceType,
                dataType:     "xml",
                beforeSend:   addDepthHeader,
                success:      successResponse,
                error:        shuffl.ajax.requestFailed(colinfo.uri, callback),
                cache:        false
            });     
        });
    m.exec(coluri, callback);
};
*/

/**
 * Add to storage handler factories
 * /
shuffl.addStorageHandler( 
    { uri:      "zzzfile:///" http://localhost:8080/exist/shuffl/
    , name:     "zzzLocalFile"
    , factory:  shuffl.WebDAVStorage
    });
*/

// End.
