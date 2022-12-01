FROM node:current as builder

WORKDIR /tmp/cirrus-ci-web
# add dependency data files
ADD package.json yarn.lock .yarnrc.yml /tmp/cirrus-ci-web/
# add relevant files from .yarn
ADD .yarn /tmp/cirrus-ci-web/.yarn

RUN yarn

ENV NODE_ENV=production
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV REACT_APP_SENTRY_DSN="https://6cf37e33c8224cd790e140f6b4a5d595@o4504250314522624.ingest.sentry.io/4504250322845696"

ADD . /tmp/cirrus-ci-web/
RUN yarn bootstrap && yarn build && rm -rf build/service-worker.js

FROM node:current-alpine

WORKDIR /svc/cirrus-ci-web
EXPOSE 8080

COPY --from=builder /tmp/cirrus-ci-web/serve.json /svc/cirrus-ci-web/serve.json
COPY --from=builder /tmp/cirrus-ci-web/build/ /svc/cirrus-ci-web/

RUN npm install -g serve@13.0.2

CMD serve --single \
          --listen 8080 \
          --config serve.json
