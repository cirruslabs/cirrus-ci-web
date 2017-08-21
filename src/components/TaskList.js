import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom'

import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import {formatDuration} from "../utils/time";

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import {cirrusColors} from "../cirrusTheme";
import {taskStatusColor} from "../utils/colors";

class TaskList extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let styles = {
      chip: {
        margin: 4,
      },
    };
    let tasks = this.props.tasks;
    return (
      <Table selectable={false} style={{tableLayout: 'auto'}}>
        <TableBody displayRowCheckbox={false} showRowHover={true}>
          {tasks.map( task => this.buildItem(task, styles))}
        </TableBody>
      </Table>
    );
  }

  buildItem(task, styles) {
    return (
      <TableRow key={task.id}
                onMouseDown={() => this.handleTaskClick(task.id)}
                style={{ cursor: "pointer" }}>
        <TableRowColumn style={{padding: 0}}>
          <Chip style={styles.chip}>
            <Avatar backgroundColor={cirrusColors.cirrusPrimary}
                    icon={<FontIcon className="material-icons">bookmark</FontIcon>} />
            {task.name}
          </Chip>
        </TableRowColumn>
        <TableRowColumn style={{padding: 0}}>
          {
            task.labels.map(label => {
              return <Chip key={label} style={styles.chip}>{label}</Chip>
            })
          }
        </TableRowColumn>
        <TableRowColumn style={{padding: 0}}>
          <Chip style={styles.chip}>
            <Avatar backgroundColor={taskStatusColor(task.status)}
                    icon={<FontIcon className="material-icons">query_builder</FontIcon>} />
            {formatDuration(task.taskDurationInSeconds)}
          </Chip>
        </TableRowColumn>
      </TableRow>
    );
  }

  handleTaskClick(taskId) {
    this.context.router.history.push("/task/" + taskId)
  }
}

export default withRouter(TaskList);
