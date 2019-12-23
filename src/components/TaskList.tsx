import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TaskListRow from './TaskListRow';
import { withStyles, WithStyles } from '@material-ui/core';
import { TaskListRow_task } from './__generated__/TaskListRow_task.graphql';

interface Props extends WithStyles<{}> {
  tasks: ReadonlyArray<TaskListRow_task>;
  showCreation?: boolean;
}

class TaskList extends React.Component<Props> {
  render() {
    let tasks = this.props.tasks || [];
    return (
      <Table style={{ tableLayout: 'auto' }}>
        <TableBody>
          {tasks.map(task => (
            <TaskListRow
              key={task.id || (task as any).__id}
              task={task}
              showCreation={this.props.showCreation || false}
            />
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default withStyles({})(TaskList);
