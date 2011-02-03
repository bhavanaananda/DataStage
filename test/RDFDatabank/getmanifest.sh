#!/bin/bash
#
# Get RDFDatabank dataset manifest using command line curl.
#

RDBROOT=http://databank.ora.ox.ac.uk/admiral-test/datasets 
DATASET=${1-test}

# --data-binary @- posts multiline from stdin

echo
echo "===== RETRIEVE DATASET $DATASET PAGE as RDF ====="
curl ${RDBROOT}/${DATASET} -u admiral:admiral -H "Accept: application/rdf+xml"

# End.
