import React from 'react';

import { useLazyLoadQuery, useMutation } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import AccountInformation from '../../components/account/AccountInformation';
import { ActiveRepositoriesDrawerQuery } from './__generated__/ActiveRepositoriesDrawerQuery.graphql';
import {
  ActiveRepositoriesDrawerDeleteWebPushConfigurationMutation,
  ActiveRepositoriesDrawerDeleteWebPushConfigurationMutationVariables,
} from './__generated__/ActiveRepositoriesDrawerDeleteWebPushConfigurationMutation.graphql';
import {
  ActiveRepositoriesDrawerSaveWebPushConfigurationMutation,
  ActiveRepositoriesDrawerSaveWebPushConfigurationMutationVariables,
} from './__generated__/ActiveRepositoriesDrawerSaveWebPushConfigurationMutation.graphql';

function RegisterServiceWorkerIfNeeded(userId: string, webPushServerKey: string) {
  const [commitSaveWebPushConfigurationMutation] =
    useMutation<ActiveRepositoriesDrawerSaveWebPushConfigurationMutation>(graphql`
      mutation ActiveRepositoriesDrawerSaveWebPushConfigurationMutation($input: SaveWebPushConfigurationInput!) {
        saveWebPushConfiguration(input: $input) {
          clientMutationId
        }
      }
    `);

  const [commitDeleteWebPushConfigurationMutation] =
    useMutation<ActiveRepositoriesDrawerDeleteWebPushConfigurationMutation>(graphql`
      mutation ActiveRepositoriesDrawerDeleteWebPushConfigurationMutation($input: DeleteWebPushConfigurationInput!) {
        deleteWebPushConfiguration(input: $input) {
          clientMutationId
        }
      }
    `);

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
            commitDeleteWebPushConfigurationMutation({
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
                  commitSaveWebPushConfigurationMutation({
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
  const response = useLazyLoadQuery<ActiveRepositoriesDrawerQuery>(
    graphql`
      query ActiveRepositoriesDrawerQuery {
        viewer {
          id
          webPushServerKey
          ...AccountInformation_viewer
        }
      }
    `,
    {},
  );

  if (response.viewer && response.viewer.webPushServerKey) {
    RegisterServiceWorkerIfNeeded(response.viewer.id, response.viewer.webPushServerKey);
  }
  return <AccountInformation viewer={response.viewer} />;
}
