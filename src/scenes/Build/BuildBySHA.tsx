import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import BuildDetails from '../../components/BuildDetails';
import CirrusLinearProgress from '../../components/CirrusLinearProgress';
import NotFound from '../NotFound';
import { BuildBySHAQuery } from './__generated__/BuildBySHAQuery.graphql';

export default props => (
  <QueryRenderer<BuildBySHAQuery>
    environment={environment}
    variables={props.match.params}
    query={graphql`
      query BuildBySHAQuery($owner: String!, $name: String!, $SHA: String) {
        searchBuilds(repositoryOwner: $owner, repositoryName: $name, SHA: $SHA) {
          ...BuildDetails_build
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
      return <BuildDetails build={props.searchBuilds[0]} />;
    }}
  />
);
