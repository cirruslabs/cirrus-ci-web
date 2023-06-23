import React from 'react';
import { useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import TaskListRow from './TaskListRow';
import { TaskList_tasks$key, TaskList_tasks$data } from './__generated__/TaskList_tasks.graphql';

interface Props {
  tasks: TaskList_tasks$key;
  showCreation?: boolean;
}

type TopologicalSortResult = Array<{
  task: TaskList_tasks$data[number];
  durationBeforeScheduling?: number;
  overallDuration?: number;
}>;

// stable topological sort in O(n*k) where n is amount of tasks and k is amount of stages
// plus populating data for visualization
function topologicalSort(tasks: TaskList_tasks$data): TopologicalSortResult {
  let result: TopologicalSortResult = [];

  let satisfiedGroups = {};

  function allGroupsSatisfied(groupIds: ReadonlyArray<number>): boolean {
    for (let i = 0; i < groupIds.length; i++) {
      if (!satisfiedGroups[groupIds[i]]) return false;
    }
    return true;
  }

  let currentDurationBeforeScheduling = 0;

  while (true) {
    let added = false;

    let newlySatisfiedGroups = {};

    for (let i = 0; i < tasks.length; i++) {
      let task = tasks[i];
      if (!satisfiedGroups[task.localGroupId] && allGroupsSatisfied(task.requiredGroups)) {
        newlySatisfiedGroups[task.localGroupId] = true;
        result.push({
          task: task,
          durationBeforeScheduling: currentDurationBeforeScheduling,
        });
        added = true;
      }
    }

    Object.keys(newlySatisfiedGroups).forEach(key => (satisfiedGroups[key] = true));

    for (let i = 0; i < result.length; i++) {
      let current = result[i];
      const executingTimestamp = current.task.executingTimestamp ?? 0;
      const scheduledTimestamp = current.task.scheduledTimestamp ?? 0;
      const finalStatusTimestamp = current.task.finalStatusTimestamp ?? 0;
      let scheduledDuration = Math.max(0, executingTimestamp - scheduledTimestamp) / 1000;
      let executionDuration = executingTimestamp ? Math.max(0, finalStatusTimestamp - executingTimestamp) / 1000 : 0;
      let candidate = current.durationBeforeScheduling! + executionDuration + scheduledDuration;
      if (candidate > currentDurationBeforeScheduling) {
        currentDurationBeforeScheduling = candidate;
      }
    }

    if (!added) {
      break;
    }
  }

  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    if (!satisfiedGroups[task.localGroupId]) {
      result.push({ task });
    }
  }

  for (let i = 0; i < result.length; i++) {
    result[i].overallDuration = currentDurationBeforeScheduling;
  }

  return result;
}

export default function TaskList(props: Props) {
  const tasks = useFragment(
    graphql`
      fragment TaskList_tasks on Task @relay(plural: true) {
        id
        localGroupId
        requiredGroups
        executingTimestamp
        scheduledTimestamp
        finalStatusTimestamp
        ...TaskListRow_task
      }
    `,
    props.tasks,
  );
  let visualDataItems = topologicalSort(tasks);
  return (
    <Table style={{ tableLayout: 'auto' }}>
      <TableBody>
        {visualDataItems.map(item => (
          <TaskListRow
            key={item.task.id}
            task={item.task}
            showCreation={props.showCreation || false}
            durationBeforeScheduling={item.durationBeforeScheduling}
            overallDuration={item.overallDuration}
          />
        ))}
      </TableBody>
    </Table>
  );
}
