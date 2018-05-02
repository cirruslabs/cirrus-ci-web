import React from 'react';

import Table, {TableBody} from 'material-ui/Table';
import TaskListRow from "./TaskListRow";
import {withStyles} from "material-ui";

class TaskList extends React.Component {
  render() {
    let tasks = this.props.tasks || [];
    return (
      <Table style={{tableLayout: 'auto'}}>
        <TableBody>
          {tasks.map(task => <TaskListRow key={task.id} task={task} showCreation={this.props.showCreation || false}/>)}
        </TableBody>
      </Table>
    );
  }
}

export default withStyles()(TaskList);
