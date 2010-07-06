/**
 * @fileoverview
 * Access and manimpulate Atom feeds via AtomPub
 *  
 * @author Graham Klyne
 * @version $Id: AtomPub.js 695 2009-11-20 20:22:24Z gk-google@ninebynine.org $
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

// -------------------------
// AtomPub class and methods
// -------------------------

/**
 * Class for accessing and manimpulating Atom feeds via AtomPub
 * 
 * The class is instantiated with the URI of the AtomPub server, from which
 * is derived a base URI for subsequent requests.  This attempts to isolate 
 * most of the code from the servioce location details.
 * 
 * @param svcbase     a base URI for the AtomPub service
 */
shuffl.AtomPub = function(svcbase) {
    this.svcbase = svcbase;
};

// ---------------------
// AtomPub class methods
// ---------------------

/**
 * Function for decoding feed information values from an Ajax response via 
 * a 'success' callback.
 * 
 * @param atompubobj  AtomPub request object used for the request.
 * @param feedinfo    object containing inofmration about feed request from
 *                    previous call of serviceUri (see below).
 * @param callback    callback function with result information.
 * @return            jQuery.ajax success callback function to decode the
 *                    response and then call the supplied callback function.
 */
shuffl.AtomPub.decodeFeedInfoResponse = function (atompubobj, feedinfo, callback) {
    function decodeResponse(data, status) {
        //log.debug("shuffl.AtomPub.feedinfo.decodeResponse: "+feeduri+", "+status+", "+data);
        //log.debug("shuffl.AtomPub.feedinfo.decodeResponse: "+feeduri+", "+status+", "+shuffl.objectString(data.documentElement));
        //log.debug("shuffl.AtomPub.feedinfo.decodeResponse: "+feedinfo.path+", "+status+", "+shuffl.elemString(data.documentElement));
        //
        // <service xmlns='http://www.w3.org/2007/app'>
        //   <workspace>
        //     <title xmlns='http://www.w3.org/2005/Atom'>Test feed</title>
        //     <collection href='/atom/edit/testfeed'>
        //       <title xmlns='http://www.w3.org/2005/Atom'>Test feed</title>
        //       <accept>text/*,image/*,application/*</accept>
        //     </collection>
        //   </workspace>
        // </service>
        //
        var fi = { path: feedinfo.path };
        var c = jQuery(data.documentElement).find("collection");
        if (c.length != 0) {
            // TODO: isolate bug in collection href return?
            var feedpath = c.attr("href").replace(/^\/atom/, "");
            fi.uri   = shuffl.extendUriPath(atompubobj.svcbase, feedpath);
            fi.title= c.find("title").text();
        };
        callback(fi);
    }
    return decodeResponse;
};

/**
 * Function for decoding feed listing values from an Ajax response via 
 * a 'success' callback.
 * 
 * @param atompubobj  AtomPub request object used for the request.
 * @param feedinfo    object containing inofmration about feed request from
 *                    previous call of serviceUri (see below).
 * @param callback    callback function with result information.
 * @return            jQuery.ajax success callback function to decode the
 *                    response and then call the supplied callback function.
 */
shuffl.AtomPub.decodeFeedListResponse = function (atompubobj, feedinfo, callback) {
    function decodeResponse(data, status) {
        //log.debug("shuffl.AtomPub.feedinfo.decodeResponse: "+feeduri+", "+status+", "+data);
        //log.debug("shuffl.AtomPub.feedinfo.decodeResponse: "+feeduri+", "+status+", "+shuffl.objectString(data.documentElement));
        //log.debug("shuffl.AtomPub.listFeed.decodeResponse: "+feedinfo.path+", "+status+", "+shuffl.elemString(data.documentElement));
        //
        // <atom:feed xmlns:atom="http://www.w3.org/2005/Atom">
        //   <id xmlns="http://www.w3.org/2005/Atom">urn:uuid:90c4d745-7b82-4f29-8b84-1b011630275c</id>
        //   <updated xmlns="http://www.w3.org/2005/Atom">2009-08-20T14:29:44+01:00</updated>
        //   <link xmlns="http://www.w3.org/2005/Atom" href="#" rel="edit" type="application/atom+xml"/>
        //   <title xmlns="http://www.w3.org/2005/Atom">MODIFIED TEST FEED</title>
        //   <entry xmlns="http://www.w3.org/2005/Atom">
        //     <id>urn:uuid:1199aa81-4347-47c0-8a41-f901a1d31fbe</id>
        //     <published>2009-08-20T14:29:44+01:00</published>
        //     <updated>2009-08-20T14:29:44+01:00</updated>
        //     <title>atom.jpg</title>
        //     <link href="?id=urn:uuid:1199aa81-4347-47c0-8a41-f901a1d31fbe" rel="edit" type="application/atom+xml"/>
        //     <link href="atom.jpg" rel="edit-media" type="image/jpeg"/>
        //     <content src="atom.jpg" type="image/jpeg"/>
        //   </entry>
        //   <entry xmlns="http://www.w3.org/2005/Atom">
        //     <published>2009-08-20T14:29:43+01:00</published>
        //     <link href="?id=urn:uuid:e8c1d3ec-56e2-4091-b5b8-ebe55d46ffa1" rel="edit" type="application/atom+xml"/>
        //     <id>urn:uuid:e8c1d3ec-56e2-4091-b5b8-ebe55d46ffa1</id>
        //     <updated>2009-08-20T14:29:43+01:00</updated>
        //     <title>MODIFIED ITEM ADDED TO TEST FEED</title>
        //     <author><name>MODIFIED TEST ITEM AUTHOR NAME</name></author>
        //     <content>MODIFIED TEST ITEM CONTENT</content>
        //   </entry>
        // </atom:feed>
        //
        var feedelems = jQuery(data.documentElement).children();
        var fipathuri = atompubobj.getAtomEditPathUri(feedinfo, feedelems);
        var fi = {
            path:     fipathuri.path,
            uri:      fipathuri.uri,
            id:       feedelems.filter("id").text(),
            updated:  feedelems.filter("updated").text(),
            title:    feedelems.filter("title").text(),
            entries:  []
        };
        feedelems.filter("entry").each(
            function (index) {
                var itemelems = jQuery(this).children();
                var iipathuri = atompubobj.getAtomEditPathUri(feedinfo, itemelems);
                var ii = {
                    path:     iipathuri.path,
                    uri:      iipathuri.uri,
                    id:       itemelems.filter("id").text(),
                    created:  itemelems.filter("published").text(),
                    updated:  itemelems.filter("updated").text(),
                    title:    itemelems.filter("title").text()
                };
                fi.entries[index] = ii;
            });
        //log.debug("shuffl.AtomPub.decodeFeedListResponse: return"+shuffl.objectString(fi));
        callback(fi);
    }
    return decodeResponse;
};

/**
 * Function for decoding feed item values from Ajax response via 'success'
 * callback.
 * 
 * @param atompubobj  AtomPub request object used for the request.
 * @param iteminfo    object containing inofmration about item request from
 *                    previous call of serviceUri (see below).
 * @param callback    callback function with result information.
 * @param trace       optional parameter, set 'true' if trace output of
 *                    response data is required.
 * @return            jQuery.ajax success callback function to decode the
 *                    response and then call the supplied callback function.
 * 
 * A success return value may include the following fields:
 *   path:     path to item or resource
 *   uri:      uri of item or resource
 *   id:       id of item
 *   created:  creation date of item
 *   updated:  last-update date of item
 *   title:    title of item
 *   data:     data from item or resource
 *   dataref:  item reference to media resource
 *   datatype: "application/atom+xml" for item, or type of media resource
 *   datapath: atom service relative path to media resource
 */
shuffl.AtomPub.decodeItemResponse = function 
    (atompubobj, iteminfo, callback, trace) 
{
    function decodeResponse(data, status)
    {
        if (trace)
        {
            log.debug("shuffl.AtomPub.decodeResponse: "+
                iteminfo.path+", "+status);
            log.debug("shuffl.AtomPub.decodeResponse: "+
                shuffl.elemString(data.documentElement));
        };
        //
        // <entry xmlns="http://www.w3.org/2005/Atom">
        //   <id>urn:uuid:9475cf17-eb4e-4887-9ac5-f579b2d79692</id>
        //   <updated>2009-08-24T12:38:01+01:00</updated>
        //   <published>2009-08-24T12:38:01+01:00</published>
        //   <link href="?id=urn:uuid:9475cf17-eb4e-4887-9ac5-f579b2d79692" 
        //         rel="edit" type="application/atom+xml"/>
        //   <title>Test item</title>
        //   <content>{"a": "A", "b": "B"}</content>
        // </entry>
        //
        // <entry xmlns='http://www.w3.org/2005/Atom'>
        //   <id>urn:uuid:2aad829b-29e1-43f0-98b8-955cc2c70cc4</id>
        //   <published>2009-08-25T11:50:16+01:00</published>
        //   <updated>2009-08-25T11:50:16+01:00</updated>
        //   <title>testitem2.json</title>
        //   <link href='?id=urn:uuid:2aad829b-29e1-43f0-98b8-955cc2c70cc4' rel='edit' type='application/atom+xml'></link>
        //   <link href='testitem2.json' rel='edit-media' type='application/octet-stream'></link>
        //   <content src='testitem2.json' type='application/octet-stream'></content>
        // </entry>
        //
        var itemelems = jQuery(data.documentElement).children();
        var iipathuri = atompubobj.getAtomEditPathUri(iteminfo, itemelems);
        var ii = {
            path:     iipathuri.path,
            uri:      iipathuri.uri,
            id:       itemelems.filter("id").text(),
            created:  itemelems.filter("published").text(),
            updated:  itemelems.filter("updated").text(),
            title:    itemelems.filter("title").text(),
            data:     itemelems.filter("content").text(),
            dataref:  itemelems.filter("link[rel='edit-media']").attr("href"),
            datatype: itemelems.filter("link[rel='edit-media']").attr("type")
        };
        if (ii.dataref != undefined && ii.data == "") { 
            var pathuri = atompubobj.getAtomPathUri(iteminfo, ii.dataref); 
            ii.data     = undefined;
            ii.datauri  = pathuri.uri;
            ii.datapath = pathuri.path;
        };
        callback(ii);
    }
    return decodeResponse;
};

/**
 * Return function that returns a media resource response
 */
shuffl.AtomPub.returnMediaItemResponse = function (iteminfo, callback) 
{
    function returnResponse(data, status)
    {
        callback(data);
    }
    return returnResponse;
};

/**
 * Function used to update title of an entry that references an AtomPub 
 * "media resource" (initially, this is created using the slug).
 * 
 * @param atompubobj  AtomPub request object used for the request.
 * @param iteminfo    object containing inofmration about item request from
 *                    previous call of serviceUri (see below).
 * @param callback    callback function with result information.
 * @return            function chained from jQuery.ajax success callback to 
 *                    update the title if appropriate.
 */
shuffl.AtomPub.updateTitle = function(atompubobj, iteminfo, callback) {
    function update(val) {
        //log.debug("shuffl.AtomPub.updateTitle: "+shuffl.objectString(val));
        if (val.dataref    == undefined  ||
            iteminfo.title == undefined  || 
            iteminfo.title == ""         ||
            iteminfo.title == val.title) {
            // No update required
            //log.debug("- no update");
            callback(val);
            return;
        };
        // Update title in feed item:
        //log.debug("- update title");
        atompubobj.putItem(
            { uri:     val.uri
            , title:   iteminfo.title
            , dataref: val.dataref
            },
            callback);
    };
    return update;
};

/**
 * Returns function for handling ajax request failure
 */
 // TODO: use shuffl.ajax.requestFailed; parameterize with handler name
shuffl.AtomPub.requestFailed = function (callback) {
    return function (xhr, status, except) {
        log.debug("shuffl.AtomPub.requestFailed: "+status);
        var err = new shuffl.Error(
            "AtomPub request failed", 
            status+"; HTTP status: "+xhr.status+" "+xhr.statusText);
        err.HTTPstatus     = xhr.status;
        err.HTTPstatusText = xhr.statusText; 
        err.response       = err.HTTPstatus+" "+err.HTTPstatusText;
        ////log.debug("- err: "+shuffl.objectString(err));
        log.debug("- err: "+err);
        callback(err, status);
    };
};

// ----------------------
// AtomPub object methods
// ----------------------

/**
 * Method to extract an Atom feed or item path from an Atom URI
 * 
 * @param uri       URI of Atom feed or item
 * @return          path string of Atom feed or item with service elements 
 *                  stripped out.
 */
shuffl.AtomPub.prototype.getAtomPath = function(uri) {
    ////log.debug("shuffl.AtomPub.getAtomPath: "+(typeof uri)+", "+shuffl.objectString(uri));
    ////log.debug("shuffl.AtomPub.getAtomPath: "+uri);
    uri = jQuery.uri(uri, "error:///error");
    return uri.path.replace(/\/exist\/atom\/edit/, "")+shuffl.uriQuery(uri);
};

/**
 * Method to extract an Atom service base URI from an Atom URI
 * 
 * @param uri       URI of Atom feed or item
 * @return          the atom service base URI associated with this object, or
 *                  null if the URI is not editable using the current AtomPub
 *                  service.
 */
shuffl.AtomPub.prototype.getAtomService = function(uri) {
    var svcuri = svcbase.toString();
    if (uri.toString().slice(0,svcuri.length != svcuri)) {
        svcuri = null;
    }
    return svcuri;
};

/**
 * Method to return an AtomPub service URI for operations on a feed or item.
 * 
 * @param info      object identifying a feed.
 * @param service   string indicating what feed service is required:
 *                  "introspect", "edit" or "content". Defaults to 'edit'
 * @param feed      if true, constructs a feed URI with a trailing '/' on
 *                  its path.
 * @return          a jQuery.uri object with the required AtomPub service URI.
 *
 * The feed identification object has the following fields: 
 *   path:  is feed uri path of the feed or item to be accessed,
 * or:
 *   base:  names the feed uri path at which the new feed or item is 
 *          created, or "/".  Must end with '/'.
 *   name:  a name for the new feed or item, appended to the base path.
 * or:
 *   uri:   a uri, the path+query elements of which are extrtacted by
 *          getAtomPath, and resolved relative to the AtomPub service URI.
 */
shuffl.AtomPub.prototype.serviceUri = function (info, service, feed) {
    ////log.debug("shuffl.AtomPub.serviceUri: "+shuffl.objectString(info));
    if ( !service   ) { service   = 'edit'; };
    if ( !info.path ) { info.path = info.base+info.name; };
    if ( !info.path ) { info.path = this.getAtomPath(info.uri); };
    if ( !info.path )
    { 
        return shuffl.Error(
            "shuffl.AtomPub.serviceUri: insufficient information ", 
            shuffl.objectString(info)); 
    };
    if (feed)
    {   // Ensure trailing '/' on path
        info.path = (info.path+'/').replace(/\/\/$/,"/");
    }    
    info.uri = shuffl.extendUriPath(
        jQuery.uri(this.svcbase).resolve(service+"/"),
        info.path);
    return info.uri;
};

/**
 * Method to assemble an atom object path and URI from an atompub
 * protocol response.
 * 
 * @param info      is the feed or item information for which the request 
 *                  was issued, containing the request path and URI
 * @param atomref   is a string containing the URI reference of the 'edit'
 *                  link for the corresponding item.
 * @return          a structure containing .path and .uri fields assembled
 *                  from base URI information from the current request
 *                  and local reference information in the atompub response.
 */
shuffl.AtomPub.prototype.getAtomPathUri = function (info, atomref) {
    var atomuri = this.serviceUri(info, "edit").resolve(atomref);
    return (
        { 'uri':  atomuri
        , 'path': this.getAtomPath(atomuri)
        });
};

/**
 * Method to assemble an atom object edit path and URI from an atompub
 * protocol response.
 * 
 * @param info      is the feed or item information for which the request 
 *                  was issued, containing the request path and URI
 * @param elems     is a jQuery object containing the immediate child
 *                  elements of an atom feed or item description.
 * @return          a structure containing .path and .uri fields assembled
 *                  from base URI information from the current request
 *                  and local reference information in the atompub response.
 */
shuffl.AtomPub.prototype.getAtomEditPathUri = function (info, elems) {
    var atomref = elems.filter("link[rel='edit']").attr("href");
    return this.getAtomPathUri(info, atomref);
};

/**
 * Function to assemble a data object for publication for createItem or putItem.
 * 
 * @param iteminfo  object containing information about the item to be created.
 * @return          an object containing request entity values to be passed
 *                  in an Ajax POST or PUT request.
 *
 * The new item data description uses the following fields:
 *   title:     a textual title for the new item.
 *   data:      a data object to be used for the new item.  This may be a
 *              javascript object that is serialized as JSON for the stored
 *              data, or a string, which is used as-is for the data.
 *   datatype:  is the MIME content type of the supplied data.  If this is
 *              "application/atom+xml" the data is embedded in a new feed item
 *              description, otherwise it is pushed to the AtomPub server as-is
 *              and a new item description is created by the server 
 *              (cf. AtomPub "media resource").
 *   dataref:   when updating an existing media resource entry, this is the
 *              uri-ref in the <content> element.
 * 
 * The Ajax request values provided are
 *   content:     entity body to be passed with the request
 *   contentType: content type header to be passed with the request
 */
shuffl.AtomPub.assembleData = function (iteminfo) {
    var template =
        '<?xml version="1.0" ?>'+'\n'+
        '<entry xmlns="http://www.w3.org/2005/Atom">'+'\n'+
        '  <title>%(title)s</title>'+'\n'+
        //'  <id>TEST-ITEM-ZZZZZZ.ext</id>'+'\n'+
        //'  <updated>20090709T18:30:02Z</updated>'+'\n'+
        //'  <author><name>TEST ITEM AUTHOR NAME</name></author>'+'\n'+
        '  <content>%(data)s</content>'+'\n'+
        '</entry>'+'\n';
    var templateref =
        '<?xml version="1.0" ?>'+'\n'+
        '<entry xmlns="http://www.w3.org/2005/Atom">'+'\n'+
        '  <title>%(title)s</title>'+'\n'+
        //'  <id>TEST-ITEM-ZZZZZZ.ext</id>'+'\n'+
        //'  <updated>20090709T18:30:02Z</updated>'+'\n'+
        //'  <author><name>TEST ITEM AUTHOR NAME</name></author>'+'\n'+
        '  <content src="%(dataref)s" type="%(datatype)s" />'+'\n'+
        '</entry>'+'\n';
    //log.debug("shuffl.AtomPub.assembleData: "+shuffl.objectString(iteminfo));
    var data  = iteminfo.data;
    var type  = iteminfo.datatype || "application/atom+xml";
    //log.debug("shuffl.AtomPub.assembleData:type "+type);
    var title = iteminfo.title || "";
    if (iteminfo.dataref != undefined) {
        //log.debug("shuffl.AtomPub.assembleData (ref): "+shuffl.objectString(iteminfo));
        data = shuffl.interpolate(templateref, 
            {title: title, dataref: iteminfo.dataref, datatype: type});
        //type = "application/atom+xml";
    } else {
        if (typeof data != "string") { data = jQuery.toJSON(data); };
        if (type == "application/atom+xml") {
            data = shuffl.interpolate(template, {title: title, data: data});
        };
    }
    var datainfo = {
        title:        title,
        contentType:  type,
        content:      data
    };
    //log.debug("shuffl.AtomPub.assembleData: "+shuffl.objectString(datainfo));
    return datainfo;
};

// ------------------------------------------
// Exported methods on AtomPub session object
// ------------------------------------------

/**
 * Function to obtain information about a feed
 * 
 * @param feedinfo  object identifying a feed. See serviceUri for details.
 * @param callback  function to call with final result,
 *                  or a shuffl.Error value.
 */
shuffl.AtomPub.prototype.feedInfo = function (feedinfo, callback) {
    function examineRawData(data, type) { 
        log.debug("shuffl.AtomPub.feedinfo.examineRawData: "+type);
        log.debug("shuffl.AtomPub.feedinfo.examineRawData: "+data);
        //log.debug("shuffl.AtomPub.feedinfo.examineRawData: "+shuffl.elemString(data));
        return data;
    }
    function responseComplete(xhr, status) { 
        log.debug("shuffl.AtomPub.feedinfo.responseComplete: "+status);
        log.debug("shuffl.AtomPub.feedinfo.responseComplete: "+xhr.responseText);
    }
    var uri = this.serviceUri(feedinfo, "introspect", true);
    log.debug("shuffl.AtomPub.feedInfo: "+uri);
    jQuery.ajax({
            type:         "GET",
            url:          uri.toString(),
            //data:         jQuery.toJSON(cardext), 
            //contentType:  "application/json",
            dataType:     "xml",    // Atom feed info expected as XML
            //beforeSend:   function (xhr, opts) { xhr.setRequestHeader("SLUG", "cardloc"); },
            //dataFilter:   examineRawData,
            success:      shuffl.AtomPub.decodeFeedInfoResponse(this, feedinfo, callback),
            error:        shuffl.AtomPub.requestFailed(callback),
            //complete:     responseComplete,
            //username:     "...",
            //password:     "...",
            //timeout:      20000,     // Milliseconds
            //async:        true,
            cache:        false
        });
};

/**
 * Create a new feed
 * 
 * @param feedinfo  object identifying a feed. See serviceUri for details.
 * @param callback  function to call with final result,
 *                  or a shuffl.Error value.
 *
 * The new feed description object has the following additional fields: 
 *   title:   a textual title for the new feed.
 */
shuffl.AtomPub.prototype.createFeed = function (feedinfo, callback) {
    var uri = this.serviceUri(feedinfo, "edit", true);
    var template = '<?xml version="1.0" ?>'+'\n'+
                   '<feed xmlns="http://www.w3.org/2005/Atom">'+'\n'+
                   '  <title>%(title)s</title>'+'\n'+
                   '</feed>'+'\n';
    function decodeResponse(data, status) {
        ////log.debug("shuffl.AtomPub.createFeed.decodeResponse: "+feedinfo.path+", "+status);
        callback(feedinfo);
    }
    ////log.debug("shuffl.AtomPub.createFeed: "+uri);
    jQuery.ajax({
            type:         "POST",
            url:          uri.toString(),
            data:         shuffl.interpolate(template, {title: feedinfo.title}), 
            contentType:  "application/atom+xml",
            //dataType:     "xml",    // Atom feed info expected as XML
            success:      decodeResponse,
            error:        shuffl.AtomPub.requestFailed(callback),
            cache:        false
        });
};

/**
 * Delete a feed
 * 
 * @param feedinfo  object identifying a feed. See serviceUri for details.
 * @param callback  function to call with final result,
 *                  or a shuffl.Error value.
 */
shuffl.AtomPub.prototype.deleteFeed = function (feedinfo, callback) {
    function decodeResponse(data, status) {
        callback({});
    }
    var uri = this.serviceUri(feedinfo, "edit", true);
    ////log.debug("shuffl.AtomPub.deleteFeed: "+uri);
    jQuery.ajax({
            type:         "DELETE",
            url:          uri.toString(),
            success:      decodeResponse,
            error:        shuffl.AtomPub.requestFailed(callback),
            cache:        false
        });
};

/**
 * Function to list the items in a feed
 * 
 * @param feedinfo  object identifying a feed. See serviceUri for details.
 * @param callback  function called with information about the identified feed, 
 *                  or a shuffl.Error value.
 * 
 * Feed information is returned in a structure:
 *    feedinfo.path     URI path for this feed
 *    feedinfo.uri      URI for 
 *    feedinfo.id       feed universally unique identifier string (IRI)
 *    feedinfo.updated  date and time of last update as an RFC3339 date/time string.
 *    feedinfo.title    feed title string
 *    feedinfo.entries  array of feed entry details
 * 
 * Feed entry information is returned in a structure:
 *    iteminfo.id       item universally unique identifier string (IRI)
 *    iteminfo.created  date and time of publication as an RFC3339 date/time string.
 *    iteminfo.updated  date and time of last update as an RFC3339 date/time string.
 *    iteminfo.title    item title string
 * 
 * Values are provided as available, or left undefined.  Additional values may
 * also be provided.
 */
shuffl.AtomPub.prototype.listFeed = function (feedinfo, callback) {
    // listFeed main body starts here
    var uri = this.serviceUri(feedinfo, "content", true);
    ////log.debug("shuffl.AtomPub.listFeed: "+uri);
    jQuery.ajax({
            type:         "GET",
            url:          uri.toString(),
            dataType:     "xml",    // Atom feed info expected as XML
            success:      shuffl.AtomPub.decodeFeedListResponse(this, feedinfo, callback),
            error:        shuffl.AtomPub.requestFailed(callback),
            cache:        false
        });
};

/**
 * Create a new item in a feed
 * 
 * @param iteminfo  object identifying a feed and item to be created. 
 *                  See serviceUri and assembleData for details, and below.
 *
 * The new item description has the following additional fields:
 *   slug:    a suggested name for the new item.  
 *            See http://www.ietf.org/rfc/rfc5023.txt, section 9.7.
 */
shuffl.AtomPub.prototype.createItem = function (iteminfo, callback) {
    function setRequestHeaders(xhr, opts) {
        if (iteminfo.slug) {
            xhr.setRequestHeader("SLUG", iteminfo.slug);
        }
    }
    var uri      = this.serviceUri(iteminfo, "edit", true);
    var datainfo = shuffl.AtomPub.assembleData(iteminfo);
    ////log.debug("shuffl.AtomPub.createItem: "+uri);
    //log.debug("shuffl.AtomPub.createItem: "+shuffl.objectString(iteminfo));
    //log.debug("shuffl.AtomPub.createItem: "+shuffl.objectString(datainfo));
    jQuery.ajax({
            type:         "POST",
            url:          uri.toString(),
            data:         datainfo.content,
            contentType:  datainfo.contentType,
            dataType:     "xml",    // Atom item info expected as XML
            beforeSend:   setRequestHeaders,
            success:      shuffl.AtomPub.decodeItemResponse(this, iteminfo, 
                              shuffl.AtomPub.updateTitle(this, iteminfo,
                                  callback)),
            error:        shuffl.AtomPub.requestFailed(callback),
            cache:        false
        });
};

/**
 * Function to obtain information about an item
 * 
 * @param iteminfo  object identifying an item. See serviceUri for details.
 * 
 * iteminfo additionally may specify:
 *   datatype:  the expected type of the return value.  Any value other than
 *              "application/atom+xml" indicates a media resource is accessed.
 */
shuffl.AtomPub.prototype.getItem = function (iteminfo, callback) {
    ////log.debug("shuffl.AtomPub.getItem: "+shuffl.objectString(iteminfo));
    var uri = this.serviceUri(iteminfo, "content");
    // Atom response expected as XML, but no response for media resource
    var datatype = "xml";
    var handler  = shuffl.AtomPub.decodeItemResponse(this, iteminfo, callback);
    if (iteminfo.datatype && (iteminfo.datatype != "application/atom+xml")) 
    { 
        datatype = undefined;
        handler  = shuffl.AtomPub.returnMediaItemResponse(iteminfo, callback); 
        if (iteminfo.datatype == "application/json") 
        {
            datatype = "json";
        };
    };
    ////log.debug("shuffl.AtomPub.getItem: "+uri+", datatype "+datatype);
    jQuery.ajax({
            type:         "GET",
            url:          uri.toString(),
            dataType:     datatype,
            success:      handler,
            error:        shuffl.AtomPub.requestFailed(callback),
            cache:        false
        });
};

/**
 * Function to update an existing feed item.
 * 
 * Note: when performing a PUT to a media resource, the response is empty, 
 * not XML.  This has been causing jQuery to report parser errors.
 * 
 * @param iteminfo  object identifying a feed and item to be updated. 
 *                  See serviceUri and assembleData for details.
 * @param callback  returns information about the updated feed if successful,
 *                  or an error value if the request fails.
 * 
 * A success return value may include the following fields:
 *   path:     path to item or resource
 *   uri:      uri of item or resource
 *   id:       id of item
 *   created:  creation date of item
 *   updated:  last-update date of item
 *   title:    title of item
 *   data:     data from item or resource
 *   dataref:  item reference to media resource
 *   datatype: "application/atom+xml" for item, or type of media resource
 *   datapath: atom service relative path to media resource
 */
shuffl.AtomPub.prototype.putItem = function (iteminfo, callback) {
    //log.debug("shuffl.AtomPub.putItem: "+shuffl.objectString(iteminfo));
    //log.debug("shuffl.AtomPub.putItem: "+shuffl.objectString(datainfo));
    var uri = this.serviceUri(iteminfo, "edit");
    var datainfo = shuffl.AtomPub.assembleData(iteminfo);
    // Atom response expected as XML, but no response for media resource
    var datatype = undefined;
    if (datainfo.contentType == "application/atom+xml") { datatype = "xml"; };
    ////log.debug("shuffl.AtomPub.putItem: "+uri+", "+datainfo.contentType);
    jQuery.ajax({
            type:         "PUT",
            url:          uri.toString(),
            data:         datainfo.content,
            contentType:  datainfo.contentType,
            dataType:     datatype,
            success:      shuffl.AtomPub.decodeItemResponse(this, iteminfo, callback),
            error:        shuffl.AtomPub.requestFailed(callback),
            cache:        false
        });
};

/**
 * Function to delete a feed item
 * 
 * @param iteminfo  object identifying an item. See serviceUri for details.
 * @param callback  function called when delete is complete.
 * 
 * The callback is invoked with an Error object, or an empty dictionary.
 */
shuffl.AtomPub.prototype.deleteItem = function (iteminfo, callback) {
    function decodeResponse(data, status) {
        callback({});
    }
    ////log.debug("shuffl.AtomPub.deleteItem: "+shuffl.objectString(iteminfo));
    var uri = this.serviceUri(iteminfo, "edit");
    log.debug("shuffl.AtomPub.deletetItem: "+uri);
    jQuery.ajax({
            type:         "DELETE",
            url:          uri.toString(),
            success:      decodeResponse,
            error:        shuffl.AtomPub.requestFailed(callback),
            cache:        false
        });
};

// End