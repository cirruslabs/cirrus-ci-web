export function navigateHelper(navigate, event, url) {
  // remove save host prefix for prod or local
  url = url.replace('https://cirrus-ci.com', '');
  if (process.env.NODE_ENV !== 'production') {
    url = url.replace('http://localhost:3333/', '');
  }

  if (event && (event.metaKey || event.ctrlKey || event.button === 1 || event.button === 4)) {
    window.open(url, '_blank');
  } /*else if (navigate && !url.includes('://')) {
    navigate(url);
  } */ else {
    window.open(url, '_self');
  }
  if (event) {
    event.stopPropagation();
  }
}

export function navigateRepositoryHelper(navigate, event, owner, name) {
  navigateHelper(navigate, event, '/github/' + owner + '/' + name);
}

export function navigateBuildHelper(navigate, event, buildId, hooks = false) {
  const suffix = hooks ? '/hooks' : '';

  navigateHelper(navigate, event, '/build/' + buildId + suffix);
}

export function navigateTaskHelper(navigate, event, taskId, hooks = false) {
  const suffix = hooks ? '/hooks' : '';

  navigateHelper(navigate, event, '/task/' + taskId + suffix);
}

export function navigateHookHelper(navigate, event, hookId) {
  navigateHelper(navigate, event, '/hook/' + hookId);
}
