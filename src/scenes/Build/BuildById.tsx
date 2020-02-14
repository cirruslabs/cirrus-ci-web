import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import BuildDetails from '../../components/builds/BuildDetails';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import NotFound from '../NotFound';
import { RouteComponentProps } from 'react-router';
import { BuildByIdQuery } from './__generated__/BuildByIdQuery.graphql';

interface MatchParams {
  buildId: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

export default (props: Props) => (
  <QueryRenderer<BuildByIdQuery>
    environment={environment}
    variables={props.match.params}
    query={graphql`
      query BuildByIdQuery($buildId: ID!) {
        build(id: $buildId) {
          ...BuildDetails_build
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
      return <BuildDetails build={props.build} />;
    }}
  />
);
