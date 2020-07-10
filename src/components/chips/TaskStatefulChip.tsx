import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import SecurityIcon from '@material-ui/icons/Security';
import { graphql } from 'babel-plugin-relay/macro';
import { cirrusColors } from '../../cirrusTheme';
import { withTheme, WithTheme } from '@material-ui/core/styles';
import { TaskStatefulChip_task } from './__generated__/TaskStatefulChip_task.graphql';
import { createFragmentContainer } from 'react-relay';

interface Props extends WithTheme {
  task: TaskStatefulChip_task;
  className?: string;
}

class TaskStatefulChip extends React.Component<Props> {
  render() {
    let { task } = this.props;
    let { stateful } = task;
    if (!stateful) return <div />;
    return (
      <Chip
        className={this.props.className}
        label="Stateful"
        avatar={
          <Avatar style={{ backgroundColor: cirrusColors.success }}>
            <SecurityIcon style={{ color: this.props.theme.palette.background.paper }} />
          </Avatar>
        }
      />
    );
  }
}

export default createFragmentContainer(withTheme(TaskStatefulChip), {
  task: graphql`
    fragment TaskStatefulChip_task on Task {
      stateful
    }
  `,
});
