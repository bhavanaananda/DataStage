#!/bin/bash
#
# Create a self-signed CA certificate that can be used for signing other certificates,
# and imported into the local trust root.
#
# See: https://help.ubuntu.com/9.10/serverguide/C/certificates-and-security.html#certificate-authority
#

sudo mkdir /etc/ssl/CA
sudo mkdir /etc/ssl/CA/newcerts

sudo sh -c "echo '01' > /etc/ssl/CA/serial"
sudo touch /etc/ssl/CA/index.txt

# Responses for openssl self-signed certificate details
answers() {
	echo GB
	echo Oxfordshire
	echo Oxford
	echo University of Oxford
	echo Zoology Department
	echo IBRG
	echo .
}

# Create the self-signed CA certificate
answers | \
    openssl req -new -x509 -extensions v3_ca \
        -keyout cakey.pem -out cacert.pem -days 3650

echo .
echo Moving key and cert to target directories
sudo mv cakey.pem /etc/ssl/private/
sudo mv cacert.pem /etc/ssl/certs/

echo .
echo --------------
echo to sign a CSR:
echo "openssl ca -in <foo.csr> -config /etc/ssl/openssl.cnf"
echo .
echo To view key contents
echo openssl rsa -noout -text -in /etc/ssl/private/cakey.pem
echo .
echo To view certificate contents
echo openssl x509 -text -in /etc/ssl/certs/cacert.pem 
echo .

# /etc/ssl/openssl contains:

##########
#[ CA_default ]
#dir             = /etc/ssl/             # Where everything is kept
#database        = $dir/CA/index.txt     # database index file.
#certificate     = $dir/certs/cacert.pem # The CA certificate
#serial          = $dir/CA/serial        # The current serial number
#private_key     = $dir/private/cakey.pem# The private key
#certs           = $dir/CA/certs         # Where the issued certs are kept
#crl_dir         = $dir/CA/crl           # Where the issued crl are kept
#unique_subject  = no                    # Set to 'no' to allow creation of
#                                        # several ctificates with same subject.
#new_certs_dir   = $dir/CA/newcerts      # default place for new certs.
#crlnumber       = $dir/CA/crlnumber     # the current crl number
#                                        # must be commented out to leave a V1 CRL
#crl             = $dir/CA/crl.pem       # The current CRL
#private_key     = $dir/private/cakey.pem# The private key
#RANDFILE        = $dir/private/.rand    # private random number file
#x509_extensions = usr_cert              # The extentions to add to the cert
##########
