import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Bookmark from '@material-ui/icons/Bookmark';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { TaskNameChip_task } from './__generated__/TaskNameChip_task.graphql';
import { navigateTask } from '../../utils/navigate';
import { useHistory } from 'react-router-dom';

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
  task: TaskNameChip_task;
  className?: string;
  withNavigation?: boolean;
}

let TaskNameChip = (props: Props) => {
  const { task, className, classes } = props;
  let history = useHistory();

  // We use the empty handler when we won't the navigation to happen, yet it helps e.g. Vimium (http://vimium.github.io/)
  // to recognize that task names are clickable and thus improves accessibility.
  var onClickFunc = props.withNavigation ? e => navigateTask(history, e, task.id) : () => {};

  return (
    <Chip
      className={className}
      label={task.name}
      onClick={onClickFunc}
      avatar={
        <Avatar className={classes.avatar}>
          <Bookmark className={classes.avatarIcon} />
        </Avatar>
      }
    />
  );
};

export default createFragmentContainer(withStyles(styles)(TaskNameChip), {
  task: graphql`
    fragment TaskNameChip_task on Task {
      id
      name
    }
  `,
});
