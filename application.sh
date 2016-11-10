#!/bin/bash

if [ -z "$PORT" ]; then
  echo "Missing \$PORT"
  exit 1
fi

if [ -z "$ENV" ]; then
  echo "Missing \$ENV"
  exit 1
fi
ls public
ls public/assets
PORT=$PORT NODE_ENV=$ENV node compiled/index.js