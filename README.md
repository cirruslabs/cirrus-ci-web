# Web front end for [Cirrus CI](https://cirrus-ci.com/)

[![Build Status](https://api.cirrus-ci.com/github/cirruslabs/cirrus-ci-web.svg)](https://cirrus-ci.com/github/cirruslabs/cirrus-ci-web)

Front end for [Cirrus CI](https://cirrus-ci.com/) that uses [Relay](https://github.com/facebook/relay) framework
to minimize the amount of business logic.

## Development Guide

- Run `npm ci` to install all external dependencies.
- Run `npm run bootstrap` to compile all GraphQL queries and mutations and to sync the schema.

After everything is prepared, run `npm start` to start a local server. All changes will be instantly ready to view in your browser.

### Running Production Build Locally

Running a production build locally might be useful for testing large refactoring or major upgrades. In order to do so
please build a Docker image locally and then simply run the image via Docker CLI:

```bash
./.ci/build_docker.sh
docker run -p 8080:8080 cirrusci/web-front-end:latest
```

## Authentication from localhost

In order to authenticate with `api.cirrus-ci.com` from locally running Cirrus CI Web, login on [cirrus-ci.com](https://cirrus-ci.com),
and remove the `Same-Site` restrictions for `cirrusUserId` and `cirrusAuthToken` cookies (for `api.cirrus-ci.com`). ([EditThisCookie](http://www.editthiscookie.com/)
works just fine for it).

### Productivity Tips

#### Disable Type Checking temporarily

This app is written in TypeScript and whenever TypeScript finds a static type error it will display an "error overlay" in the browser which prevents you "seeing" the app even if it was compilable to JS.
Sometimes during quick experimentation this can be annoying. 
Therefore you can disable typechecking temporarily by running the app with:

```bash
$ npm run start-untyped
```

#### VSCode

If you happen to use VSCode, here are some recommended extensions which work well with this app:

- Visual Studio IntelliCode - provides AI based code completion
- GraphQL (prisma.vscode-graphql) - provides syntax highlighting for GraphQL queries

#### Gitpod

You can also use Gitpod, an online IDE perfect for developing this app.
Once you have forked the repository, navigate to `https://gitpod.io/#https://github.com/YOURUSERNAME/cirrus-ci-web`.
Gitpod will automatically setup the workspace and open it for you.
