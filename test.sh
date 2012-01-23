#!/bin/bash

tar -cf- mocha.js harness.js test.js |
    curl -sSNT- -u substack@gmail.com \
    'http://testling.com/?browsers=chrome/canary&noinstrument=mocha.js&main=harness.js'
