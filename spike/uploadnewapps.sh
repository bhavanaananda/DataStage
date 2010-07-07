#! /bin/bash
#
# Create and upload ZIP file of apps directory
#

rm apps.zip
zip -r apps.zip apps
curl http://163.1.127.173/admiral-test/packages -F filename=apps.zip -F file=@apps.zip -F id=apps -u admiral:admiral -H "Accept: text/html,application/xhtml+xml"
#curl http://localhost:9080/packages/admiral-test  -F "file=@apps.zip;filename=apps.zip;type=application/zip" -F id=apps -u admiral:admiral -H "Accept: text/html,application/xhtml+xml"

