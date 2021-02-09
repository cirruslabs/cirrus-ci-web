import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import SecurityIcon from '@material-ui/icons/Security';
import { graphql } from 'babel-plugin-relay/macro';
import { cirrusColorsState } from '../../cirrusTheme';
import { TaskStatefulChip_task } from './__generated__/TaskStatefulChip_task.graphql';
import { createFragmentContainer } from 'react-relay';
import { useRecoilValue } from 'recoil';
import { useTheme } from '@material-ui/core';

interface Props {
  task: TaskStatefulChip_task;
  className?: string;
}

function TaskStatefulChip(props: Props) {
  let theme = useTheme();
  const cirrusColors = useRecoilValue(cirrusColorsState);

  let { task } = props;
  let { stateful } = task;
  if (!stateful) return <div />;

  return (
    <Chip
      className={props.className}
      label="Stateful"
      avatar={
        <Avatar style={{ backgroundColor: cirrusColors.success }}>
          <SecurityIcon style={{ color: theme.palette.primary.contrastText }} />
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
