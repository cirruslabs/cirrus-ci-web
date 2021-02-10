import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Report from '@material-ui/icons/Report';

import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { cirrusColorsState } from '../../cirrusTheme';
import { TaskOptionalChip_task } from './__generated__/TaskOptionalChip_task.graphql';
import { useRecoilValue } from 'recoil';
import { useTheme } from '@material-ui/core';

interface Props {
  task: TaskOptionalChip_task;
  className?: string;
}

function TaskOptionalChip(props: Props) {
  let theme = useTheme();
  const cirrusColors = useRecoilValue(cirrusColorsState);

  let { optional } = props.task;
  if (!optional) return <div />;

  return (
    <Chip
      className={props.className}
      label="Optional"
      avatar={
        <Avatar style={{ backgroundColor: cirrusColors.lightWarning }}>
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
