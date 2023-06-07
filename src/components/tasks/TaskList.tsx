import React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TaskListRow from './TaskListRow';
import { FragmentRefs } from 'relay-runtime';

interface Task {
  readonly id: string;
  readonly localGroupId: number;
  readonly requiredGroups: ReadonlyArray<number | null> | null;
  readonly scheduledTimestamp: number;
  readonly executingTimestamp: number;
  readonly finalStatusTimestamp: number;
  readonly ' $fragmentRefs': FragmentRefs<'TaskListRow_task'>;
}

interface Props {
  tasks: ReadonlyArray<Task>;
  showCreation?: boolean;
}

// stable topological sort in O(n*k) where n is amount of tasks and k is amount of stages
// plus populating data for visualization
function topologicalSort(tasks: ReadonlyArray<Task>): ReadonlyArray<{
  task: Task;
  durationBeforeScheduling: number;
  overallDuration: number;
}> {
  let result = [];

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
      let scheduledDuration = Math.max(0, current.task.executingTimestamp - current.task.scheduledTimestamp) / 1000;
      let executionDuration = current.task.executingTimestamp
        ? Math.max(0, current.task.finalStatusTimestamp - current.task.executingTimestamp) / 1000
        : 0;
      let candidate = current.durationBeforeScheduling + executionDuration + scheduledDuration;
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
      result.push({
        task: task,
      });
    }
  }

  for (let i = 0; i < result.length; i++) {
    result[i].overallDuration = currentDurationBeforeScheduling;
  }

  return result;
}

export default function TaskList(props: Props) {
  let visualDataItems = topologicalSort(props.tasks || []);
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
