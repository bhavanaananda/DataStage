#!/bin/bash
#
# Run from new VM console or SSH session

echo =============================
echo "Install LDAP packages"
echo =============================

apt-get update
apt-get install -qy --force-yes libpam-ldap

echo ===============================
echo "Configure LDAP"
echo ===============================

./ldapsetup.sh

echo =============================
echo "Next step: postboot_4.sh"
echo =============================
