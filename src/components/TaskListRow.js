import React from 'react';
import {withRouter} from 'react-router-dom'

import {TableRow, TableRowColumn} from 'material-ui/Table';
import Chip from 'material-ui/Chip';
import TaskNameChip from "./chips/TaskNameChip";
import TaskDurationChip from "./chips/TaskDurationChip";
import {shorten} from "../utils/text";
import {createFragmentContainer, graphql} from "react-relay";

class TaskListRow extends React.Component {
  render() {
    let task = this.props.task;
    let styles = this.props.styles;
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
}

export default createFragmentContainer(withRouter(TaskListRow), {
  task: graphql`
    fragment TaskList_task on Task {
        id
        name
        status
        creationTimestamp
        scheduledTimestamp
        durationInSeconds
        labels
        statusDurations {
          status
          durationInSeconds
        }
        commands {
          name
          status
          durationInSeconds
        }
    }
  `,
});
