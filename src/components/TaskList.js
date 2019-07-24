import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TaskListRow from './TaskListRow';
import { withStyles } from '@material-ui/core';

class TaskList extends React.Component {
  render() {
    let tasks = this.props.tasks || [];
    return (
      <Table style={{ tableLayout: 'auto' }}>
        <TableBody>
          {tasks.map(task => (
            <TaskListRow key={task.id || task.__id} task={task} showCreation={this.props.showCreation || false} />
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default withStyles({})(TaskList);
