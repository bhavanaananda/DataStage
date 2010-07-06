/**
 * Test suite for automatic testing with Rhino. For launching 
 * the test suite in a browser, open index.html instead.
*/

// init simulated browser environment
load("../../googlecode_rdfquery/lib/env-js/env.rhino.js");

window.onload = function(){

    // Load jquery, juice and the test runner
    load("../../../../googlecode_rdfquery/jquery/jquery-1.3.2.js");
    load("../../../googlecode_rdfquery/jquery.uri.js");
    load("../../../googlecode_rdfquery/jquery.xmlns.js");
    load("../../../googlecode_rdfquery/jquery.datatype.js");
    load("../../../googlecode_rdfquery/jquery.curie.js");
    load("../../../googlecode_rdfquery/jquery.rdf.js");
    load("../../../googlecode_rdfquery/jquery.rdfa.js");

    load("../../../googlecode_rdfquery/lib/env-js/testrunner.js");

    //var start = new Date().getTime();

    // Load the tests
	load("test_test.js")


    //var end = new Date().getTime();

    // Display the results
    results();

    //print("\n\nTOTAL TIME : " + (end - start)/1000 + " SECONDS");
};


// load HTML page
window.location = "test.html";
