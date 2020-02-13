export function navigate(router, event, url) {
  // remove save host prefix for prod or local
  url = url.replace('https://cirrus-ci.com', '');
  if (process.env.NODE_ENV !== 'production') {
    url = url.replace('http://localhost:3333/', '');
  }

  if (event && (event.metaKey || event.ctrlKey || event.button === 1)) {
    window.open(url, '_blank');
  } else if (router && !url.includes('://')) {
    router.history.push(url);
  } else {
    window.open(url, '_self');
  }
  if (event) {
    event.stopPropagation();
  }
}

export function navigateRepository(router, event, owner, name) {
  navigate(router, event, '/github/' + owner + '/' + name);
}

export function navigateBuild(router, event, buildId) {
  navigate(router, event, '/build/' + buildId);
}

export function navigateTask(router, event, taskId) {
  navigate(router, event, '/task/' + taskId);
}
