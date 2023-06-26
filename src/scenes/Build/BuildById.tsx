import React from 'react';
import { useLazyLoadQuery } from 'react-relay';
import { useParams } from 'react-router-dom';

import { graphql } from 'babel-plugin-relay/macro';

import BuildDetails from 'components/builds/BuildDetails';
import AppBreadcrumbs from 'components/common/AppBreadcrumbs';
import NotFound from 'scenes/NotFound';

import { BuildByIdQuery } from './__generated__/BuildByIdQuery.graphql';

function BuildByIdStrict(buildId: string) {
  const response = useLazyLoadQuery<BuildByIdQuery>(
    graphql`
      query BuildByIdQuery($buildId: ID!) {
        build(id: $buildId) {
          ...BuildDetails_build
          ...AppBreadcrumbs_build
        }
        viewer {
          ...AppBreadcrumbs_viewer
        }
      }
    `,
    { buildId },
  );

  if (!response.build) {
    return <NotFound />;
  }

  return (
    <>
      <AppBreadcrumbs build={response.build} viewer={response.viewer} />
      <BuildDetails build={response.build} />
    </>
  );
}

export default function BuildById() {
  let { buildId } = useParams();

  if (!buildId) {
    return <NotFound />;
  }

  return BuildByIdStrict(buildId);
}
