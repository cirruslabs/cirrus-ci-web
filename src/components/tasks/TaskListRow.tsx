import React from 'react';
import { useHistory } from 'react-router-dom';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';
import TaskNameChip from '../chips/TaskNameChip';
import TaskDurationChip from '../chips/TaskDurationChip';
import { shorten } from '../../utils/text';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { navigateTask } from '../../utils/navigate';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import TaskCreatedChip from '../chips/TaskCreatedChip';
import { TaskListRow_task } from './__generated__/TaskListRow_task.graphql';
import { isTaskFinalStatus } from '../../utils/status';
import { useTaskStatusColorMapping } from '../../utils/colors';
import { Hidden, Paper, Tooltip } from '@material-ui/core';
import { formatDuration } from '../../utils/time';

const styles = theme =>
  createStyles({
    chip: {
      marginTop: 4,
      marginBottom: 4,
      marginLeft: 4,
    },
    lastChip: {
      marginRight: 4,
    },
    cell: {
      padding: 0,
      height: '100%',
    },
    progressBar: {
      width: '100%',
      minHeight: '100%',
      minWidth: 100,
    },
  });

interface Props extends WithStyles<typeof styles> {
  task: TaskListRow_task;
  showCreation: boolean;
  durationBeforeScheduling?: number;
  overallDuration?: number;
}

function TaskListRow(props: Props) {
  let history = useHistory();
  let colorMapping = useTaskStatusColorMapping();
  let { task, classes, durationBeforeScheduling, overallDuration } = props;
  let progress = null;
  console.log(task.status, durationBeforeScheduling, overallDuration);
  if (isTaskFinalStatus(task.status) && overallDuration && task.executingTimestamp) {
    let scheduledDuration = Math.max(0, task.executingTimestamp - task.scheduledTimestamp) / 1000;
    let executionDuration = Math.max(0, task.finalStatusTimestamp - task.executingTimestamp) / 1000;
    progress = (
      <Tooltip
        title={`Task was scheduled in ${formatDuration(scheduledDuration)} and was executed in ${formatDuration(
          executionDuration,
        )}.`}
      >
        <Paper elevation={0} className={classNames(classes.progressBar, 'progress')}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              height: '100%',
              width: Math.floor((100 * durationBeforeScheduling) / overallDuration) + '%',
              backgroundColor: 'transparent',
            }}
            aria-valuenow={Math.floor((100 * durationBeforeScheduling) / overallDuration)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              height: '100%',
              width: Math.floor((100 * scheduledDuration) / overallDuration) + '%',
              backgroundColor: colorMapping['SCHEDULED'],
            }}
            aria-valuenow={Math.floor((100 * scheduledDuration) / overallDuration)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              height: '100%',
              width: Math.max(1, Math.floor((100 * executionDuration) / overallDuration)) + '%',
              backgroundColor: colorMapping[task.status],
            }}
            aria-valuenow={Math.floor((100 * executionDuration) / overallDuration)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </Paper>
      </Tooltip>
    );
  }
  return (
    <TableRow onClick={e => navigateTask(history, e, task.id)} hover={true} style={{ cursor: 'pointer' }}>
      <TableCell className={classNames(classes.cell)}>
        <TaskDurationChip task={task} className={classNames(classes.chip, classes.lastChip)} />
        <TaskNameChip task={task} className={classes.chip} />
        {props.showCreation ? <TaskCreatedChip task={task} className={classes.chip} /> : null}
        <TaskDurationChip task={task} className={classNames(classes.chip, 'd-none', 'd-md-none')} />
      </TableCell>
      <Hidden mdDown>
        <TableCell className={classNames('d-none', 'd-lg-table-cell', classes.cell)}>
          {task.uniqueLabels.map(label => {
            return <Chip key={label} className={classes.chip} label={shorten(label)} />;
          })}
        </TableCell>
      </Hidden>
      <Hidden smDown>
        <TableCell className={classNames(classes.cell)}>{progress}</TableCell>
      </Hidden>
    </TableRow>
  );
}

export default createFragmentContainer(withStyles(styles)(TaskListRow), {
  task: graphql`
    fragment TaskListRow_task on Task {
      id
      status
      executingTimestamp
      scheduledTimestamp
      finalStatusTimestamp
      ...TaskDurationChip_task
      ...TaskNameChip_task
      ...TaskCreatedChip_task
      uniqueLabels
    }
  `,
});
