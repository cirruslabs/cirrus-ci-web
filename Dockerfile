FROM node:20.2.0 as builder

ARG CIRRUS_CHANGE_IN_REPO
ARG SENTRY_DSN

WORKDIR /tmp/cirrus-ci-web
# add dependency data files
ADD package.json yarn.lock .yarnrc.yml /tmp/cirrus-ci-web/
# add relevant files from .yarn
ADD .yarn /tmp/cirrus-ci-web/.yarn

RUN yarn

ENV NODE_ENV=production
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV REACT_APP_CIRRUS_CHANGE_IN_REPO=$CIRRUS_CHANGE_IN_REPO
ENV REACT_APP_SENTRY_DSN=$SENTRY_DSN

ADD . /tmp/cirrus-ci-web/
RUN yarn bootstrap && yarn build && rm -rf build/service-worker.js

FROM node:20.2.0-alpine

WORKDIR /svc/cirrus-ci-web
EXPOSE 8080

COPY --from=builder /tmp/cirrus-ci-web/serve.json /svc/cirrus-ci-web/serve.json
COPY --from=builder /tmp/cirrus-ci-web/build/ /svc/cirrus-ci-web/

RUN npm install -g serve@14.1.2

CMD serve --single \
          --listen 8080 \
          --config serve.json
