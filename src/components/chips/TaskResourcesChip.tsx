import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import Memory from '@material-ui/icons/Memory';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
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
