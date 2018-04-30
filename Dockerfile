FROM node:10 as builder

WORKDIR /tmp/cirrus-ci-web
ADD . /tmp/cirrus-ci-web/

RUN yarn install && yarn run relay

ENV GENERATE_SOURCEMAP true
ENV NODE_ENV production
ENV PUBLIC_URL https://cirrus-ci.com/

RUN yarn run build

FROM node:9

WORKDIR /svc/cirrus-ci-web
EXPOSE 8080

RUN npm install -g serve@6.5.6

COPY --from=builder /tmp/cirrus-ci-web/build/ /svc/cirrus-ci-web/

CMD exec serve --single /svc/cirrus-ci-web/ \
               --port 8080 \
               --cache 864000000
