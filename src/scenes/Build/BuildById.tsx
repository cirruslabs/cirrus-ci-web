import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import BuildDetails from '../../components/builds/BuildDetails';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import NotFound from '../NotFound';
import { BuildByIdQuery } from './__generated__/BuildByIdQuery.graphql';
import { useParams } from 'react-router-dom';
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs';

export default function BuildById(): JSX.Element {
  let { buildId } = useParams();
  return (
    <QueryRenderer<BuildByIdQuery>
      environment={environment}
      variables={{ buildId }}
      query={graphql`
        query BuildByIdQuery($buildId: ID!) {
          build(id: $buildId) {
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
        if (!props.build) {
          return <NotFound message={error} />;
        }
        return (
          <>
            <AppBreadcrumbs build={props.build} viewer={props.viewer} />
            <BuildDetails build={props.build} />
          </>
        );
      }}
    />
  );
}
