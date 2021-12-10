import React from 'react';

import { commitMutation, QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import AccountInformation from '../../components/account/AccountInformation';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import { ActiveRepositoriesDrawerQuery } from './__generated__/ActiveRepositoriesDrawerQuery.graphql';
import { ActiveRepositoriesDrawerDeleteWebPushConfigurationMutationVariables } from './__generated__/ActiveRepositoriesDrawerDeleteWebPushConfigurationMutation.graphql';
import { ActiveRepositoriesDrawerSaveWebPushConfigurationMutationVariables } from './__generated__/ActiveRepositoriesDrawerSaveWebPushConfigurationMutation.graphql';

const saveWebPushConfigurationMutation = graphql`
  mutation ActiveRepositoriesDrawerSaveWebPushConfigurationMutation($input: SaveWebPushConfigurationInput!) {
    saveWebPushConfiguration(input: $input) {
      clientMutationId
    }
  }
`;

const deleteWebPushConfigurationMutation = graphql`
  mutation ActiveRepositoriesDrawerDeleteWebPushConfigurationMutation($input: DeleteWebPushConfigurationInput!) {
    deleteWebPushConfiguration(input: $input) {
      clientMutationId
    }
  }
`;

function registerServiceWorkerIfNeeded(userId: string, webPushServerKey: string) {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  if (!('PushManager' in window)) {
    return;
  }

  askNotificationPermission().then(permissionResult => {
    navigator.serviceWorker
      .register('/notification-service-worker.js')
      .catch(function (err) {
        console.error('Unable to register service worker.', err);
      })
      .then(reg => {
        if (!reg) return;
        reg.pushManager.getSubscription().then(existingSubscription => {
          if (existingSubscription && permissionResult !== 'granted') {
            let jsonSub = existingSubscription.toJSON();
            const variables: ActiveRepositoriesDrawerDeleteWebPushConfigurationMutationVariables = {
              input: {
                clientMutationId: 'subscribe-' + userId,
                endpoint: jsonSub.endpoint,
              },
            };
            commitMutation(environment, {
              mutation: deleteWebPushConfigurationMutation,
              variables: variables,
              onError: err => console.error(err),
            });
            existingSubscription.unsubscribe();
          }
          if (!existingSubscription && permissionResult === 'granted') {
            let serverKey = base64toUIntArray(webPushServerKey);
            reg.pushManager
              .subscribe({
                userVisibleOnly: true,
                applicationServerKey: serverKey,
              })
              .then(sub => {
                if (sub) {
                  let jsonSub = sub.toJSON();
                  const variables: ActiveRepositoriesDrawerSaveWebPushConfigurationMutationVariables = {
                    input: {
                      clientMutationId: 'subscribe-' + userId,
                      endpoint: jsonSub.endpoint,
                      p256dhKey: jsonSub.keys['p256dh'],
                      authKey: jsonSub.keys['auth'],
                    },
                  };
                  commitMutation(environment, {
                    mutation: saveWebPushConfigurationMutation,
                    variables: variables,
                    onError: err => console.error(err),
                  });
                }
              });
          }
        });
      });
  });
}

function askNotificationPermission() {
  return new Promise((resolve, reject) => {
    const permissionResult = Notification.requestPermission(function (result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  });
}

function base64toUIntArray(text: string): Uint8Array {
  const raw = window.atob(text);
  const rawLength = raw.length;
  const result = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    result[i] = raw.charCodeAt(i);
  }
  return result;
}

export default function ActiveRepositoriesDrawer(): JSX.Element {
  return (
    <QueryRenderer<ActiveRepositoriesDrawerQuery>
      environment={environment}
      query={graphql`
        query ActiveRepositoriesDrawerQuery {
          viewer {
            id
            webPushServerKey
            ...AccountInformation_viewer
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (!props) {
          return <CirrusLinearProgress />;
        }
        if (props.viewer && props.viewer.webPushServerKey) {
          registerServiceWorkerIfNeeded(props.viewer.id, props.viewer.webPushServerKey);
        }
        return <AccountInformation viewer={props.viewer} />;
      }}
    />
  );
}
