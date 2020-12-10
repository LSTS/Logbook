#!/bin/bash
cd ./api
pm2 start npm --name "Logbook" -- start & pm2 logs Logbook
