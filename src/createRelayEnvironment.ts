import { subscribeObjectUpdates } from './rtu/ConnectionManager';

const { Environment, Network, RecordSource, Store } = require('relay-runtime');

/**
 * See RelayNetwork.js:43 for details how it used in Relay
 */
function subscription(operation, variables, cacheConfig, config) {
  if (operation.text.indexOf('Details') > 0) {
    // todo: remove once https://github.com/cirruslabs/cirrus-ci-web/issues/88 is fixed
    // temporary workaround for polling subscription for *Details components
    return pollingSubscription(operation, variables, cacheConfig, config);
  } else if (variables['taskID'] && operation.text.indexOf('commands') > 0) {
    let taskSubscriptionDisposer = webSocketSubscription(
      'TASK',
      variables['taskID'],
      operation,
      variables,
      cacheConfig,
      config,
    );
    let taskCommandsSubscriptionDisposer = webSocketSubscription(
      'TASK_COMMANDS',
      variables['taskID'],
      operation,
      variables,
      cacheConfig,
      config,
    );
    return {
      dispose: () => {
        taskSubscriptionDisposer.dispose();
        taskCommandsSubscriptionDisposer.dispose();
      },
    };
  } else if (variables['repositoryID'] && operation.text.indexOf('lastDefaultBranchBuild') > 0) {
    return webSocketSubscription(
      'REPOSITORY_DEFAULT_BRANCH_BUILD',
      variables['repositoryID'],
      operation,
      variables,
      cacheConfig,
      config,
    );
  } else if (variables['taskID']) {
    return webSocketSubscription('TASK', variables['taskID'], operation, variables, cacheConfig, config);
  } else if (variables['buildID']) {
    return webSocketSubscription('BUILD', variables['buildID'], operation, variables, cacheConfig, config);
  } else {
    return pollingSubscription(operation, variables, cacheConfig, config);
  }
}

function pollingSubscription(operation, variables, cacheConfig, config) {
  if (process.env.NODE_ENV === 'development') {
    console.log('Polling subscription', operation, variables);
  }
  let { onError, onNext } = config;

  let intervalId = setInterval(() => {
    fetchQuery(operation, variables).then(
      response => {
        onNext(response);
      },
      error => {
        onError && onError(error);
      },
    );
  }, 3333);

  return { dispose: () => clearInterval(intervalId) };
}

function webSocketSubscription(kind, id, operation, variables, cacheConfig, config) {
  if (process.env.NODE_ENV === 'development') {
    console.log('WS subscription to ' + kind + '/' + id);
  }
  let { onError, onNext } = config;

  let dispose = subscribeObjectUpdates(kind, id, () => {
    fetchQuery(operation, variables).then(
      response => {
        onNext(response);
      },
      error => {
        onError && onError(error);
      },
    );
  });

  return { dispose };
}

function fetchQuery(operation, variables) {
  let query = {
    query: operation.text, // GraphQL text from input
    variables,
  };
  return fetch('https://api.cirrus-ci.com/graphql', {
    method: 'POST',
    credentials: 'include', // cookies
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  }).then(response => {
    return response.json();
  });
}

// Create a network layer from the fetch function
const network = Network.create(fetchQuery, subscription);

const source = new RecordSource();
const store = new Store(source);

export default new Environment({
  network,
  store,
});
