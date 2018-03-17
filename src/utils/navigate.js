export function navigate(router, event, url) {
  if (event && event.metaKey) {
    window.open(url, '_blank');
  } else {
    router.history.push(url)
  }
}

export function navigateBuild(router, event, buildId) {
  navigate(router, event, "/build/" + buildId)
}

export function navigateTask(router, event, taskId) {
  navigate(router, event, "/task/" + taskId)
}
