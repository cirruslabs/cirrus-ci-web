import React from 'react';

import {graphql, QueryRenderer} from 'react-relay';

import environment from '../../createRelayEnvironment';
import ReactMarkdown from 'react-markdown';
import RepositoryBuildList from '../../components/RepositoryBuildList'
import CirrusLinearProgress from "../../components/CirrusLinearProgress";

const Repository = (props) => {
  let branch = props.match.params.branch;
  return <QueryRenderer
    environment={environment}
    variables={props.match.params}
    query={
      graphql`
        query GitHubRepositoryQuery($owner: String!, $name: String!, $branch: String) {
          githubRepository(owner: $owner, name: $name) {
            ...RepositoryBuildList_repository
          }
        }
      `
    }

    render={({error, props}) => {
      if (!props) {
        return <CirrusLinearProgress/>
      }
      if (!props.githubRepository) {
        return <ReactMarkdown source="Not found! Probably, you want to [install Cirrus CI first](https://cirrus-ci.org/guide/quick-start/)! Or push [`.cirrus.yml` configuration file!](https://cirrus-ci.org/guide/writing-tasks/)."/>
      }
      return <RepositoryBuildList repository={props.githubRepository} branch={branch}/>
    }}
  />
};

export default Repository;
