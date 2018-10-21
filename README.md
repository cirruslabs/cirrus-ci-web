### Web front end for [Cirrus CI](https://cirrus-ci.com/) [![Build Status](https://api.cirrus-ci.com/github/cirruslabs/cirrus-ci-web.svg)](https://cirrus-ci.com/github/cirruslabs/cirrus-ci-web)

Front end for [Cirrus CI](https://cirrus-ci.com/) that uses [Relay](https://github.com/facebook/relay) framework
to minimize amount of business logic.

**Disclaimer:** written by backend engineers.

### Developing Guide

* Run `yarn install` first to install all external dependencies. 
* Run `yarn run relay` to compile all GraphQL queries and mutations.
* Run `yarn run sync-schema` to sync GraphQL schema.

After everything is installed and compiled please run `yarn run start` to start a local server. All changes to sources will be hot reloaded in the browser.
