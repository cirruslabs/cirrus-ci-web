import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import { cirrusColors } from '../../cirrusTheme';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { Tooltip } from '@material-ui/core';

function TaskResourcesChip(props) {
  let { task } = props;
  let resources = task.instanceResources;
  let cpuPart = resources.cpu === 1.0 ? `1 CPU` : `${resources.cpu} CPUs`;
  let memoryPart = resources.memory === 1024 ? `1 GB` : `${resources.memory / 1024.0} GBs`;
  return (
    <Tooltip title="Task Resources">
      <Chip
        className={props.className}
        label={`${cpuPart} / ${memoryPart}`}
        avatar={
          <Avatar style={{ backgroundColor: cirrusColors.cirrusSecondary }}>
            <Icon style={{ color: cirrusColors.cirrusWhite }}>memory</Icon>
          </Avatar>
        }
      />
    </Tooltip>
  );
}

export default createFragmentContainer(TaskResourcesChip, {
  task: graphql`
    fragment TaskResourcesChip_task on Task {
      instanceResources {
        cpu
        memory
      }
    }
  `,
});
