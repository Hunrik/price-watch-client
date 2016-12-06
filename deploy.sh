#!/bin/sh
rsync -r --delete-after --quiet $TRAVIS_BUILD_DIR/ $DEPLOY_USER@$DEPLOY_HOST:/var/www/deploy
ssh $DEPLOY_USER@$DEPLOY_HOST
cd /var/www/deploy
yarn && npm run build
cd public && git clone git@github.com:Semantic-Org/Semantic-UI-CSS.git semantic-ui
cd ../ && npm run stayAlive