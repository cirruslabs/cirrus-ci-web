import React from 'react';

import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Memory from '@mui/icons-material/Memory';
import {createFragmentContainer} from 'react-relay';
import {graphql} from 'babel-plugin-relay/macro';
import {makeStyles} from '@mui/styles';
import {TaskResourcesChip_task} from './__generated__/TaskResourcesChip_task.graphql';

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
  task: TaskResourcesChip_task;
  className?: string;
}

function TaskResourcesChip(props: Props) {
  let classes = useStyles();
  let { task, className } = props;
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

export default createFragmentContainer(TaskResourcesChip, {
  task: graphql`
    fragment TaskResourcesChip_task on Task {
      instanceResources {
        cpu
        memory
      }
    }
  `,
});
