import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom'

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Chip from 'material-ui/Chip';
import TaskNameChip from "./chips/TaskNameChip";
import TaskDurationChip from "./chips/TaskDurationChip";
import {shorten} from "../utils/text";

class TaskList extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

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
            <TableHeaderColumn  style={{textAlign: 'center'}}>
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
          {tasks.map(task => this.buildItem(task, styles))}
        </TableBody>
      </Table>
    );
  }

  buildItem(task, styles) {
    return (
      <TableRow key={task.id}
                onMouseDown={() => this.handleTaskClick(task.id)}
                style={{cursor: "pointer"}}>
        <TableRowColumn style={{padding: 0}}>
          <TaskNameChip task={task} style={styles.chip}/>
          <TaskDurationChip task={task} style={styles.chip} className="hidden-md-up"/>
        </TableRowColumn>
        <TableRowColumn style={{padding: 0}}>
          {
            task.labels.map(label => {
              return <Chip key={label} style={styles.chip}>{shorten(label)}</Chip>
            })
          }
        </TableRowColumn>
        <TableRowColumn style={{padding: 0}} className="hidden-sm-down">
          <TaskDurationChip task={task} style={styles.chip}/>
        </TableRowColumn>
      </TableRow>
    );
  }

  handleTaskClick(taskId) {
    this.context.router.history.push("/task/" + taskId)
  }
}

export default withRouter(TaskList);
