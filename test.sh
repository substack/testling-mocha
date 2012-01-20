#!/bin/bash

cat mocha.js harness.js array.js |
    curl -sSNT- -u substack@gmail.com \
    'http://testling.com/?browsers=chrome/canary&noinstrument'

