import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import TaskDetails from '../../components/tasks/TaskDetails';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import NotFound from '../NotFound';
import { TaskQuery } from './__generated__/TaskQuery.graphql';
import { useParams } from 'react-router-dom';

export default function Task(): JSX.Element {
  let { taskId } = useParams();
  return (
    <QueryRenderer<TaskQuery>
      environment={environment}
      variables={{ taskId }}
      query={graphql`
        query TaskQuery($taskId: ID!) {
          task(id: $taskId) {
            ...TaskDetails_task
          }
          viewer {
            ...TaskDetails_viewer
          }
        }
      `}
      render={({ error, props }) => {
        if (!props) {
          return <CirrusLinearProgress />;
        }
        if (!props.task) {
          return <NotFound message={error} />;
        }
        return <TaskDetails viewer={props.viewer} task={props.task} />;
      }}
    />
  );
}
