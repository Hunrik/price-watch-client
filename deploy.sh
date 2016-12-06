#!/bin/sh
tar -xzf package.tgz && rm package.tgz
yarn && npm run build
cd public && git clone git@github.com:Semantic-Org/Semantic-UI-CSS.git semantic-ui
cd ../ && npm run stayAlive

