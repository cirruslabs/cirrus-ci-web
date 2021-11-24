import React from 'react';

import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { Cancel } from '@mui/icons-material';
import { TaskCancellerChip_task } from './__generated__/TaskCancellerChip_task.graphql';

interface Props {
  task: TaskCancellerChip_task;
  className?: string;
}

function TaskCancellerChip(props: Props) {
  let { cancelledBy } = props.task;

  if (!cancelledBy) return <></>;

  return (
    <Chip
      className={props.className}
      label={'Cancelled by ' + cancelledBy.githubUserName}
      avatar={
        <Avatar>
          <Cancel />
        </Avatar>
      }
      onClick={() => {
        window.open('https://github.com/' + cancelledBy.githubUserName);
      }}
    />
  );
}

export default createFragmentContainer(TaskCancellerChip, {
  task: graphql`
    fragment TaskCancellerChip_task on Task {
      cancelledBy {
        githubUserName
      }
    }
  `,
});
