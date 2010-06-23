#! /bin/bash
#
# Upload small ZIP file
#

# Direct to server
# curl http://163.1.127.173/packages/admiral-test  -F "file=@small.zip;filename=small.zip;type=application/zip" -F id=small -u admiral:admiral -H "Accept: text/html,application/xhtml+xml"

# Via SSH tunnel:
curl http://localhost:9080/packages/admiral-test  -F "file=@small.zip;filename=small.zip;type=application/zip" -F id=small -u admiral:admiral -H "Accept: text/html"

