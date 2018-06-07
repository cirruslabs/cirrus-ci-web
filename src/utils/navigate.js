export function navigate(router, event, url) {
  if (event && event.metaKey) {
    window.open(url, '_blank');
  } else if (router) {
    router.history.push(url)
  } else {
    window.open(url, "_self");
  }
  if (event) {
    event.stopPropagation();
  }
}

export function navigateRepository(router, event, owner, name) {
  navigate(router, event, "/github/" + owner + "/" + name)
}

export function navigateBuild(router, event, buildId) {
  navigate(router, event, "/build/" + buildId)
}

export function navigateTask(router, event, taskId) {
  navigate(router, event, "/task/" + taskId)
}
