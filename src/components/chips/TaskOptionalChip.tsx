import React from 'react';

import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Report from '@mui/icons-material/Report';

import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { TaskOptionalChip_task } from './__generated__/TaskOptionalChip_task.graphql';
import { useTheme } from '@mui/material';

interface Props {
  task: TaskOptionalChip_task;
  className?: string;
}

function TaskOptionalChip(props: Props) {
  let theme = useTheme();

  let { optional } = props.task;
  if (!optional) return <div />;

  return (
    <Chip
      className={props.className}
      label="Optional"
      avatar={
        <Avatar style={{ backgroundColor: theme.palette.warning.light }}>
          <Report style={{ color: theme.palette.primary.contrastText }} />
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
