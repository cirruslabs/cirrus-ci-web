import React from 'react';

import {graphql, QueryRenderer} from 'react-relay';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from "../../components/CirrusLinearProgress";
import RepositorySettingsPage from "../../components/RepositorySettingsPage";

const RepositorySettings = (props) => (
  <QueryRenderer
    environment={environment}
    variables={props.match.params}
    query={
      graphql`
        query RepositorySettingsQuery($repositoryId: ID!) {
          repository(id: $repositoryId) {
            ...RepositorySettingsPage_repository
          }
        }
      `
    }

    render={({error, props}) => {
      if (!props) {
        return <CirrusLinearProgress/>
      }
      return <RepositorySettingsPage repository={props.repository}/>
    }}
  />
);

export default RepositorySettings;
