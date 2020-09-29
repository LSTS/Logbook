#!/bin/bash

ipAddr=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1')
port=3001

host='http://'$ipAddr':'$port 
echo 'Proxy: ' $host

jq --arg host "$host" '.proxy = $host' package.json > "tmp" && mv "tmp" package.json