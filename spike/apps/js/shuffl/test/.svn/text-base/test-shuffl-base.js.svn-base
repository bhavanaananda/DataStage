/**
 * @fileoverview
 *  Test suite for 00-skeleton
 *  
 * @author Graham Klyne
 * @version $Id$
 * 
 * Coypyright (C) 2010, University of Oxford
 *
 * Licensed under the MIT License.  You may obtain a copy of the license at:
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
 * Test suite for shuffl-base module
 */

/**
 * Function to register tests
 */
TestShufflBase = function()
{

    module("TestShufflBase");

    test("URI base", function () 
    {
        logtest("URI base");
        expect(3);
        var u = jQuery.uri("http://example.com/path/segment/name.type?query#frag");
        var b = shuffl.uriBase(u);
        var d = jQuery.uri().toString();
        equals(b, "http://example.com/path/segment/", "shuffl.uriBase");
        b = shuffl.uriBase("").toString();
        ok(b != "", "shuffl.uriBase (default non-blank)");
        equals(b, d.slice(0, b.length), "shuffl.uriBase (default)");
    });

    test("URI path and name", function () 
    {
        logtest("URI path and name");
        expect(2);
        var u = jQuery.uri("http://example.com/path/segment/name.type");
        var p = shuffl.uriPath(u);
        var n = shuffl.uriName(u);
        equals(p, "/path/segment/", "shuffl.uriPath");
        equals(n, "name.type",      "shuffl.uriName");
    });

    test("URI excluding fragment", function () 
    {
        logtest("URI excluding fragment");
        expect(4);
        var r = jQuery.uri("http://example.com/path/segment/name.type?query/path#fragment/path");
        var u = shuffl.uriWithoutFragment(r);
        equals(u, "http://example.com/path/segment/name.type?query/path", "shuffl.uriWithoutFragment (1)");
        r = jQuery.uri("file:/path/segment/name.type#fragment/path");
        u = shuffl.uriWithoutFragment(r);
        equals(u, "file:/path/segment/name.type", "shuffl.uriWithoutFragment (2)");
        r = jQuery.uri("http://example.com/?query/path#fragment/path");
        u = shuffl.uriWithoutFragment(r);
        equals(u, "http://example.com/?query/path", "shuffl.uriWithoutFragment (3)");
        r = jQuery.uri("http://example.com/path/segment/name.type?query/path");
        u = shuffl.uriWithoutFragment(r);
        equals(u, "http://example.com/path/segment/name.type?query/path", "shuffl.uriWithoutFragment (4)");
    });

    test("shuffl.showLocation", function ()
    {
        logtest("shuffl.showLocation");
        expect(4);
        shuffl.showLocation("http://example.com/path");
        var w = jQuery("#workspace_status"); 
        equals(w.text(), "http://example.com/path", "#workspace_status text");
        ok(!w.hasClass("shuffl-error"), "no shuffl-error class");
        shuffl.showLocation();
        equals(w.text(), jQuery.uri(), "#workspace_status text (default)");
        ok(!w.hasClass("shuffl-error"), "no shuffl-error class (default)");
    });

    test("shuffl.showError", function ()
    {
        logtest("shuffl.showLocation");
        expect(4);
        shuffl.showError("error message");
        var w = jQuery("#workspace_status"); 
        equals(w.text(), "error message", "#workspace_status text (error)");
        ok(w.hasClass("shuffl-error"), "has shuffl-error class (error)");
        try
        {
            throw new shuffl.Error("exception message");
        }
        catch (e)
        {
            shuffl.showError(e);
        };
        equals(w.text(), "shuffl error: exception message", "#workspace_status text (exception)");
        ok(w.hasClass("shuffl-error"), "has shuffl-error class (exception)");
    });

    test("shuffl.starts", function ()
    {
        logtest("shuffl.starts");
        expect(7);
        equals(shuffl.starts("abc", "abcdef"), true,  "shuffl.starts(1)");
        equals(shuffl.starts("xyz", "abcdef"), false, "shuffl.starts(2)");
        equals(shuffl.starts("abc", "abc"),    true,  "shuffl.starts(3)");
        equals(shuffl.starts("xyz", "abc"),    false, "shuffl.starts(4)");
        equals(shuffl.starts("abc", "ab"),     false, "shuffl.starts(5)");
        equals(shuffl.starts("",    "abcdef"), true,  "shuffl.starts(6)");
        equals(shuffl.starts("",    ""),       true,  "shuffl.starts(7)");
    });

    test("shuffl.ends", function ()
    {
        logtest("shuffl.starts");
        expect(7);
        equals(shuffl.ends("def", "abcdef"), true,  "shuffl.ends(1)");
        equals(shuffl.ends("xyz", "abcdef"), false, "shuffl.ends(2)");
        equals(shuffl.ends("abc", "abc"),    true,  "shuffl.ends(3)");
        equals(shuffl.ends("xyz", "abc"),    false, "shuffl.ends(4)");
        equals(shuffl.ends("abc", "bc"),     false, "shuffl.ends(5)");
        equals(shuffl.ends("",    "abcdef"), true,  "shuffl.ends(6)");
        equals(shuffl.ends("",    ""),       true,  "shuffl.ends(7)");
    });

    test("shuffl.normalizeUri", function ()
    {
        logtest("shuffl.normalizeUri");
        expect (6);
        equals(shuffl.normalizeUri("http://auth/path1/path2", null, true), 
               "http://auth/path1/path2/", "shuffl.normalizeUri (1)");
        equals(shuffl.normalizeUri("http://auth/path1/path2", null, false), 
               "http://auth/path1/path2",  "shuffl.normalizeUri (2)");
        equals(shuffl.normalizeUri("http://auth/path1/path2", "path3", true), 
               "http://auth/path1/path3/", "shuffl.normalizeUri (3)");
        equals(shuffl.normalizeUri("http://auth/path1/path2", "path3", false), 
               "http://auth/path1/path3",  "shuffl.normalizeUri (4)");
        equals(shuffl.normalizeUri("http://auth/path1/path2?q", "", true), 
               "http://auth/path1/path2/", "shuffl.normalizeUri (5)");
        equals(shuffl.normalizeUri("http://auth/path1/path2#f", "", true), 
               "http://auth/path1/path2/", "shuffl.normalizeUri (6)");
    });
    
};

// End
