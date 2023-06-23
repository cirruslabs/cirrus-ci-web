import React from 'react';
import { useLazyLoadQuery } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import mui from 'mui';

import Notification from 'components/common/Notification';
import InlineLogs from 'components/logs/InlineLogs';

import { TaskDebuggingInformationQuery } from './__generated__/TaskDebuggingInformationQuery.graphql';

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
        <mui.Typography variant="subtitle1" sx={{ pt: 2 }}>
          Agent notifications
        </mui.Typography>
        <mui.List>
          {task.executionInfo.agentNotifications.map(notification => (
            <Notification key={notification.message} notification={notification} />
          ))}
        </mui.List>
      </>
    );

  return (
    <mui.Card elevation={24}>
      <mui.CardContent>
        <mui.Typography variant="h6">Debugging Information</mui.Typography>
        <InlineLogs title="Execution events" lines={events} />
        {agentNotificationsComponent}
        {/* schema commandLogsTail*/}
        <InlineLogs title="Agent logs" lines={task.commandLogsTail} />
      </mui.CardContent>
    </mui.Card>
  );
}

export default TaskDebuggingInformation;
