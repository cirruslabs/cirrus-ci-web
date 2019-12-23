# Web front end for [Cirrus CI](https://cirrus-ci.com/)

[![Build Status](https://api.cirrus-ci.com/github/cirruslabs/cirrus-ci-web.svg)](https://cirrus-ci.com/github/cirruslabs/cirrus-ci-web)

Front end for [Cirrus CI](https://cirrus-ci.com/) that uses [Relay](https://github.com/facebook/relay) framework
to minimize the amount of business logic.

**Disclaimer:** written by backend engineers.

## Development Guide

- Run `npm ci` to install all external dependencies.
- Run `npm run relay` to compile all GraphQL queries and mutations.
- Run `npm run sync-schema` to sync the GraphQL schema.

After everything is installed and compiled, run `npm start` to start a local server. All changes will be instantly ready to view in your browser.

## Authentication from localhost

In order to authenticate with `api.cirrus-ci.com` from locally running Cirrus CI Web simply login on [cirrus-ci.com](https://cirrus-ci.com)
and remove `Same-Site` restrictions for `cirrusUserId` and `cirrusAuthToken` cookies for `api.cirrus-ci.com` ([EditThisCookie](http://www.editthiscookie.com/)
cookie editor works just fine for it).

## Productivity Tips

### Disable Type Checking temporarily

This app is written in TypeScript and whenever TypeScript finds a static type error it will display an "error overlay" in the browser which prevents you "seeing" the app even if it was compilable to JS.
Sometimes during quick experimentation this can be annoying. 
Therefore you can disable typechecking temporarily by running the app with: 
```
npm run start-untyped
```

### VS Code

If you happen to use VS Code, here are some recommended extensions which work well with this app:
- Prettier - for autoformatting
- Visual Studio IntelliCode - provides AI based code completion
- GraphQL (prisma.vscode-graphql)
