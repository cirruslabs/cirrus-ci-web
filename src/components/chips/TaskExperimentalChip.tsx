import React from 'react';
import { useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import CasinoIcon from '@mui/icons-material/Casino';
import { useTheme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

import { TaskExperimentalChip_task$key } from './__generated__/TaskExperimentalChip_task.graphql';

interface Props {
  className?: string;
  task: TaskExperimentalChip_task$key;
}

export default function TaskExperimentalChip(props: Props) {
  let task = useFragment(
    graphql`
      fragment TaskExperimentalChip_task on Task {
        experimental
      }
    `,
    props.task,
  );

  let theme = useTheme();
  const { experimental } = task;

  if (!experimental) return <div />;

  return (
    <Chip
      className={props.className}
      label="Experimental"
      avatar={
        <Avatar style={{ backgroundColor: theme.palette.info.main }}>
          <CasinoIcon style={{ color: theme.palette.primary.contrastText }} />
        </Avatar>
      }
    />
  );
}
