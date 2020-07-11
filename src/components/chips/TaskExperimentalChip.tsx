import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import CasinoIcon from '@material-ui/icons/Casino';

import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { cirrusColors } from '../../cirrusTheme';
import { WithTheme, withTheme } from '@material-ui/core/styles';
import { TaskExperimentalChip_task } from './__generated__/TaskExperimentalChip_task.graphql';

interface Props extends WithTheme {
  className?: string;
  task: TaskExperimentalChip_task;
}

class TaskExperimentalChip extends React.Component<Props> {
  render() {
    let { task } = this.props;
    let { experimental } = task;
    if (!experimental) return <div />;
    return (
      <Chip
        className={this.props.className}
        label="Experimental"
        avatar={
          <Avatar style={{ backgroundColor: cirrusColors.success }}>
            <CasinoIcon style={{ color: this.props.theme.palette.background.paper }} />
          </Avatar>
        }
      />
    );
  }
}

export default createFragmentContainer(withTheme(TaskExperimentalChip), {
  task: graphql`
    fragment TaskExperimentalChip_task on Task {
      experimental
    }
  `,
});
