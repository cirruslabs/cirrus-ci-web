import React from 'react';

import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Memory from '@mui/icons-material/Memory';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import { TaskResourcesChip_task } from './__generated__/TaskResourcesChip_task.graphql';

const styles = theme =>
  createStyles({
    avatar: {
      backgroundColor: theme.palette.primary.main,
    },
    avatarIcon: {
      color: theme.palette.primary.contrastText,
    },
  });

interface Props extends WithStyles<typeof styles> {
  task: TaskResourcesChip_task;
  className?: string;
}

function TaskResourcesChip(props: Props) {
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
          <Avatar className={props.classes.avatar}>
            <Memory className={props.classes.avatarIcon} />
          </Avatar>
        }
      />
    </Tooltip>
  );
}

export default createFragmentContainer(withStyles(styles)(TaskResourcesChip), {
  task: graphql`
    fragment TaskResourcesChip_task on Task {
      instanceResources {
        cpu
        memory
      }
    }
  `,
});
