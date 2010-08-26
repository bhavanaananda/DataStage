#!/bin/bash
#
# Run from new VM console

echo =============================
echo Install ssh
echo =============================

apt-get update
apt-get install -qy --force-yes openssh-server

echo =============================
echo Configure ssh
echo =============================

cp /root/ssh_config /etc/ssh/ssh_config
cp /root/sshd_config /etc/ssh/sshd_config

echo =============================
echo "Next step: postboot_2.sh"
echo "should be able to run via SSH"
echo =============================
