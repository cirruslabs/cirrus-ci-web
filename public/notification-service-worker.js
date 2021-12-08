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

    switch (data.type) {
      case 'BUILD_STATUS':
        handleBuildStatus(notificationOptions, data);
        break;
      case 'TERMINAL_LIFECYCLE':
        handleTerminalLifecycle(notificationOptions, data);
        break;
      default:
        return;
    }
  },
);

function handleBuildStatus(notificationOptions, data) {
  let title = '';

  switch (data.build.status) {
    case 'COMPLETED':
      title = `${data.repository.name} build succeeded!`;
      notificationOptions.body = `"${data.build.branch}" branch build succeeded!\n${data.build.changeMessageTitle}`;
      notificationOptions.icon = '/images/logo-success.png';
      notificationOptions.data['link'] = `/build/${data.build.id}`;
      break;
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
}

function handleTerminalLifecycle(notificationOptions, data) {
  let title = '';

  switch (data.terminalLifecycle.type) {
    case 'STARTED':
      title = `Cirrus Terminal has been attached`;
      notificationOptions.body = `Cirrus Terminal has been attached for task ${data.task.name}`;
      notificationOptions.icon = '/images/logo-success.png';
      notificationOptions.data['link'] = `/task/${data.task.id}`;
      break;
    case 'EXPIRING':
      title = `Cirrus Terminal is about to terminate`;
      notificationOptions.body = `Cirrus Terminal is about to terminate for task ${data.task.name}`;
      notificationOptions.icon = '/images/logo-success.png';
      notificationOptions.data['link'] = `/task/${data.task.id}`;
      break;
    default:
      return;
  }

  e.waitUntil(self.registration.showNotification(title, notificationOptions));
}

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
