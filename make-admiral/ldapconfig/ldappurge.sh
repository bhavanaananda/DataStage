#!/bin/bash

/etc/init.d/slapd stop
apt-get purge slapd
rm /var/lib/ldap/*
#apt-get install slapd

