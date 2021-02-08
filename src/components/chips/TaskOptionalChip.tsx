import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Report from '@material-ui/icons/Report';

import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { cirrusColorsState } from '../../cirrusTheme';
import { WithTheme, withTheme } from '@material-ui/core/styles';
import { TaskOptionalChip_task } from './__generated__/TaskOptionalChip_task.graphql';
import { useRecoilValue } from 'recoil';

interface Props extends WithTheme {
  task: TaskOptionalChip_task;
  className?: string;
}

class TaskOptionalChip extends React.Component<Props> {
  render() {
    let { task } = this.props;
    let { optional } = task;
    if (!optional) return <div />;

    const cirrusColors = useRecoilValue(cirrusColorsState);

    return (
      <Chip
        className={this.props.className}
        label="Optional"
        avatar={
          <Avatar style={{ backgroundColor: cirrusColors.lightWarning }}>
            <Report style={{ color: this.props.theme.palette.background.paper }} />
          </Avatar>
        }
      />
    );
  }
}

export default createFragmentContainer(withTheme(TaskOptionalChip), {
  task: graphql`
    fragment TaskOptionalChip_task on Task {
      optional
    }
  `,
});
