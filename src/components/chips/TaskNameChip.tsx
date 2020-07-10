import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Bookmark from '@material-ui/icons/Bookmark';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { TaskNameChip_task } from './__generated__/TaskNameChip_task.graphql';

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
}

class TaskNameChip extends React.Component<Props> {
  render() {
    let { task, className } = this.props;
    return (
      <Chip
        className={className}
        label={task.name}
        onClick={() => {
          /* this empty handler helps Vimium (http://vimium.github.io/) to recognize that task names are clickable */
        }}
        avatar={
          <Avatar className={this.props.classes.avatar}>
            <Bookmark className={this.props.classes.avatarIcon} />
          </Avatar>
        }
      />
    );
  }
}

export default createFragmentContainer(withStyles(styles)(TaskNameChip), {
  task: graphql`
    fragment TaskNameChip_task on Task {
      name
    }
  `,
});
