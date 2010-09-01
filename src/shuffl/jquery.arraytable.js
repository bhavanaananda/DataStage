/**
 * @fileoverview
 *  jQuery plugin to render and extract tables in the DOM.
 *  
 * @author Graham Klyne
 * @version $Id: jquery.arraytable.js 568 2009-10-27 13:08:33Z gk-google@ninebynine.org $
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
 * Extend the main jQuery object.
 */
jQuery.extend({
    table:
        /**
         * Create and return a jQuery object containing a <table> corresponding to
         * a supplied array.
         * 
         * @param head      if provided, this is an array that is converted to headings 
         *                  or body of a table which becomes the child of the current 
         *                  element.
         * @param body      if provided, this is an array that is converted to body 
         *                  elements of a new table.  If not supplied, the value of 
         *                  'head' may be used to populate the table body.
         * @param foot      if provided, this is an array that is converted to footer 
         *                  elements of a new table.
         * @return          the jQuery object for the new table element.
         */
        function(head,body,foot)
        {
            //log.debug("jQuery.table");
            // Helper to make a table section
            function makeSection(array,wrap,cell,morecell)
            {
                var sect = wrap.clone();
                for (var i = 0 ; i < array.length ; i++) {
                    var row    = array[i];
                    var rowelm = jQuery("<tr/>");
                    for (var j = 0 ; j <row.length ; j++) {
                        rowelm.append(cell.clone().text(row[j]));
                    };
                    sect.append(rowelm);
                    cell = morecell || cell;
                };
                return sect;
            };
            // Main body here
            head = head || [];
            body = body || [];
            foot = foot || [];
            if (jQuery.isArray(head) && jQuery.isArray(body) && jQuery.isArray(foot)) {
                var tblelem = jQuery("<table/>");
                var tblhead = jQuery("<th/>");
                var tblitem = jQuery("<td/>");
                if (body.length == 0) {
                    body = head;
                    head = [];
                };
                if (head.length) {
                    tblelem.append(makeSection(head, jQuery("<thead/>"), tblhead));
                };
                tblelem.append(makeSection(body, jQuery("<tbody/>"), tblitem));
                if (foot.length) {
                    tblelem.append(makeSection(foot, jQuery("<tfoot/>"), tblitem));
                };
                //log.debug("jQuery.table: "+tblelem.outerhtml());
                return tblelem;
            } else {
                throw new Error("jQuery.arraytable:table: supplied arguments must be an arrays");
            };
        }
});

/**
 * The 'table' method gets or sets a table value in the DOM corresponding to
 * this jQuery object.  The interface is styled after .text() and .html().
 * 
 * @param array     if provided, this is an array that is converted to rows 
 *                  of a table which becomes the child of the current element.
 * @param nh        if provided, specifies the number of rows in the array that
 *                  are to be rendered as a table header.
 * @return          if setting a table value, the jQuery object for the current 
 *                  element, otherwise an array corresponding to the contents 
 *                  of the current element interpreted as a table.
 *                  (Table header, body and footer are not distinguished in
 *                  the returned array.)
 */
jQuery.fn.table = function (array, nh)
{
    //log.debug("jQuery(...).table");
    if (array) {
        nh = nh || 0;
        this.empty().append(jQuery.table(array.slice(0,nh), array.slice(nh)));
        return this;
    } else {
        array = [];
        this.find("tr").each(function(index, elem) {
            var row = [];
            jQuery(this).find("th , td").each(function(index, elem) {
                row.push(jQuery(this).text());
            });
            array.push(row);
        });
        return array;
    }
};

/**
 *  Return full HTML for the current element
 */
jQuery.fn.outerhtml = function () {
    return jQuery("<wrap/>").append(jQuery(this).eq(0).clone()).html();
};

//ÊSee also, this from http://yelotofu.com/2008/08/jquery-outerhtml/
//
//jQuery.fn.outerHTML = function(s) {
//return (s)
//? this.before(s).remove()
//: jQuery("<p>").append(this.eq(0).clone()).html();
//}

// End.
