import { RepositoryMetricsPage_repository } from './__generated__/RepositoryMetricsPage_repository.graphql';

export enum Status {
  VERY_HEALTHY,
  HEALTHY,
  PARTIALLY,
  UNHEALTHY,
}

interface IHealthResult {
  status: Status;
  passed: number;
}

export function getHealthValue(repository: RepositoryMetricsPage_repository): IHealthResult {
  let passed = 0;

  repository.builds.edges
    .map(edge => edge.node)
    .forEach(serializedBuild => {
      if (!['ABORTED', 'ERRORED', 'FAILED'].includes(serializedBuild.status)) {
        passed += 1;
      }
    });

  let s: Status;

  if (passed >= 45) {
    s = Status.VERY_HEALTHY;
  } else if (passed >= 35) {
    s = Status.HEALTHY;
  } else if (passed >= 20) {
    s = Status.PARTIALLY;
  } else {
    s = Status.UNHEALTHY;
  }

  return { status: s, passed };
}
