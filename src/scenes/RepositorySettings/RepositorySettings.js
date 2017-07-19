import React from 'react';

import {graphql, QueryRenderer} from 'react-relay';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from "../../components/CirrusLinearProgress";
import RepositorySettingsView from "../../components/RepositorySettingsView";

const RepositorySettings = (props) => (
  <QueryRenderer
    environment={environment}
    variables={props.match.params}
    query={
      graphql`
        query RepositorySettingsQuery($repositoryId: ID!) {
          repository(id: $repositoryId) {
            ...RepositorySettingsView_repository
          }
        }
      `
    }

    render={({error, props}) => {
      if (!props) {
        return <CirrusLinearProgress />
      }
      return <RepositorySettingsView repository={props.repository}/>
    }}
  />
);

export default RepositorySettings;
