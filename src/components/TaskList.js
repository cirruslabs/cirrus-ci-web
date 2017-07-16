import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom'

import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import TaskStatus from './TaskStatus'

class TaskList extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let tasks = this.props.tasks;
    return (
      <Table selectable={false} style={{tableLayout: 'auto'}}>
        <TableBody displayRowCheckbox={false} showRowHover={true}>
          {tasks.map( task => this.buildItem(task))}
        </TableBody>
      </Table>
    );
  }

  buildItem(task) {
    return (
      <TableRow key={task.id}
                onMouseDown={() => this.handleTaskClick(task.id)}
                style={{ cursor: "pointer" }}>
        <TableRowColumn>
          <TaskStatus status={task.status}/>
        </TableRowColumn>
        <TableRowColumn>
          {task.name}
        </TableRowColumn>
      </TableRow>
    );
  }

  handleTaskClick(taskId) {
    this.context.router.history.push("/tasks/" + taskId)
  }
}

export default withRouter(TaskList);
