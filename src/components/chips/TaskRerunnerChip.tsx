import React from 'react';

import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

import { useFragment } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { TaskRerunnerChip_task$key } from './__generated__/TaskRerunnerChip_task.graphql';

interface Props {
  task: TaskRerunnerChip_task$key;
  className?: string;
}

export default function TaskRerunnerChip(props: Props) {
  let task = useFragment(
    graphql`
      fragment TaskRerunnerChip_task on Task {
        reranBy {
          avatarURL
        }
      }
    `,
    props.task,
  );

  let { reranBy } = task;

  if (!reranBy) return <></>;

  return <Chip className={props.className} label="Re-ran by a user" avatar={<Avatar src={reranBy.avatarURL} />} />;
}
