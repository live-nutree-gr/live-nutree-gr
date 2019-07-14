#!/bin/bash

WD="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$WD"

docker build . -t nutree-build:latest
