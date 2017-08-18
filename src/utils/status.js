export function isTaskFinalStatus(status) {
  switch (status) {
    case "ABORTED":
      return true;
    case "COMPLETED":
      return true;
    case "FAILED":
      return true;
    default:
      return false;
  }
}
