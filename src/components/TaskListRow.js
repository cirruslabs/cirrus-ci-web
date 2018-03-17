import React from 'react';
import {withRouter} from 'react-router-dom'

import {TableRow, TableRowColumn} from 'material-ui/Table';
import Chip from 'material-ui/Chip';
import TaskNameChip from "./chips/TaskNameChip";
import TaskDurationChip from "./chips/TaskDurationChip";
import {shorten} from "../utils/text";
import {createFragmentContainer, graphql} from "react-relay";
import PropTypes from "prop-types";
import {navigateTask} from "../utils/navigate";

class TaskListRow extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let task = this.props.task;
    let styles = this.props.styles;
    return (
      <TableRow key={task.id}
                onMouseDown={(e) => navigateTask(this.context.router, e, task.id)}
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
    fragment TaskListRow_task on Task {
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
