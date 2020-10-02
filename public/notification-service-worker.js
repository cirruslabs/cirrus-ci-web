self.addEventListener(
  'push',
  /** @param {PushEvent} e */ function (e) {
    // same as webhook event but without `action`: https://cirrus-ci.org/api/#webhooks
    const data = e.data.json();

    /** @type {NotificationOptions} */
    const notificationOptions = {
      body: data.build.changeMessageTitle,
      data: {
        dateOfArrival: Date.now(),
      },
      actions: [
        {
          action: 'close',
          title: 'Close',
        },
      ],
    };
    let title = '';
    switch (data.build.status) {
      case 'FAILED':
        notificationOptions.icon = '/images/logo-failure.png';
        if (data.task && data.task.name) {
          title = `${data.repository.name} build failed!`;
          notificationOptions.body = `Task "${data.task.name}" failed on "${data.build.branch}" branch!\n${data.build.changeMessageTitle}`;
          notificationOptions.data['link'] = `/task/${data.task.id}`;
        } else {
          title = `${data.repository.name} build failed!`;
          notificationOptions.body = `"${data.build.branch}" branch build failed!\n${data.build.changeMessageTitle}`;
          notificationOptions.data['link'] = `/build/${data.build.id}`;
        }
        break;
      case 'ERRORED':
        title = `${data.repository.name} build errored!`;
        notificationOptions.body = `"${data.build.branch}" branch build errored!\n${data.build.changeMessageTitle}`;
        notificationOptions.icon = '/images/logo-failure.png';
        notificationOptions.data['link'] = `/build/${data.build.id}`;
        break;
      default:
        return;
    }
    e.waitUntil(self.registration.showNotification(title, notificationOptions));
  },
);

self.addEventListener(
  'notificationclick',
  /** @param {NotificationEvent} event */ function (event) {
    const data = event.notification.data;

    event.notification.close();

    if (event.action === '' && data.link) {
      self.clients.openWindow(data.link).then(windowClient => (windowClient ? windowClient.focus() : null));
    }
  },
);
