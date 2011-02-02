#!/usr/bin/python
# $Id: $
"""
Define configuration for RDFDatabank testing

$Rev: $
"""

class RDFDatabankConfig:

    # Access via SSH tunnel
    endpointhost="localhost:9080"
    endpointpath="/admiral-test/packages/"

    # Access via IP address
    #endpointhost="163.1.127.173"
    endpointhost="databank.ora.ox.ac.uk"
    endpointsilo="admiral-test"
    endpointpath="/"+endpointsilo+"/"

    # Access credentials for testing
    endpointuser="admiral"
    endpointpass="admiral"

    # Later, may define methods to override these defaults, e.g. from a configuration file

# End.
