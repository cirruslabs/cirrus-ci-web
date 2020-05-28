/**
 * Alert the user if they use less then half the requested CPUs.
 */
export function requiresCpuAlert(requested: number, usages: number[]): boolean {
  let usedMoreThanFiftyPercent = false;
  usages.forEach(use => {
    if (Math.floor(use) >= Math.ceil(requested) / 2) {
      usedMoreThanFiftyPercent = true;
    }
  });
  return !usedMoreThanFiftyPercent;
}
