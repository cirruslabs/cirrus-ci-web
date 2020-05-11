import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Memory from '@material-ui/icons/Memory';
import { cirrusColors } from '../../cirrusTheme';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import Tooltip from '../common/CirrusTooltip';

function TaskResourcesChip(props) {
  let { task, className } = props;
  let resources = task.instanceResources;
  let cpuPart = resources.cpu === 1.0 ? `1 CPU` : `${resources.cpu} CPUs`;
  let memoryPart = resources.memory === 1024 ? `1 GB` : `${resources.memory / 1024.0} GBs`;
  return (
    <Tooltip title="Task Resources">
      <Chip
        className={className}
        label={`${cpuPart} / ${memoryPart}`}
        avatar={
          <Avatar style={{ backgroundColor: cirrusColors.cirrusSecondary }}>
            <Memory style={{ color: cirrusColors.cirrusWhite }} />
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
