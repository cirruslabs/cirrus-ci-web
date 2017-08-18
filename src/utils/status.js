export function isTaskFinalStatus(status) {
  switch (status) {
    case "EXECUTING":
      return true;
    case "COMPLETED":
      return true;
    case "FAILED":
      return true;
    default:
      return false;
  }
}
