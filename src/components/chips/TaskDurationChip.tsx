import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Icon from '@mui/material/Icon';
import { graphql } from 'babel-plugin-relay/macro';
import React, { useEffect } from 'react';
import { createFragmentContainer, requestSubscription } from 'react-relay';
import environment from '../../createRelayEnvironment';
import { useTaskStatusColor } from '../../utils/colors';
import { isTaskFinalStatus, isTaskInProgressStatus, taskStatusIconName } from '../../utils/status';
import { formatDuration } from '../../utils/time';
import { TaskDurationChip_task } from './__generated__/TaskDurationChip_task.graphql';
import { useTheme } from '@mui/material';

const taskSubscription = graphql`
  subscription TaskDurationChipSubscription($taskID: ID!) {
    task(id: $taskID) {
      ...TaskDurationChip_task
    }
  }
`;

interface Props {
  task: TaskDurationChip_task;
  className?: string;
}

function TaskDurationChip(props: Props) {
  let theme = useTheme();

  useEffect(() => {
    if (isTaskFinalStatus(props.task.status)) {
      return;
    }

    let variables = { taskID: props.task.id };

    const subscription = requestSubscription(environment, {
      subscription: taskSubscription,
      variables: variables,
    });
    return () => {
      subscription.dispose();
    };
  }, [props.task.id, props.task.status]);

  const [now, setNow] = React.useState(Date.now());

  useEffect(() => {
    if (isTaskFinalStatus(props.task.status)) {
      return;
    }
    const timeoutId = setInterval(() => {
      setNow(Date.now());
    }, 1_000);
    return () => clearInterval(timeoutId);
  }, [now, props.task.status]);

  let { task, className } = props;

  let durationInSeconds = task.durationInSeconds;
  if (!isTaskInProgressStatus(task.status) && !isTaskFinalStatus(task.status)) {
    durationInSeconds = 0;
  } else if (!isTaskFinalStatus(task.status)) {
    let timestamp = Math.max(task.creationTimestamp, task.scheduledTimestamp, task.executingTimestamp);
    durationInSeconds = (Date.now() - timestamp) / 1000;
  }

  return (
    <Chip
      className={className}
      label={formatDuration(durationInSeconds)}
      avatar={
        <Avatar style={{ background: useTaskStatusColor(task.status) }}>
          <Icon style={{ color: theme.palette.primary.contrastText }}>{taskStatusIconName(task.status)}</Icon>
        </Avatar>
      }
    />
  );
}

export default createFragmentContainer(TaskDurationChip, {
  task: graphql`
    fragment TaskDurationChip_task on Task {
      id
      status
      creationTimestamp
      scheduledTimestamp
      executingTimestamp
      durationInSeconds
    }
  `,
});
