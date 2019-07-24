import React from 'react';

import { QueryRenderer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import BuildDetails from '../../components/BuildDetails';
import CirrusLinearProgress from '../../components/CirrusLinearProgress';
import NotFound from '../NotFound';

const BuildById = props => (
  <QueryRenderer
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

export default BuildById;
