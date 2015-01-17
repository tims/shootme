#!/bin/sh
set -e
gulp clean
gulp dist
echo shootme.timothysell.com > dist/CNAME

echo "Committing changes to dist dir"
git add --all dist
git commit -m"deploy dist"

echo "Pushing to github"
git subtree push --prefix dist github gh-pages

