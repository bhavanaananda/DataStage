/**
 * @fileoverview
 *  jQuery.csv plugin, parses CSV data from a string
 *  
 * @author Graham Klyne (derived initially from 'root.node' [1,2])
 * @version $Id: jquery.readcsv.js 820 2010-06-07 12:26:38Z gk-google@ninebynine.org $
 * 
 * [1] http://plugins.jquery.com/project/csv
 * [2] http://code.google.com/p/js-tables/wiki/CSV
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

/**
 * Usage:
 *  jQuery.csv()(csvtext)       returns an array of arrays representing the CSV text.
 *  jQuery.csv("\t")(tsvtext)   uses Tab as a delimiter (comma is the default)
 *                              and single & double quotes as the quote character
 */

jQuery.extend({
    csv:
        function(delim, lined)
        {
            delim = delim || ",";
            lined = typeof lined == "string" 
                ? new RegExp( "[" + (lined || "\\r\\n") + "]+") 
                : lined || new RegExp("[\r\n]+");
            var mitem  = "\\s*"+
                         '((("[^"]*["])+)'+           // 2
                         "|(('[^']*['])+)"+           // 4
                         "|([^"+delim+"]*))\\s*"+     // 6
                         "(["+delim+"])?";            // 7
            ////log.debug("jQuery.csv: '"+mitem+"'");
            mitem = new RegExp(mitem, "g");

            function unquote(s, q) {
                ////log.debug("- unquote "+s+", "+q);
                return s.slice(1,s.length-1).replace(q+q,q);
            }

            function pickitem (v, out) {
                var r = mitem.exec(v);
                ////log.debug("- v: |"+v+"|");0
                ////log.debug("- r: "+r.join("<>"));
                if (r != null) {
                    if (r[2]) {
                        out.push(unquote(r[2], '"'));
                    } else if (r[4]) {
                        out.push(unquote(r[4], "'"));
                    } else {
                        out.push(jQuery.trim(r[6]));
                    };
                    if (!r[7]) { r = null; };
                };
                return r;
            };

            function splitline (v) {
                var out = [];
                mitem.lastIndex = 0;
                var r = pickitem(v, out);
                while (r != null) {
                    r = pickitem(v, out);
                };
            return out;
            }
    
            return function(text) {
                var lines = text.split(lined);
                ////log.debug("- lined: "+jQuery.toJSON(lined));
                ////log.debug("- lines: "+lines.join("//"));
                for (var i=0, l=lines.length; i<l; i++) {
                    lines[i] = splitline(lines[i]);
                }
                return lines;
            };
        },

    getCSV:
        function(uri, callback)
        {
            function parseCSV(data, status) 
            {
                if (status == "success")
                {
                    data = jQuery.csv()(data);
                    // Sanity check data - list of lists - drop binary content
                    for (var i = 0 ; data && (i < data.length) ; i++)
                    {
                        for (var j = 0 ; j < data[i].length ; j++)
                        {
                            if (!data[i][j].match(/^[\u0020-\u00fd\u0100-\uffff]*$/))
                            {
                                data = null;
                                status = "invalidCSV";
                                break;
                            }
                        }
                    }
                }
                else 
                {
                    data = null; 
                };
                callback(data, status);
            };
            jQuery.get(uri, {}, parseCSV, "text");
        }    

});
