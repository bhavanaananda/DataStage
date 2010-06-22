(function($){

var ns = {
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    xsd: "http://www.w3.org/2001/XMLSchema#",
    dc: "http://purl.org/dc/elements/1.1/",
    foaf: "http://xmlns.com/foaf/0.1/",
    cc: "http://creativecommons.org/ns#",
    vcard: "http://www.w3.org/2001/vcard-rdf/3.0#",
    xmlns: "http://www.w3.org/2000/xmlns/",
    xml: "http://www.w3.org/XML/1998/namespace"
};

  parseFromString = function(xml){
    var doc;
    try {
      doc = new ActiveXObject("Microsoft.XMLDOM");
      doc.async = "false";
      doc.loadXML(xml);
    } catch(e) {
      var parser = new DOMParser();
      doc = parser.parseFromString(xml, 'text/xml');
    }
    return doc;
  },

  module("Very simple test");

  test("Loading RDF/XML into a databank", function() {
    var xml =
      '<rdf:Description xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"' +
      '    xmlns:dc="http://purl.org/dc/elements/1.1/"                         ' +
      '    rdf:about="http://www.w3.org/TR/rdf-syntax-grammar">                ' +
      '  <dc:title>RDF/XML Syntax Specification (Revised)</dc:title>           ' +
      '</rdf:Description>                                                      ';
    var doc = parseFromString(xml);
    var databank = $.rdf.databank();
    databank.load(doc);
    equals(databank.size(), 1);
    var triple = databank.triples()[0];
    equals(triple.subject.value.toString(), 'http://www.w3.org/TR/rdf-syntax-grammar');
    equals(triple.property.value.toString(), ns.dc + 'title');
    equals(triple.object.value.toString(), 'RDF/XML Syntax Specification (Revised)');
  }),
  
  test("Loading RDF/XML from a file into a databank", function() {
    var req = new XMLHttpRequest();
    req.open('GET','test_input.xml',false);
    req.send(null);
    var doc = req.responseXML;
   
    var databank = $.rdf.databank();
    databank.load(doc);
    equals(databank.size(), 1);
    var triple = databank.triples()[0];
    equals(triple.subject.value.toString(), 'http://www.w3.org/TR/rdf-syntax-grammar');
    equals(triple.property.value.toString(), ns.dc + 'title');
    equals(triple.object.value.toString(), 'RDF/XML Syntax Specification (Revised)');
  }),
   
   test("Loading RDF/XML from a file into a databank using JQuery", function() {
    
    expect(6);
    $.get('test_input.xml', function(data, textStatus) {
      equals(textStatus, 'success');
      equals(typeof(data), 'object');
      var databank = $.rdf.databank();
      databank.load(data);
      equals(databank.size(), 1);
      var triple = databank.triples()[0];
      equals(triple.subject.value.toString(), 'http://www.w3.org/TR/rdf-syntax-grammar');
      equals(triple.property.value.toString(), ns.dc + 'title');
      equals(triple.object.value.toString(), 'RDF/XML Syntax Specification (Revised)');
      start();
    }, 'xml');
    stop(2000);
  }),
     
 /*    test("Loading non-XML", function() {
    
    expect(5);
    $.get('test_input.txt', function(data, textStatus) {
      equals(textStatus, 'success');
      try {
        var databank = $.rdf.databank();
        databank.load(data);
        equals(databank.size(), 1);
        var triple = databank.triples()[0];
        equals(triple.subject.value.toString(), 'http://www.w3.org/TR/rdf-syntax-grammar');
        equals(triple.property.value.toString(), ns.dc + 'title');
        equals(triple.object.value.toString(), 'RDF/XML Syntax Specification (Revised)');
      } catch (e) {
      	ok(false, 'Exception thrown: ' + e);
      	
      }
      start();
    }, 'xml');
    stop(2000);
  }), */
  
  test("Serializing RDF/XML from a databank", function() {
  	var xml =
      '<rdf:Description xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"' +
      '    xmlns:dc="http://purl.org/dc/elements/1.1/"                         ' +
      '    rdf:about="http://www.w3.org/TR/rdf-syntax-grammar">                ' +
      '  <dc:title>RDF/XML Syntax Specification (Revised)</dc:title>           ' +
      '</rdf:Description>                                                      ';
    var doc = parseFromString(xml);
    var databank = $.rdf.databank();
    databank.load(doc);
    equals(databank.size(), 1);
    var data = databank.triples()[0];
    var dump = $.rdf.dump([data], { format: 'application/rdf+xml', serialize: true, namespaces: ns });
    if (dump.substring(0, 5) === '<?xml') {
      dump = dump.substring(dump.indexOf('?>') + 2);
    }
    var doc2 = parseFromString(dump);
    var databank2 = $.rdf.databank();
    databank2.load(doc2);
    equals(databank2.size(), 1);
    var data2 = databank2.triples()[0];
    equals(data.subject.value.toString(), data2.subject.value.toString());
    equals(data.property.value.toString(), data2.property.value.toString());
    equals(data.object.value.toString(), data2.object.value.toString());
 /*   var serializer = new XMLSerializer();
    var req = new XMLHttpRequest();
    req.open('POST','test_output.xml');
    req.setRequestHeader("Content-Type", "application/xml");
    req.send(dump);
    return req.responseText; */
   

    });
  
})(jQuery);