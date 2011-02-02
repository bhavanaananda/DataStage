#! /bin/bash
curl http://databank.ora.ox.ac.uk/admiral-test/datasets -u admiral:admiral | grep zipfile: | grep -v POST | grep delete | cut -d'<' -f 4| cut -d' ' -f 3|cut -d '"' -f 2| cut -d '/' -f 3-4
