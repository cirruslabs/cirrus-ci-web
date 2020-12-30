FROM node:14 as builder

WORKDIR /tmp/cirrus-ci-web
ADD package.json yarn.lock /tmp/cirrus-ci-web/

RUN yarn

ENV NODE_ENV=production

ADD . /tmp/cirrus-ci-web/
RUN yarn bootstrap && yarn build && rm -rf build/service-worker.js

FROM node:14-alpine

WORKDIR /svc/cirrus-ci-web
EXPOSE 8080

COPY --from=builder /tmp/cirrus-ci-web/serve.json /svc/cirrus-ci-web/serve.json
COPY --from=builder /tmp/cirrus-ci-web/build/ /svc/cirrus-ci-web/

RUN npm install -g serve@11.3.0

CMD serve --single \
          --listen 8080 \
          --config serve.json
