FROM node:15 as builder

WORKDIR /tmp/cirrus-ci-web
ADD package.json package-lock.json /tmp/cirrus-ci-web/

RUN npm ci

ENV NODE_ENV=production

ADD . /tmp/cirrus-ci-web/
RUN npm run relay && npm run build && rm -rf build/service-worker.js

FROM node:15

WORKDIR /svc/cirrus-ci-web
EXPOSE 8080

COPY --from=builder /tmp/cirrus-ci-web/serve.json /svc/cirrus-ci-web/serve.json
COPY --from=builder /tmp/cirrus-ci-web/build/ /svc/cirrus-ci-web/

RUN npm install -g serve@11.3.0

CMD serve --single \
          --listen 8080 \
          --config serve.json
