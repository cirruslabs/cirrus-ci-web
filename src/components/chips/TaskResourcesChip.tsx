import React from 'react';
import { useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import Memory from '@mui/icons-material/Memory';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { makeStyles } from '@mui/styles';

import { TaskResourcesChip_task$key } from './__generated__/TaskResourcesChip_task.graphql';

const useStyles = makeStyles(theme => {
  return {
    avatar: {
      backgroundColor: theme.palette.primary.main,
    },
    avatarIcon: {
      color: theme.palette.primary.contrastText,
    },
  };
});

interface Props {
  task: TaskResourcesChip_task$key;
  className?: string;
}

export default function TaskResourcesChip(props: Props) {
  let task = useFragment(
    graphql`
      fragment TaskResourcesChip_task on Task {
        instanceResources {
          cpu
          memory
        }
      }
    `,
    props.task,
  );

  let classes = useStyles();
  let { className } = props;
  let resources = task.instanceResources;
  if (!resources) {
    return null;
  }
  let cpuPart = resources.cpu === 1.0 ? `1 CPU` : `${resources.cpu} CPUs`;
  let memoryPart = resources.memory === 1024 ? `1 GB` : `${resources.memory / 1024.0} GBs`;
  return (
    <Tooltip title="Task Resources">
      <Chip
        className={className}
        label={`${cpuPart} / ${memoryPart}`}
        avatar={
          <Avatar className={classes.avatar}>
            <Memory className={classes.avatarIcon} />
          </Avatar>
        }
      />
    </Tooltip>
  );
}
