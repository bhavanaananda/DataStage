#!/bin/bash
#
# Copy CA-signed certificate and key to working locations

sudo mv %{HOSTNAME}.key /etc/ssl/private/
sudo chgrp ssl-cert   /etc/ssl/private/%{HOSTNAME}.key
sudo chmod g=r,o=    /etc/ssl/private/%{HOSTNAME}.key
sudo mv /etc/ssl/CA/newcerts/01.pem /etc/ssl/certs/%{HOSTNAME}.pem

ls -al /etc/ssl/private/%{HOSTNAME}*
ls -al /etc/ssl/certs/%{HOSTNAME}*

# End.

