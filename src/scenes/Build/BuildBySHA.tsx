import React from 'react';
import { useLazyLoadQuery } from 'react-relay';
import { useParams } from 'react-router-dom';

import { graphql } from 'babel-plugin-relay/macro';
import queryString from 'query-string';

import BuildDetails from 'components/builds/BuildDetails';
import AppBreadcrumbs from 'components/common/AppBreadcrumbs';
import NotFound from 'scenes/NotFound';

import { BuildBySHAQuery } from './__generated__/BuildBySHAQuery.graphql';

function BuildBySHAFor(owner: string, name: string, SHA: string): JSX.Element {
  const response = useLazyLoadQuery<BuildBySHAQuery>(
    graphql`
      query BuildBySHAQuery($owner: String!, $name: String!, $SHA: String) {
        searchBuilds(repositoryOwner: $owner, repositoryName: $name, SHA: $SHA) {
          branch
          ...BuildDetails_build
          ...AppBreadcrumbs_build
        }
        viewer {
          ...AppBreadcrumbs_viewer
        }
      }
    `,
    { owner, name, SHA },
  );

  if (!response.searchBuilds || response.searchBuilds.length === 0) {
    return <NotFound />;
  }
  const selectedBranch = queryString.parse(window.location.search).branch;
  for (let build of response.searchBuilds) {
    if (build.branch === selectedBranch) {
      return <BuildDetails build={build} />;
    }
  }
  return (
    <>
      <AppBreadcrumbs build={response.searchBuilds[0]} viewer={response.viewer} />
      <BuildDetails build={response.searchBuilds[0]} />
    </>
  );
}
export default function BuildBySHA() {
  let { owner, name, SHA } = useParams();

  if (!owner || !name || !SHA) {
    return <NotFound />;
  }

  return BuildBySHAFor(owner, name, SHA);
}
