import { subscribeObjectUpdates } from './rtu/ConnectionManager';

const { Environment, Network, RecordSource, Store, Observable } = require('relay-runtime');

/**
 * See RelayNetwork.js:43 for details how it used in Relay
 */
function subscription(operation, variables, cacheConfig) {
  if (variables['taskID'] && operation.text.indexOf('commands') > 0) {
    let taskSubscriptionObserver = webSocketSubscription(
      'TASK',
      variables['taskID'],
      operation,
      variables,
      cacheConfig,
    );
    let taskCommandsSubscriptionObserver = webSocketSubscription(
      'TASK_COMMANDS',
      variables['taskID'],
      operation,
      variables,
      cacheConfig,
    );
    return taskSubscriptionObserver.concat(taskCommandsSubscriptionObserver);
  } else if (variables['repositoryID'] && operation.text.indexOf('lastDefaultBranchBuild') > 0) {
    return webSocketSubscription(
      'REPOSITORY_DEFAULT_BRANCH_BUILD',
      variables['repositoryID'],
      operation,
      variables,
      cacheConfig,
    );
  } else if (variables['taskID']) {
    return webSocketSubscription('TASK', variables['taskID'], operation, variables, cacheConfig);
  } else if (variables['buildID']) {
    return webSocketSubscription('BUILD', variables['buildID'], operation, variables, cacheConfig);
  }
}

function webSocketSubscription(kind, id, operation, variables, cacheConfig) {
  let dataSource = null;

  let dispose = subscribeObjectUpdates(kind, id, () => {
    fetchQuery(operation, variables).then(
      response => {
        dataSource && dataSource.next(response);
      },
      error => {
        dataSource && dataSource.error(error);
      },
    );
  });

  return Observable.create(sink => {
    dataSource = sink;
  }).finally(dispose);
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
