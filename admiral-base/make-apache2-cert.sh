#!/bin/sh
umask 077

answers() {
	echo --
	echo Oxfordshire
	echo Oxford
	echo University of Oxford
	echo Zoology Department
	echo %{HOSTFULLNAME}
	echo root@%{HOSTFULLNAME}
}

if [ $# -eq 0 ] ; then
	echo $"Usage: `basename $0` filename [...]"
	exit 0
fi

TARGETKEYDIR=/etc/ssl/private
TARGETCRTDIR=/etc/ssl/certs

#For testing:
#TARGETKEYDIR=.
#TARGETCRTDIR=. 

for target in $@ ; do
	PEM1=`/bin/mktemp /tmp/openssl.XXXXXX`
	PEM2=`/bin/mktemp /tmp/openssl.XXXXXX`
	rm -f $PEM1 $PEM2
	answers | /usr/bin/openssl req -newkey rsa:1024 -keyout $PEM1 -nodes -x509 -days 365 -out $PEM2 2> /dev/null        
	cat $PEM1 > $TARGETKEYDIR/${target}.key
        chown root:ssl-cert $TARGETKEYDIR/${target}.key
        chmod o=rw,g=r,o=   $TARGETKEYDIR/${target}.key
	cat $PEM2 > $TARGETCRTDIR/${target}.pem
        chown root: $TARGETCRTDIR/${target}.pem
        chmod a+r   $TARGETCRTDIR/${target}.pem
	rm -f $PEM1 $PEM2
done
