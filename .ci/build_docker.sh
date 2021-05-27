#!/usr/bin/env bash

set -e

docker buildx build --platform linux/amd64,linux/arm64 \
  --cache-from cirrusci/web-front-end:latest \
  --tag cirrusci/web-front-end:latest .
