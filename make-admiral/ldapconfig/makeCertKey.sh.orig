#!/bin/bash
#
# Create a certified server key, using a self-signed CA key
#
# See:
# http://httpd.apache.org/docs/2.0/ssl/ssl_faq.html
# 

# Generate a key
openssl genrsa -des3 -out zakynthos.key.secure 1024

# View key contents
# openssl rsa -noout -text -in zakynthos.key.secure

# Create a decrypted PEM version of this RSA private key:
sudo openssl rsa -in zakynthos.key.secure -out zakynthos.key.unsecure

# Make unsecure key current
cp -f zakynthos.key.unsecure zakynthos.key

# Create CSR

answers() {
	#echo zakynthos
	#echo zakynthos
	echo GB
	echo Oxfordshire
	echo Oxford
	echo University of Oxford
	echo Zoology Department
	echo zakynthos
	echo .
        echo challenge
        echo optional-company
}

answers | sudo openssl req -new -key zakynthos.key -out zakynthos.csr

# Create CA-signed certificate
sudo openssl ca -in zakynthos.csr -config /etc/ssl/openssl.cnf

echo .
echo Look for key in /etc/ssl/newcerts
echo Copy certificate body content to new file zakynthos.pem

# End.

