import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Bookmark from '@material-ui/icons/Bookmark';
import { cirrusColors } from '../../cirrusTheme';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

function TaskNameChip(props) {
  let { task, className } = props;
  return (
    <Chip
      className={className}
      label={task.name}
      onClick={() => {
        /* this empty handler helps Vimium (http://vimium.github.io/) to recognize that task names are clickable */
      }}
      avatar={
        <Avatar style={{ backgroundColor: cirrusColors.cirrusPrimary }}>
          <Bookmark style={{ color: cirrusColors.cirrusWhite }} />
        </Avatar>
      }
    />
  );
}

export default createFragmentContainer(TaskNameChip, {
  task: graphql`
    fragment TaskNameChip_task on Task {
      name
    }
  `,
});
