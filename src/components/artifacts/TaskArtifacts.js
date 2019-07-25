import React from 'react';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import ArtifactsView from './ArtifactsView';

function TaskArtifacts(props) {
  if (!props.task.artifacts || props.task.artifacts.length === 0) return <div />;
  return <ArtifactsView task={props.task} />;
}

export default createFragmentContainer(TaskArtifacts, {
  task: graphql`
    fragment TaskArtifacts_task on Task {
      id
      artifacts {
        name
        type
        format
        files {
          path
          size
        }
      }
    }
  `,
});
