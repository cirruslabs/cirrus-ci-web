import React from 'react';
import { useNavigate } from 'react-router-dom';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import TaskNameChip from '../chips/TaskNameChip';
import TaskDurationChip from '../chips/TaskDurationChip';
import { shorten } from '../../utils/text';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { navigateTaskHelper } from '../../utils/navigateHelper';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import classNames from 'classnames';
import TaskCreatedChip from '../chips/TaskCreatedChip';
import { TaskListRow_task } from './__generated__/TaskListRow_task.graphql';
import { isTaskFinalStatus } from '../../utils/status';
import { useTaskStatusColorMapping } from '../../utils/colors';
import { Box, Tooltip } from '@mui/material';
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
      width: '100%',
    },
    padding: {
      padding: 0,
      margin: theme.spacing(0.5),
    },
    progressBar: {
      backgroundColor: 'transparent',
      width: '100%',
      paddingRight: 4,
      minHeight: theme.spacing(1.5),
      minWidth: 100,
    },
    progressBarElement: {
      minHeight: theme.spacing(1.5),
    },
  });

interface Props extends WithStyles<typeof styles> {
  task: TaskListRow_task;
  showCreation: boolean;
  durationBeforeScheduling?: number;
  overallDuration?: number;
}

function TaskListRow(props: Props) {
  let navigate = useNavigate();
  let colorMapping = useTaskStatusColorMapping();
  let { task, classes, durationBeforeScheduling, overallDuration } = props;
  let progress = null;
  if (isTaskFinalStatus(task.status) && overallDuration && task.executingTimestamp) {
    let scheduledDuration = Math.max(0, task.executingTimestamp - task.scheduledTimestamp) / 1000;
    let executionDuration = Math.max(0, task.finalStatusTimestamp - task.executingTimestamp) / 1000;
    progress = (
      <Tooltip
        title={`Task was scheduled in ${formatDuration(scheduledDuration)} and was executed in ${formatDuration(
          executionDuration,
        )}.`}
      >
        <Box
          className={classes.progressBar}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            className={classes.progressBarElement}
            sx={{
              width: Math.floor((100 * durationBeforeScheduling) / overallDuration) + '%',
              backgroundColor: 'transparent',
            }}
          />
          <Box
            className={classes.progressBarElement}
            sx={{
              width: Math.floor((100 * scheduledDuration) / overallDuration) + '%',
              backgroundColor: colorMapping['SCHEDULED'],
            }}
          />
          <Box
            className={classes.progressBarElement}
            sx={{
              width: Math.max(1, Math.floor((100 * executionDuration) / overallDuration)) + '%',
              backgroundColor: colorMapping[task.status],
            }}
          />
        </Box>
      </Tooltip>
    );
  }
  return (
    <TableRow onClick={e => navigateTaskHelper(navigate, e, task.id)} hover={true} style={{ cursor: 'pointer' }}>
      <TableCell className={classes.padding}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <TaskDurationChip task={task} className={classNames(classes.chip, classes.lastChip)} />
          <TaskNameChip task={task} className={classes.chip} withNavigation />
          {props.showCreation ? <TaskCreatedChip task={task} className={classes.chip} /> : null}
        </div>
      </TableCell>
      <TableCell
        className={classes.cell}
        sx={{
          display: { xs: 'none', md: 'table-cell' },
          alignItems: 'center',
        }}
      >
        {task.uniqueLabels.map(label => {
          return <Chip key={label} className={classes.chip} label={shorten(label)} />;
        })}
      </TableCell>
      <TableCell
        className={classes.cell}
        sx={{
          display: { xs: 'none', sm: 'table-cell' },
          alignItems: 'center',
        }}
      >
        {progress}
      </TableCell>
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
