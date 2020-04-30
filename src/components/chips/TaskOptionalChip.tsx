import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Report from '@material-ui/icons/Report';

import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { cirrusColors } from '../../cirrusTheme';

function TaskOptionalChip(props) {
  let { task } = props;
  let { optional } = task;
  if (!optional) return <div />;
  return (
    <Chip
      className={props.className}
      label="optional"
      avatar={
        <Avatar style={{ backgroundColor: cirrusColors.lightWarning }}>
          <Report style={{ color: cirrusColors.cirrusWhite }} />
        </Avatar>
      }
    />
  );
}

export default createFragmentContainer(TaskOptionalChip, {
  task: graphql`
    fragment TaskOptionalChip_task on Task {
      optional
    }
  `,
});
