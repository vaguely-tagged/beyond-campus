#!/bin/bash

for d in ./*/; do
    cd $d
    npm install
    node-gyp configure
    node-gyp build
    cd ..
done;