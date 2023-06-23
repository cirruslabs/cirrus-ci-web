import React from 'react';
import { useLazyLoadQuery } from 'react-relay';
import { useParams } from 'react-router-dom';

import { graphql } from 'babel-plugin-relay/macro';

import AppBreadcrumbs from 'components/common/AppBreadcrumbs';
import TaskDetails from 'components/tasks/TaskDetails';
import NotFound from 'scenes/NotFound';

import { TaskQuery } from './__generated__/TaskQuery.graphql';

function TaskById(taskId: string) {
  const response = useLazyLoadQuery<TaskQuery>(
    graphql`
      query TaskQuery($taskId: ID!) {
        task(id: $taskId) {
          ...TaskDetails_task
          ...AppBreadcrumbs_task
        }
        viewer {
          ...AppBreadcrumbs_viewer
        }
      }
    `,
    { taskId },
  );

  if (!response.task) {
    return <NotFound />;
  }

  return (
    <>
      <AppBreadcrumbs task={response.task} viewer={response.viewer} />
      <TaskDetails task={response.task} />
    </>
  );
}

export default function Task() {
  let { taskId } = useParams();

  if (!taskId) {
    return <NotFound />;
  }

  return TaskById(taskId);
}
