import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import RepositorySettingsPage from '../../components/repositories/RepositorySettingsPage';
import NotFound from '../NotFound';
import { RepositorySettingsQuery } from './__generated__/RepositorySettingsQuery.graphql';
import { useParams } from 'react-router-dom';

export default () => {
  let { repositoryId } = useParams();
  return (
    <QueryRenderer<RepositorySettingsQuery>
      environment={environment}
      variables={{ repositoryId }}
      query={graphql`
        query RepositorySettingsQuery($repositoryId: ID!) {
          repository(id: $repositoryId) {
            ...RepositorySettingsPage_repository
          }
        }
      `}
      render={({ error, props }) => {
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
};
