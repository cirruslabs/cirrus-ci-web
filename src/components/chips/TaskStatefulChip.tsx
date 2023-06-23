import React from 'react';
import { useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import SecurityIcon from '@mui/icons-material/Security';
import { useTheme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

import { TaskStatefulChip_task$key } from './__generated__/TaskStatefulChip_task.graphql';

interface Props {
  task: TaskStatefulChip_task$key;
  className?: string;
}

export default function TaskStatefulChip(props: Props) {
  let task = useFragment(
    graphql`
      fragment TaskStatefulChip_task on Task {
        stateful
      }
    `,
    props.task,
  );

  let theme = useTheme();

  let { stateful } = task;
  if (!stateful) return <div />;

  return (
    <Chip
      className={props.className}
      label="Stateful"
      avatar={
        <Avatar style={{ backgroundColor: theme.palette.info.main }}>
          <SecurityIcon style={{ color: theme.palette.primary.contrastText }} />
        </Avatar>
      }
    />
  );
}
