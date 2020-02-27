FROM node:13 as builder

WORKDIR /tmp/cirrus-ci-web
ADD package.json package-lock.json /tmp/cirrus-ci-web/

RUN npm ci

ENV NODE_ENV=production

ADD . /tmp/cirrus-ci-web/
RUN npm run relay && npm run build

FROM node:13-alpine

WORKDIR /svc/cirrus-ci-web
EXPOSE 8080

COPY --from=builder /tmp/cirrus-ci-web/serve.json /svc/cirrus-ci-web/serve.json

RUN npm install -g serve@11.3.0

COPY --from=builder /tmp/cirrus-ci-web/build/ /svc/cirrus-ci-web/

CMD serve --single \
          --listen 8080 \
          --config serve.json
