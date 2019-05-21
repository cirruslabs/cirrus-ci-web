#!/usr/bin/env bash

set -e

docker build --cache-from cirrusci/web-front-end:latest --tag cirrusci/web-front-end:latest .
