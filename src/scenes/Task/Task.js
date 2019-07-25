import React from 'react';

import { QueryRenderer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import TaskDetails from '../../components/TaskDetails';
import CirrusLinearProgress from '../../components/CirrusLinearProgress';
import NotFound from '../NotFound';

const Task = props => (
  <QueryRenderer
    environment={environment}
    variables={props.match.params}
    query={graphql`
      query TaskQuery($taskId: ID!) {
        task(id: $taskId) {
          ...TaskDetails_task
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
      return <TaskDetails task={props.task} />;
    }}
  />
);

export default Task;
