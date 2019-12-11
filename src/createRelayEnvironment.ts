import { subscribeObjectUpdates } from './rtu/ConnectionManager';

const { Environment, Network, RecordSource, Store, Observable } = require('relay-runtime');

/*
 * See RelayNetwork.js:43 for details how it used in Relay
 */
function subscription(operation, variables, cacheConfig) {
  if (variables['taskID'] && operation.text.indexOf('commands') > 0) {
    return webSocketSubscriptions(operation, variables, [
      ['TASK', variables['taskID']],
      ['TASK_COMMANDS', variables['taskID']],
    ]);
  } else if (variables['repositoryID'] && operation.text.indexOf('lastDefaultBranchBuild') > 0) {
    return webSocketSubscriptions(operation, variables, [
      ['REPOSITORY_DEFAULT_BRANCH_BUILD', variables['repositoryID']],
    ]);
  } else if (variables['taskID']) {
    return webSocketSubscriptions(operation, variables, [['TASK', variables['taskID']]]);
  } else if (variables['buildID']) {
    return webSocketSubscriptions(operation, variables, [['BUILD', variables['buildID']]]);
  }
}

function webSocketSubscriptions(operation, variables, kind2id: Array<[string, string]>) {
  let dataSource = null;

  let result = Observable.create(sink => (dataSource = sink));

  kind2id.forEach(kindIdPair => {
    let [kind, id] = kindIdPair;
    let dispose = subscribeObjectUpdates(kind, id, () => {
      fetchQuery(operation, variables).then(
        response => dataSource && dataSource.next(response),
        error => dataSource && dataSource.error(error),
      );
    });
    result = result.finally(dispose);
  });

  return result;
}

async function fetchQuery(operation, variables) {
  let query = {
    query: operation.text, // GraphQL text from input
    variables,
  };
  const response = await fetch('https://api.cirrus-ci.com/graphql', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  });
  return response.json();
}

// Create a network layer from the fetch function
const network = Network.create(fetchQuery, subscription);

const source = new RecordSource();
const store = new Store(source);

export default new Environment({
  network,
  store,
});
