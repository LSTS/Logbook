#!/bin/bash
cd ./api && npm install

cd ../ui && npm install

cd ../api/resources
git clone https://github.com/LSTS/Logbook-private
cp Logbook-private/spreadsheet-credentials.json .
rm -rf Logbook-private

cd ../../ui && bash setProxy.sh