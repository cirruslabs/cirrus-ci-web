import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import CasinoIcon from '@material-ui/icons/Casino';

import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { cirrusColors } from '../../cirrusTheme';

function TaskExperimentalChip(props) {
  let { task } = props;
  let { experimental } = task;
  if (!experimental) return <div />;
  return (
    <Chip
      className={props.className}
      label="Experimental"
      avatar={
        <Avatar style={{ backgroundColor: cirrusColors.success }}>
          <CasinoIcon style={{ color: cirrusColors.cirrusWhite }} />
        </Avatar>
      }
    />
  );
}

export default createFragmentContainer(TaskExperimentalChip, {
  task: graphql`
    fragment TaskExperimentalChip_task on Task {
      experimental
    }
  `,
});
