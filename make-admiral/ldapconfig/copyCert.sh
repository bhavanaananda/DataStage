#!/bin/bash
#
# Copy CA-signed certificate and key to working locations

sudo mv zakynthos.key /etc/ssl/private/
sudo chgrp ssl-cert   /etc/ssl/private/zakynthos.key
sudo chmod g=r,o=    /etc/ssl/private/zakynthos.key
sudo mv /etc/ssl/CA/newcerts/01.pem /etc/ssl/certs/zakynthos.pem

ls -al /etc/ssl/private/zak*
ls -al /etc/ssl/certs/zak*

# End.

