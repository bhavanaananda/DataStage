#!/bin/bash
#
# Create a certified server key, using a self-signed CA key
#
# See:
# http://httpd.apache.org/docs/2.0/ssl/ssl_faq.html
# 

# Generate a key
openssl genrsa -des3 -out %{HOSTNAME}.key.secure 1024

# View key contents
# openssl rsa -noout -text -in %{HOSTNAME}.key.secure

# Create a decrypted PEM version of this RSA private key:
sudo openssl rsa -in %{HOSTNAME}.key.secure -out %{HOSTNAME}.key.unsecure

# Make unsecure key current
cp -f %{HOSTNAME}.key.unsecure %{HOSTNAME}.key

# Create CSR
answers() {
	echo GB
	echo Oxfordshire
	echo Oxford
	echo University of Oxford
	echo Zoology Department
	echo %{HOSTNAME}
	echo .
    echo challenge
    echo optional-company
}
answers | sudo openssl req -new -key %{HOSTNAME}.key -out %{HOSTNAME}.csr

# Create CA-signed certificate
# (see makeCA.sh)
sudo openssl ca -in %{HOSTNAME}.csr -config /etc/ssl/openssl.cnf

echo .
echo Look for key in /etc/ssl/newcerts
echo Copy certificate body content to new file %{HOSTNAME}.pem

# End.

