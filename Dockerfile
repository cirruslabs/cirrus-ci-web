FROM node:8.9.1

WORKDIR /svc/cirrus-ci-web
EXPOSE 8080

RUN npm install -g serve@6.4.2

ADD build/ /svc/cirrus-ci-web/

CMD exec serve --single /svc/cirrus-ci-web/ \
               --port 8080 \
               --cache 864000000
