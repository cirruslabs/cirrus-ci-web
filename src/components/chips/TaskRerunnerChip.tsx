import React from 'react';

import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { TaskRerunnerChip_task } from './__generated__/TaskRerunnerChip_task.graphql';
import { Refresh } from '@mui/icons-material';

interface Props {
  task: TaskRerunnerChip_task;
  className?: string;
}

function TaskRerunnerChip(props: Props) {
  let { reranBy } = props.task;

  if (!reranBy) return <></>;

  return (
    <Chip
      className={props.className}
      label={'Re-ran by ' + reranBy.githubUserName}
      avatar={
        <Avatar>
          <Refresh />
        </Avatar>
      }
      onClick={() => {
        window.open('https://github.com/' + reranBy.githubUserName);
      }}
    />
  );
}

export default createFragmentContainer(TaskRerunnerChip, {
  task: graphql`
    fragment TaskRerunnerChip_task on Task {
      reranBy {
        githubUserName
      }
    }
  `,
});
