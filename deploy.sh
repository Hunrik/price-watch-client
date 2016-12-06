#!/bin/sh
rsync -r --delete-after --quiet $TRAVIS_BUILD_DIR/ $DEPLOY_USER@D$DEPLOY_HOST:/var/www/deploy || echo 'Deploy Failing'
ssh $DEPLOY_USER@$DEPLOY_HOST || echo 'SSH Failing'
cd /var/www/deploy || echo 'CD Failing'
yarn && npm run build || echo 'Yarn Failing'
cd public && git clone git@github.com:Semantic-Org/Semantic-UI-CSS.git semantic-ui || echo 'Github Failing'
cd ../ && npm run stayAlive