import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from '../../components/CirrusLinearProgress';
import RepositorySettingsPage from '../../components/RepositorySettingsPage';
import NotFound from '../NotFound';

const RepositorySettings = props => (
  <QueryRenderer
    environment={environment}
    variables={props.match.params}
    query={graphql`
      query RepositorySettingsQuery($repositoryId: ID!) {
        repository(id: $repositoryId) {
          ...RepositorySettingsPage_repository
        }
      }
    `}
    render={({ error, props }: any) => {
      if (!props) {
        return <CirrusLinearProgress />;
      }
      if (!props.repository) {
        return <NotFound message={error} />;
      }
      return <RepositorySettingsPage repository={props.repository} />;
    }}
  />
);

export default RepositorySettings;
