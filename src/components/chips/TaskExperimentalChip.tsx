import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import CasinoIcon from '@material-ui/icons/Casino';

import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { TaskExperimentalChip_task } from './__generated__/TaskExperimentalChip_task.graphql';
import { useTheme } from '@material-ui/core';

interface Props {
  className?: string;
  task: TaskExperimentalChip_task;
}

let TaskExperimentalChip = (props: Props) => {
  let theme = useTheme();
  const { task } = props;
  const { experimental } = task;

  if (!experimental) return <div />;

  return (
    <Chip
      className={props.className}
      label="Experimental"
      avatar={
        <Avatar style={{ backgroundColor: theme.palette.info.main }}>
          <CasinoIcon style={{ color: theme.palette.primary.contrastText }} />
        </Avatar>
      }
    />
  );
};

export default createFragmentContainer(TaskExperimentalChip, {
  task: graphql`
    fragment TaskExperimentalChip_task on Task {
      experimental
    }
  `,
});
