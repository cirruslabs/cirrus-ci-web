import React from 'react';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow} from 'material-ui/Table';
import TaskListRow from "./TaskListRow";

class TaskList extends React.Component {
  render() {
    let styles = {
      chip: {
        marginLeft: 20,
        marginTop: 4,
        marginBottom: 4,
      },
    };
    let tasks = this.props.tasks;
    let header = null;
    if (this.props.header) {
      header = (
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow displayBorder={false} selectable={false}>
            <TableHeaderColumn style={{textAlign: 'center'}}>
              {this.props.header}
            </TableHeaderColumn>
          </TableRow>
        </TableHeader>
      )
    }
    return (
      <Table selectable={false} style={{tableLayout: 'auto'}}>
        {header}
        <TableBody displayRowCheckbox={false} showRowHover={true}>
          {tasks.map(task => <TaskListRow task={task} styles={styles}/>)}
        </TableBody>
      </Table>
    );
  }
}

export default TaskList;
