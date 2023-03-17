import { subscribeObjectUpdates } from './rtu/ConnectionManager';

import { Environment, Network, Observable, RecordSource, Store, SubscribeFunction } from 'relay-runtime';
import * as Sentry from '@sentry/react';
import { RequestParameters } from 'relay-runtime/lib/util/RelayConcreteNode';
import { SpanStatus } from '@sentry/tracing';

/*
 * See RelayNetwork.js:43 for details how it used in Relay
 */
let subscription: SubscribeFunction = (operation, variables, cacheConfig) => {
  if (variables['taskID'] && operation.text.indexOf('commands') > 0) {
    return webSocketSubscriptions(operation, variables, [
      ['TASK', variables['taskID']],
      ['TASK_COMMANDS', variables['taskID']],
    ]) as any;
  } else if (variables['repositoryID'] && operation.text.indexOf('lastDefaultBranchBuild') > 0) {
    return webSocketSubscriptions(operation, variables, [
      ['REPOSITORY_DEFAULT_BRANCH_BUILD', variables['repositoryID']],
    ]) as any;
  } else if (variables['repositoryID']) {
    return webSocketSubscriptions(operation, variables, [
      ['REPOSITORY_BUILD_CREATION', variables['repositoryID']],
    ]) as any;
  } else if (variables['taskID']) {
    return webSocketSubscriptions(operation, variables, [['TASK', variables['taskID']]]) as any;
  } else if (variables['buildID']) {
    return webSocketSubscriptions(operation, variables, [['BUILD', variables['buildID']]]) as any;
  }
};

function webSocketSubscriptions(operation, variables, kind2id: Array<[string, string]>) {
  let dataSource = null;

  let result = Observable.create(sink => {
    dataSource = sink;
  });

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

async function fetchQuery(operation: RequestParameters, variables) {
  let query = {
    query: operation.text, // GraphQL text from input
    variables,
  };
  let transaction = Sentry.startTransaction({
    op: 'gql',
    name: operation.name,
  });
  transaction.setTag('operationKind', operation.operationKind);
  transaction.setData('id', operation.id);
  try {
    const response = await fetch('https://api.cirrus-ci.com/graphql', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
    });
    transaction.setHttpStatus(response.status);
    return response.json();
  } catch (e) {
    transaction.setStatus(SpanStatus.InternalError);
  } finally {
    transaction.finish();
  }
}

// Create a network layer from the fetch function
const network = Network.create(fetchQuery, subscription);

const source = new RecordSource();
const store = new Store(source);

let environment = new Environment({
  network,
  store,
});
export default environment;
