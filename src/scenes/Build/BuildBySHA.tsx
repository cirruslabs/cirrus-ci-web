import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import BuildDetails from '../../components/builds/BuildDetails';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import NotFound from '../NotFound';
import { BuildBySHAQuery } from './__generated__/BuildBySHAQuery.graphql';
import * as queryString from 'query-string';
import { useParams } from 'react-router-dom';
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs';

export default function BuildBySHA() {
  let { owner, name, SHA } = useParams();
  return (
    <QueryRenderer<BuildBySHAQuery>
      environment={environment}
      variables={{ owner, name, SHA }}
      query={graphql`
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
      `}
      render={({ error, props }) => {
        if (!props) {
          return <CirrusLinearProgress />;
        }
        if (!props.searchBuilds || props.searchBuilds.length === 0) {
          return <NotFound message={error} />;
        }
        const selectedBranch = queryString.parse(window.location.search).branch;
        for (let build of props.searchBuilds) {
          if (build.branch === selectedBranch) {
            return <BuildDetails build={build} />;
          }
        }
        return (
          <>
            <AppBreadcrumbs build={props.searchBuilds[0]} viewer={props.viewer} />
            <BuildDetails build={props.searchBuilds[0]} />
          </>
        );
      }}
    />
  );
}
