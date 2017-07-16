import React from 'react';

import {graphql, QueryRenderer} from 'react-relay';

import environment from '../../createRelayEnvironment';
import TaskDetails from '../../components/TaskDetails'
import CirrusLinearProgress from "../../components/CirrusLinearProgress";

const Task = (props) => (
  <QueryRenderer
    environment={environment}
    variables={props.match.params}
    query={
      graphql`
        query TaskQuery($taskId: ID!) {
          task(id: $taskId) {
            ...TaskDetails_task
          }
        }
      `
    }

    render={({error, props}) => {
      if (!props) {
        return <CirrusLinearProgress />
      }
      return <TaskDetails task={props.task}/>
    }}
  />
);

export default Task;
