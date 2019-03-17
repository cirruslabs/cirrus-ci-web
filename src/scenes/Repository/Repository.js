import React from 'react';

import {graphql, QueryRenderer} from 'react-relay';

import environment from '../../createRelayEnvironment';
import ReactMarkdown from 'react-markdown';
import RepositoryBuildList from '../../components/RepositoryBuildList'
import CirrusLinearProgress from "../../components/CirrusLinearProgress";
import NotFound from "../NotFound";

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
        let notFoundMessage =
          <ReactMarkdown
            source="Repository not found! Please [install Cirrus CI](https://cirrus-ci.org/guide/quick-start/) or push [`.cirrus.yml`!](https://cirrus-ci.org/guide/writing-tasks/)."/>;
        return <NotFound messageComponent={notFoundMessage}/>
      }
      return <RepositoryBuildList repository={props.repository}/>
    }}
  />
);

export default Repository;
