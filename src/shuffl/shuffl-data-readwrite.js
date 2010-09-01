/**
 * @fileoverview
 *  Shuffl workspace and card data read and write using various serialization
 *  formats.
 *  
 * @author Graham Klyne
 * @version $Id: shuffl-data-readwrite.js 568 2009-10-27 13:08:33Z gk-google@ninebynine.org $
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

/**
 * Local helper function to read JSON data from specified URI.
 * 
 * @param session   Shuffl storage session for reading data
 * @param uri       URI for data (may be relative to current page)
 * @param callback  a callback function that is invoked on completion:
 *                    function callback(val)
 *                    {
 *                       // this is undefined
 *                       // val = decoded workspace object, or shuffl.Error value
 *                    }
 */
shuffl.readJsonData = function (session, uri, callback)
{
    log.debug("shuffl.readJsonData "+uri);
    var m = new shuffl.AsyncComputation();
    m.eval(function(val,callback)
    {
        log.debug("Read data from "+val);
        session.getData(val, "json", callback);
    });
    m.eval(function(val,callback)
    {
        if (val instanceof shuffl.Error)
        {
            log.error("shuffl.readJsonData: error from session.getData: "+val.toString());
        }
        else
        {
            val = val.data;
        };
        callback(val);
    });
    m.exec(jQuery.uri(uri).toString(), callback);
};

/**
 * Read workspace data from specified URI.
 * 
 * @param session   Shuffl storage session for reading data
 * @param wsuri     URI for workspace data (may be relative to current page)
 * @param format    Name of workspace data format to decode.
 *                  If null or undefined, the format is detertmined based on
 *                  examination of the supplied URI. 
 * @param callback  a callback function that is invoked on completion:
 *                    function callback(val)
 *                    {
 *                       // this is undefined
 *                       // val = decoded workspace object, or shuffl.Error value
 *                    }
 */
shuffl.readWorkspaceData = function (session, wsuri, format, callback)
{
    log.debug("shuffl.readWorkspaceData "+wsuri+", "+format);
    shuffl.readJsonData(session, wsuri, callback);
};

/**
 * Read card data from specified URI.
 * 
 * @param session   Shuffl storage session for reading data
 * @param wsuri     URI for card data  (may be relative to current page)
 * @param format    Name of card data format to decode.
 *                  If null or undefined, the format is detertmined based on
 *                  examination of the supplied URI. 
 * @param callback  a callback function that is invoked on completion:
 *                    function callback(val)
 *                    {
 *                       // this is undefined
 *                       // val = decoded card object, or shuffl.Error value
 *                    }
 */
shuffl.readCardData = function (session, wsuri, format, callback)
{
    log.debug("shuffl.readCardData "+wsuri+", "+format);
    shuffl.readJsonData(session, wsuri, callback);
};

/**
 * Local helper function to write new data using JSON serialization.
 * 
 * @param session   Shuffl storage session for reading data
 * @param uri       suggested URI for data (may be relative to current page);
 *                  the actual URI used may be different, and is returned via
 *                  the callback function.
 * @param data      data to serialize and write
 * @param callback  a callback function that is invoked on completion
 * 
 * The callback function is called as:
 *    callback(response) {
 *        // this = undefined
 *    };
 * where 'response' is an Error value, or an object with the following fields:
 *    uri       the fully qualified URI of the created resource as a 
 *              jQuery.uri object.
 *    relref    the URI expressed as relative to the session base URI.
 */
shuffl.createJsonData = function (session, uri, data, callback)
{
    log.debug("shuffl.createJsonData "+uri);
    var m = new shuffl.AsyncComputation();
    m.eval(function(val,callback)
    {
        log.debug("Write data to "+val);
        session.create(val, val, data, callback);
    });
    m.eval(function(val,callback)
    {
        if (val instanceof shuffl.Error)
        {
            log.error("shuffl.createJsonData: error from session.create: "+val.toString());
        }
        callback(val);
    });
    m.exec(jQuery.uri(uri).toString(), callback);
};

/**
 * Create new workspace data.
 * 
 * @param session   Shuffl storage session for reading data
 * @param uri       suggested URI for data (may be relative to current page);
 *                  the actual URI used may be different, and is returned via
 *                  the callback function.
 * @param data      data to serialize and write
 * @param format    Name of data serialization format to use.
 *                  If null or undefined, the format is detertmined based on
 *                  examination of the supplied URI. 
 * @param callback  a callback function that is invoked on completion
 * 
 * The callback function is called as:
 *    callback(response) {
 *        // this = undefined
 *    };
 * where 'response' is an Error value, or an object with the following fields:
 *    uri       the fully qualified URI of the created resource as a 
 *              jQuery.uri object.
 *    relref    the URI expressed as relative to the session base URI.
 */
shuffl.createWorkspaceData = function (session, uri, data, format, callback)
{
    log.debug("shuffl.createWorkspaceData "+uri);
    shuffl.createJsonData(session, uri, data, callback);
};

// End.
