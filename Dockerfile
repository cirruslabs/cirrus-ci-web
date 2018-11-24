FROM node:10 as builder

WORKDIR /tmp/cirrus-ci-web
ADD . /tmp/cirrus-ci-web/

RUN yarn install && yarn run relay

ENV GENERATE_SOURCEMAP true
ENV NODE_ENV production

RUN yarn run build

FROM node:10

WORKDIR /svc/cirrus-ci-web
EXPOSE 8080

COPY --from=builder /tmp/cirrus-ci-web/serve.json /svc/cirrus-ci-web/serve.json

RUN npm install -g serve@10.1.1

COPY --from=builder /tmp/cirrus-ci-web/build/ /svc/cirrus-ci-web/

CMD exec serve --single \
               --listen 8080 \
               --config serve.json
