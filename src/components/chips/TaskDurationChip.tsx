import React, { useEffect, useMemo } from 'react';
import { useFragment, requestSubscription } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import { useTheme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Icon from '@mui/material/Icon';

import environment from 'createRelayEnvironment';

import { useTaskStatusColor } from 'utils/colors';
import { isTaskFinalStatus, isTaskInProgressStatus, taskStatusIconName } from 'utils/status';
import { formatDuration } from 'utils/time';

import { TaskDurationChip_task$key } from './__generated__/TaskDurationChip_task.graphql';

const taskSubscription = graphql`
  subscription TaskDurationChipSubscription($taskID: ID!) {
    task(id: $taskID) {
      ...TaskDurationChip_task
    }
  }
`;

interface Props {
  task: TaskDurationChip_task$key;
  className?: string;
}

export default function TaskDurationChip(props: Props) {
  let task = useFragment(
    graphql`
      fragment TaskDurationChip_task on Task {
        id
        status
        creationTimestamp
        scheduledTimestamp
        executingTimestamp
        durationInSeconds
      }
    `,
    props.task,
  );

  let theme = useTheme();

  const isFinalStatus = useMemo(() => isTaskFinalStatus(task.status), [task.status]);
  useEffect(() => {
    if (isFinalStatus) {
      return;
    }

    let variables = { taskID: task.id };

    const subscription = requestSubscription(environment, {
      subscription: taskSubscription,
      variables: variables,
    });
    return () => {
      subscription.dispose();
    };
  }, [task.id, isFinalStatus]);

  const [now, setNow] = React.useState(Date.now());

  useEffect(() => {
    if (isFinalStatus) {
      return;
    }
    const timeoutId = setInterval(() => {
      setNow(Date.now());
    }, 1_000);
    return () => clearInterval(timeoutId);
  }, [now, isFinalStatus]);

  let { className } = props;

  let durationInSeconds = task.durationInSeconds;
  if (!isTaskInProgressStatus(task.status) && !isFinalStatus) {
    durationInSeconds = 0;
  } else if (!isFinalStatus) {
    let timestamp = Math.max(task.creationTimestamp, task.scheduledTimestamp || 0, task.executingTimestamp || 0);
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
