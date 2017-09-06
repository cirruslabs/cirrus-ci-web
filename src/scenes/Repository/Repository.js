import React from 'react';

import {graphql, QueryRenderer} from 'react-relay';

import environment from '../../createRelayEnvironment';
import RepositoryBuildList from '../../components/RepositoryBuildList'
import CirrusLinearProgress from "../../components/CirrusLinearProgress";

const Repository = (props) => (
  <QueryRenderer
    environment={environment}
    variables={props.match.params}
    query={
      graphql`
        query RepositoryQuery($repositoryId: ID!, $branch: String) {
          repository(id: $repositoryId) {
            ...RepositoryBuildList_repository
          }
        }
      `
    }

    render={({error, props}) => {
      if (!props) {
        return <CirrusLinearProgress/>
      }
      if (!props.repository) {
        return <p>Not found</p>
      }
      return <RepositoryBuildList repository={props.repository}/>
    }}
  />
);

export default Repository;
