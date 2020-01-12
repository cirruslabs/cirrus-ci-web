import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TaskListRow from './TaskListRow';
import { FragmentRefs } from 'relay-runtime';

interface Props {
  tasks: ReadonlyArray<{
    readonly id: string;
    readonly ' $fragmentRefs': FragmentRefs<'TaskListRow_task'>;
  }>;
  showCreation?: boolean;
}

export default (props: Props) => {
  let tasks = props.tasks || [];
  return (
    <Table style={{ tableLayout: 'auto' }}>
      <TableBody>
        {tasks.map(task => (
          <TaskListRow key={task.id} task={task} showCreation={props.showCreation || false} />
        ))}
      </TableBody>
    </Table>
  );
}
