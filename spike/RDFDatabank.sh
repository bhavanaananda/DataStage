#!/bin/bash
#
# Driving RDFDatabank API using command line curl.
#

RDBROOT=http://163.1.127.173/admiral-test/datasets

# --data-binary @- posts multiline from stdin

echo
echo "===== RETRIEVE DATASET PAGE (No Accept header) ====="
curl ${RDBROOT}/apps -u admiral:admiral

echo
echo "===== RETRIEVE DATASET PAGE (Accept */*) ====="
curl ${RDBROOT}/apps -u admiral:admiral -H "Accept: */*"

echo
echo "===== RETRIEVE DATASET PAGE (Accept XHTML) ====="
curl ${RDBROOT}/apps -u admiral:admiral -H "Accept: application/xhtml+xml"

echo
echo "===== RETRIEVE DATASET PAGE (Accept HTML) ====="
curl ${RDBROOT}/apps -u admiral:admiral -o 00-temp-apps.html -H "Accept: text/html"

echo
echo "===== RETRIEVE DATASET PAGE as RDF ====="
curl ${RDBROOT}/apps -u admiral:admiral -H "Accept: application/rdf+xml"

echo
echo "===== RETRIEVE DATASET PAGE as JSON ====="
curl ${RDBROOT}/apps -u admiral:admiral -H "Accept: application/json"

echo
echo "===== RETRIEVE CSS PAGE (Accept HTML) ====="
curl ${RDBROOT}/apps/css -u admiral:admiral -o 00-temp-apps-css.html -H "Accept: text/html"

echo
echo "===== RETRIEVE CSS PAGE as RDF ====="
curl ${RDBROOT}/apps/css -i -u admiral:admiral -H "Accept: application/rdf+xml"

echo
echo "===== RETRIEVE CSS PAGE as JSON ====="
curl ${RDBROOT}/apps/css -u admiral:admiral -H "Accept: application/json"

#echo
#echo "===== RETRIEVE DATASET PAGE as RDF ====="
#curl ${RDBROOT}/test/TEST-ITEM-ZZZZZZ --upload-file - -H "Content-Type: application/foo" <<enddata
#foo1
#foo2
#enddata

echo
echo "===== DONE ====="

# End.
