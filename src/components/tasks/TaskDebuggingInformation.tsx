import React from 'react';
import { CardContent } from '@mui/material';
import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import InlineLogs from '../logs/InlineLogs';
import environment from '../../createRelayEnvironment';
import { TaskDebuggingInformationQuery } from './__generated__/TaskDebuggingInformationQuery.graphql';

interface Props {
  taskId: string;
}

function TaskDebuggingInformation(props: Props) {
  return (
    <QueryRenderer<TaskDebuggingInformationQuery>
      environment={environment}
      variables={{ taskId: props.taskId }}
      query={graphql`
        query TaskDebuggingInformationQuery($taskId: ID!) {
          task(id: $taskId) {
            executionInfo {
              events {
                timestamp
                message
              }
            }
            commandLogsTail(name: "cirrus-agent-logs")
          }
        }
      `}
      render={response => {
        if (!response.props) {
          return null;
        }
        let task = response.props.task;
        let events = task.executionInfo?.events.map(event => {
          let prettyTime = new Date(event.timestamp).toLocaleTimeString();
          return `${prettyTime} ${event.message}`;
        });
        return (
          <Card elevation={24}>
            <CardContent>
              <Typography variant="h6">Debugging Information</Typography>
              <InlineLogs title="Execution events" lines={events} />
              <InlineLogs title="Agent logs" lines={task.commandLogsTail} />
            </CardContent>
          </Card>
        );
      }}
    />
  );
}

export default TaskDebuggingInformation;
