import React from 'react';

import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import TaskDetails from '../../components/tasks/TaskDetails';
import NotFound from '../NotFound';
import { TaskQuery } from './__generated__/TaskQuery.graphql';
import { useParams } from 'react-router-dom';
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs';

export default function Task(): JSX.Element {
  let { taskId } = useParams();

  const response = useLazyLoadQuery<TaskQuery>(
    graphql`
      query TaskQuery($taskId: ID!) {
        task(id: $taskId) {
          ...TaskDetails_task
          ...AppBreadcrumbs_task
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
      <AppBreadcrumbs task={response.task} />
      <TaskDetails task={response.task} />
    </>
  );
}
