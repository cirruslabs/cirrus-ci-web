import React from 'react';
import { useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import ArtifactsView from './ArtifactsView';

export default function TaskArtifacts(props) {
  let task = useFragment(
    graphql`
      fragment TaskArtifacts_task on Task {
        id
        artifacts {
          name
          files {
            path
            size
          }
        }
        ...ArtifactsView_task
      }
    `,
    props.task,
  );

  if (!task.artifacts || task.artifacts.length === 0) return <div />;
  return <ArtifactsView task={props.task} />;
}
