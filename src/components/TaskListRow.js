import React from 'react';
import {withRouter} from 'react-router-dom'

import {TableCell, TableRow} from 'material-ui/Table';
import Chip from 'material-ui/Chip';
import TaskNameChip from "./chips/TaskNameChip";
import TaskDurationChip from "./chips/TaskDurationChip";
import {shorten} from "../utils/text";
import {createFragmentContainer, graphql} from "react-relay";
import PropTypes from "prop-types";
import {navigateTask} from "../utils/navigate";
import {withStyles} from "material-ui";
import classNames from 'classnames'
import TaskCreatedChip from "./chips/TaskCreatedChip";

const styles = {
  chip: {
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 4,
  },
  cell: {
    padding: 0,
    height: "100%",
  },
};

class TaskListRow extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let {task, classes} = this.props;
    return (
      <TableRow onClick={(e) => navigateTask(this.context.router, e, task.id)}
                hover={true}
                style={{cursor: "pointer"}}>
        <TableCell className={classNames(classes.cell)}>
          <TaskNameChip task={task} className={classes.chip}/>
          {
            this.props.showCreation ? <TaskCreatedChip task={task} className={classes.chip}/> : null
          }
          <TaskDurationChip task={task} className={classNames(classes.chip, "d-md-none")}/>
        </TableCell>
        <TableCell className={classNames("d-none", "d-lg-table-cell", classes.cell)}>
          {
            task.uniqueLabels.map(label => {
              return <Chip key={label} className={classes.chip} label={shorten(label)}/>
            })
          }
        </TableCell>
        <TableCell className={classes.cell}>
          <div className="d-flex justify-content-end">
            <TaskDurationChip task={task} className={classes.chip}/>
          </div>
        </TableCell>
      </TableRow>
    );
  }
}

export default createFragmentContainer(withRouter(withStyles(styles)(TaskListRow)), {
  task: graphql`
    fragment TaskListRow_task on Task {
        id
        name
        status
        creationTimestamp
        scheduledTimestamp
        durationInSeconds
        uniqueLabels
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
