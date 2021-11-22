#!/bin/bash

export JEKYLL_VERSION=4.2.0
docker run --rm \
  --volume="$PWD:/srv/jekyll" \
  --publish '[::1]:4000:4000' \
  -it jekyll/jekyll:$JEKYLL_VERSION -- /bin/bash

# jekyll build
# jekyll serve
