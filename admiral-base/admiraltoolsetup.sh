#!/bin/bash

# source admiralconfig.sh

echo ==========================================
echo Extract admiral tools from code repository
echo ==========================================
echo TODO: tag stable version of tools and use that
echo NOTE: tool directories are owned by root, with RO access for all
echo NOTE: see also /etc/apache2/sites-enabled/default-ssl

mkdir -p /mnt/lv-admiral-data/tool
cd /mnt/lv-admiral-data/tool
hg clone https://admiral-jiscmrd.googlecode.com/hg/ admiral

# End.
