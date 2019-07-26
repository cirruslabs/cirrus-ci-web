import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';
import TaskNameChip from './chips/TaskNameChip';
import TaskDurationChip from './chips/TaskDurationChip';
import { shorten } from '../utils/text';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import PropTypes from 'prop-types';
import { navigateTask } from '../utils/navigate';
import { withStyles, WithStyles } from '@material-ui/core';
import classNames from 'classnames';
import TaskCreatedChip from './chips/TaskCreatedChip';
import { TaskListRow_task } from './__generated__/TaskListRow_task.graphql';

const styles = {
  chip: {
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 4,
  },
  cell: {
    padding: 0,
    height: '100%',
  },
};

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  task: TaskListRow_task;
  showCreation: boolean;
}

class TaskListRow extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  render() {
    let { task, classes } = this.props;
    return (
      <TableRow onClick={e => navigateTask(this.context.router, e, task.id)} hover={true} style={{ cursor: 'pointer' }}>
        <TableCell className={classNames(classes.cell)}>
          <TaskNameChip task={task} className={classes.chip} />
          {this.props.showCreation ? <TaskCreatedChip task={task} className={classes.chip} /> : null}
          <TaskDurationChip task={task} className={classNames(classes.chip, 'd-md-none')} />
        </TableCell>
        <TableCell className={classNames('d-none', 'd-lg-table-cell', classes.cell)}>
          {task.uniqueLabels.map(label => {
            return <Chip key={label} className={classes.chip} label={shorten(label)} />;
          })}
        </TableCell>
        <TableCell className={classes.cell}>
          <div className="d-flex justify-content-end">
            <TaskDurationChip task={task} className={classes.chip} />
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
      ...TaskDurationChip_task
      ...TaskNameChip_task
      ...TaskCreatedChip_task
      uniqueLabels
    }
  `,
});
