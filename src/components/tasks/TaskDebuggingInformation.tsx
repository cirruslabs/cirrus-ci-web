import React from 'react';
import { CardContent, List } from '@mui/material';
import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import InlineLogs from '../logs/InlineLogs';
import { TaskDebuggingInformationQuery } from './__generated__/TaskDebuggingInformationQuery.graphql';
import Notification from '../common/Notification';

interface Props {
  taskId: string;
}

function TaskDebuggingInformation(props: Props) {
  const response = useLazyLoadQuery<TaskDebuggingInformationQuery>(
    graphql`
      query TaskDebuggingInformationQuery($taskId: ID!) {
        task(id: $taskId) {
          executionInfo {
            events {
              timestamp
              message
            }
            agentNotifications {
              message
              ...Notification_notification
            }
          }
          commandLogsTail(name: "cirrus-agent-logs")
        }
      }
    `,
    { taskId: props.taskId },
  );

  if (!response.task) {
    return null;
  }

  let task = response.task;

  let events =
    task.executionInfo?.events?.map(event => {
      let prettyTime = new Date(event.timestamp).toLocaleTimeString();
      return `${prettyTime} ${event.message}`;
    }) || [];

  const agentNotificationsComponent =
    !task.executionInfo ||
    !task.executionInfo.agentNotifications ||
    task.executionInfo.agentNotifications.length === 0 ? null : (
      <>
        <Typography variant="subtitle1" sx={{ pt: 2 }}>
          Agent notifications
        </Typography>
        <List>
          {task.executionInfo.agentNotifications.map(notification => (
            <Notification key={notification.message} notification={notification} />
          ))}
        </List>
      </>
    );

  return (
    <Card elevation={24}>
      <CardContent>
        <Typography variant="h6">Debugging Information</Typography>
        <InlineLogs title="Execution events" lines={events} />
        {agentNotificationsComponent}
        {/* schema commandLogsTail*/}
        <InlineLogs title="Agent logs" lines={task.commandLogsTail} />
      </CardContent>
    </Card>
  );
}

export default TaskDebuggingInformation;
