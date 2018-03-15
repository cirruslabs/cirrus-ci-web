FROM node:9

WORKDIR /tmp/cirrus-ci-web
ADD . /tmp/cirrus-ci-web/

RUN yarn install && \
    yarn run relay && \
    GENERATE_SOURCEMAP=true NODE_ENV=production PUBLIC_URL=https://cirrus-ci.com/ yarn run build && \
    mkdir -p /svc && \
    mv /tmp/cirrus-ci-web/build /svc/cirrus-ci-web && \
    rm -rf /tmp/cirrus-ci-web

WORKDIR /svc/cirrus-ci-web
EXPOSE 8080

RUN npm install -g serve@6.5.3

CMD exec serve --single /svc/cirrus-ci-web/ \
               --port 8080 \
               --cache 864000000
