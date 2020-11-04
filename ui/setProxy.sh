#!/bin/bash

ipAddr=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1'  )
ipAddrCount=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' |  wc -l)
port=3001

if [ $ipAddrCount = "1" ]; then
    host='http://'$ipAddr':'$port 
else
    echo "Select the IP address:"
    select ip in $ipAddr
    do
        host='http://'$ip':'$port 
        break;
    done
fi

echo "Proxy: " $host


jq --arg host "$host" '.proxy = $host' package.json > "tmp" && mv "tmp" package.json