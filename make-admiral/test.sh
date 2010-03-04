#!/bin/bash

set -x

smbpasswd -x admiral

smbpasswd -s -a admiral <<END
zakynthos
zakynthos
END

set +x

