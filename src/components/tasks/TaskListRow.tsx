import React from 'react';
import { useFragment } from 'react-relay';
import { useNavigate } from 'react-router-dom';

import { graphql } from 'babel-plugin-relay/macro';
import classNames from 'classnames';

import mui from 'mui';

import TaskCreatedChip from 'components/chips/TaskCreatedChip';
import TaskDurationChip from 'components/chips/TaskDurationChip';
import TaskNameChip from 'components/chips/TaskNameChip';
import { useTaskStatusColorMapping } from 'utils/colors';
import { navigateTaskHelper } from 'utils/navigateHelper';
import { isTaskFinalStatus } from 'utils/status';
import { shorten } from 'utils/text';
import { formatDuration } from 'utils/time';

import { TaskListRow_task$key } from './__generated__/TaskListRow_task.graphql';

const useStyles = mui.makeStyles(theme => {
  return {
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
  };
});

interface Props {
  task: TaskListRow_task$key;
  showCreation: boolean;
  durationBeforeScheduling?: number;
  overallDuration?: number;
}

export default function TaskListRow(props: Props) {
  let task = useFragment(
    graphql`
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
    props.task,
  );

  let navigate = useNavigate();
  let colorMapping = useTaskStatusColorMapping();
  let { overallDuration } = props;
  let classes = useStyles();
  let progress: null | JSX.Element = null;
  if (isTaskFinalStatus(task.status) && overallDuration && task.executingTimestamp) {
    const scheduledTimestamp = task.scheduledTimestamp || 0;
    const finalStatusTimestamp = task.finalStatusTimestamp || 0;
    const durationBeforeScheduling = props.durationBeforeScheduling || 0;
    let scheduledDuration = Math.max(0, task.executingTimestamp - scheduledTimestamp) / 1000;
    let executionDuration = Math.max(0, finalStatusTimestamp - task.executingTimestamp) / 1000;
    progress = (
      <mui.Tooltip
        title={`Task was scheduled in ${formatDuration(scheduledDuration)} and was executed in ${formatDuration(
          executionDuration,
        )}.`}
      >
        <mui.Box
          className={classes.progressBar}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <mui.Box
            className={classes.progressBarElement}
            sx={{
              width: Math.floor((100 * durationBeforeScheduling) / overallDuration) + '%',
              backgroundColor: 'transparent',
            }}
          />
          <mui.Box
            className={classes.progressBarElement}
            sx={{
              width: Math.floor((100 * scheduledDuration) / overallDuration) + '%',
              backgroundColor: colorMapping['SCHEDULED'],
            }}
          />
          <mui.Box
            className={classes.progressBarElement}
            sx={{
              width: Math.max(1, Math.floor((100 * executionDuration) / overallDuration)) + '%',
              backgroundColor: colorMapping[task.status],
            }}
          />
        </mui.Box>
      </mui.Tooltip>
    );
  }
  return (
    <mui.TableRow onClick={e => navigateTaskHelper(navigate, e, task.id)} hover={true} style={{ cursor: 'pointer' }}>
      <mui.TableCell className={classes.padding}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <TaskDurationChip task={task} className={classNames(classes.chip, classes.lastChip)} />
          <TaskNameChip task={task} className={classes.chip} withNavigation />
          {props.showCreation ? <TaskCreatedChip task={task} className={classes.chip} /> : null}
        </div>
      </mui.TableCell>
      <mui.TableCell
        className={classes.cell}
        sx={{
          display: { xs: 'none', md: 'table-cell' },
          alignItems: 'center',
        }}
      >
        {task.uniqueLabels.map(label => {
          return <mui.Chip key={label} className={classes.chip} label={shorten(label)} />;
        })}
      </mui.TableCell>
      <mui.TableCell
        className={classes.cell}
        sx={{
          display: { xs: 'none', sm: 'table-cell' },
          alignItems: 'center',
        }}
      >
        {progress}
      </mui.TableCell>
    </mui.TableRow>
  );
}
