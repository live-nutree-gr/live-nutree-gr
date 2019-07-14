#!/bin/bash

docker run -it \
    -v /etc/passwd:/etc/passwd \
    -v /etc/group:/etc/group \
    -u `id -u`:`id -g` \
    -v `pwd`:`pwd` \
    -w `pwd` \
    nutree-build:latest /bin/bash
