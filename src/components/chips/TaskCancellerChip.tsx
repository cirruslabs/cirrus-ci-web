import React from 'react';

import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

import { useFragment } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { TaskCancellerChip_task$key } from './__generated__/TaskCancellerChip_task.graphql';

interface Props {
  task: TaskCancellerChip_task$key;
  className?: string;
}

export default function TaskCancellerChip(props: Props) {
  let task = useFragment(
    graphql`
      fragment TaskCancellerChip_task on Task {
        cancelledBy {
          avatarURL
        }
      }
    `,
    props.task,
  );

  let { cancelledBy } = task;

  if (!cancelledBy) return <></>;

  return (
    <Chip className={props.className} label="Cancelled by a user" avatar={<Avatar src={cancelledBy.avatarURL} />} />
  );
}
