import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import SecurityIcon from '@material-ui/icons/Security';

import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { cirrusColors } from '../../cirrusTheme';

function TaskStatefulChip(props) {
  let { task } = props;
  let { stateful } = task;
  if (!stateful) return <div />;
  return (
    <Chip
      className={props.className}
      label="Stateful"
      avatar={
        <Avatar style={{ backgroundColor: cirrusColors.success }}>
          <SecurityIcon style={{ color: cirrusColors.cirrusWhite }} />
        </Avatar>
      }
    />
  );
}

export default createFragmentContainer(TaskStatefulChip, {
  task: graphql`
    fragment TaskStatefulChip_task on Task {
      stateful
    }
  `,
});
