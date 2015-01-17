#!/bin/sh
set -e
gulp clean
gulp dist
echo shootme.timothysell.com > dist/CNAME
git add --all dist
git commit -m"deploy dist"
git subtree push --prefix dist github gh-pages

