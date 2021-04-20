export function navigate(history, event, url) {
  // remove save host prefix for prod or local
  url = url.replace('https://cirrus-ci.com', '');
  if (process.env.NODE_ENV !== 'production') {
    url = url.replace('http://localhost:3333/', '');
  }

  if (event && (event.metaKey || event.ctrlKey || event.button === 1 || event.button === 4)) {
    window.open(url, '_blank');
  } else if (history && !url.includes('://')) {
    history.push(url);
  } else {
    window.open(url, '_self');
  }
  if (event) {
    event.stopPropagation();
  }
}

export function navigateRepository(history, event, owner, name) {
  navigate(history, event, '/github/' + owner + '/' + name);
}

export function navigateBuild(history, event, buildId) {
  navigate(history, event, '/build/' + buildId);
}

export function navigateTask(history, event, taskId) {
  navigate(history, event, '/task/' + taskId);
}

export function navigateHook(history, event, hookId) {
  navigate(history, event, '/hook/' + hookId);
}
