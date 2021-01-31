#!/bin/bash

find images/ | xargs -I {} grep -Hnr {} **/*.html | grep -Eo 'images/[^"]+' > used-images.txt
find images/ | xargs -I {} grep -Hnr {} **/*.scss | grep -Eo 'images/[^)]+' >> used-images.txt
cat images-used.txt | sort -u > images-used-sorted.txt
mv images-used-sorted.txt images-used.txt

# debug (print only):
# find images/ -type f | while read -r f; do echo -n "$f - "; grep -c $f images-used.txt; done

find images/ -type f | while read -r f; do used=$(grep -c "$f" images-used.txt); if [ $used -eq 0 ]; then mv "$f" ~/Pictures/nutree/_unused/; fi done
