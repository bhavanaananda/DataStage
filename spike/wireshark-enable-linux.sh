#!/bin/bash
#
# Set options to allow Wireshark traffic monitoring

sudo setcap 'CAP_NET_RAW+eip CAP_NET_ADMIN+eip' /usr/bin/dumpcap

# End.
