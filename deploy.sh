#!/bin/sh
rsync -r --delete-after --quiet $TRAVIS_BUILD_DIR/ $DEPLOY_USER@D$DEPLOY_HOST:/var/www/deploy
ssh $DEPLOY_USER@D$DEPLOY_HOST
cd /var/www/deploy
yarn
cd public
git clone git@github.com:Semantic-Org/Semantic-UI-CSS.git semantic-ui