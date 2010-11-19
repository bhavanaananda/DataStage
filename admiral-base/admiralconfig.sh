#!/bin/bash

# ADMIRAL system parameters
# (see also apache-default and apache-default-ssl)

source admiralRGLeader.sh

RGLeaderGID=600
RGMemberGID=601
RGCollabGID=602

ADMIRALHOSTNAME="%{HOSTNAME}"
SAMBAWORKGROUP="%{WORKGROUP}"

DATABANKHOST="%{DATABANKHOST}"
DATABANKSILO="%{DATABANKSILO}"
