#!/bin/sh
git pull git@github.com:Hunrik/price-watch-client.git
cd public && git clone git@github.com:Semantic-Org/Semantic-UI-CSS.git semantic-ui
yarn && npm run build
cd public && git clone git@github.com:Semantic-Org/Semantic-UI-CSS.git semantic-ui
cd ../ && npm run stayAlive

