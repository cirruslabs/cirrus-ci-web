import React from 'react';

import {graphql, QueryRenderer} from 'react-relay';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from "../../components/CirrusLinearProgress";
import RepositoryList from "../../components/RepositoryList";

const Repository = (props) => {
  return <QueryRenderer
    environment={environment}
    variables={props.match.params}
    query={
      graphql`
        query GitHubOwnerRepositoriesQuery($owner: String!) {
          githubRepositories(owner: $owner) {
            ...LastDefaultBranchBuildRow_repository
          }
        }
      `
    }

    render={({error, props}) => {
      if (!props) {
        return <CirrusLinearProgress/>
      }
      return <RepositoryList repositories={props.githubRepositories}/>
    }}
  />
};

export default Repository;
