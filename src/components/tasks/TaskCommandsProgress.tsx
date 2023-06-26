import React, { useEffect, useState } from 'react';
import { useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import mui from 'mui';

import { useTaskStatusColorMapping } from 'utils/colors';
import { isTaskFinalStatus } from 'utils/status';
import { formatDuration } from 'utils/time';

import { TaskCommandsProgress_task$key } from './__generated__/TaskCommandsProgress_task.graphql';

const useStyles = mui.makeStyles(theme => {
  return {
    progressBar: {
      backgroundColor: 'transparent',
      width: '100%',
      minWidth: 100,
    },
    progressBarElement: {
      minHeight: theme.spacing(1.5),
    },
  };
});

interface Props {
  task: TaskCommandsProgress_task$key;
  className?: string;
}

export default function TaskCommandsProgress(props: Props) {
  let task = useFragment(
    graphql`
      fragment TaskCommandsProgress_task on Task {
        status
        creationTimestamp
        statusDurations {
          status
          durationInSeconds
        }
      }
    `,
    props.task,
  );

  let classes = useStyles();
  let [totalDuration, setTotalDuration] = useState(
    task.statusDurations.reduce((sum, statusDuration) => sum + statusDuration.durationInSeconds, 0),
  );

  useEffect(() => {
    if (!isTaskFinalStatus(task.status)) {
      const intervalId = setInterval(() => {
        // schema creationTimestamp
        setTotalDuration((Date.now() - task.creationTimestamp) / 1000);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [task.status, task.creationTimestamp]);

  let bars: Array<JSX.Element> = [];

  let colorMapping = useTaskStatusColorMapping();

  let totalPercent = 0;
  for (let i = 0; i < task.statusDurations.length; ++i) {
    let statusDuration = task.statusDurations[i];
    let isLastBar = i === task.statusDurations.length - 1;

    let percent = (100 * statusDuration.durationInSeconds) / totalDuration;
    if (isLastBar) {
      percent = 100 - totalPercent;
    } else {
      totalPercent += percent;
    }
    let colorStatus = statusDuration.status;
    if (colorStatus === 'EXECUTING') {
      colorStatus = task.status;
    }
    bars.push(
      <mui.Box
        className={classes.progressBarElement}
        sx={{
          width: percent + '%',
          backgroundColor: colorMapping[colorStatus],
        }}
      />,
    );
  }

  let tooltipTitle = (
    <div>
      {task.statusDurations.map(statusDuration => (
        <mui.Typography variant="caption" display="block" key={statusDuration.status}>
          {formatDuration(statusDuration.durationInSeconds)}: {statusDuration.status}
        </mui.Typography>
      ))}
    </div>
  );

  return (
    <mui.Tooltip placement="bottom" title={tooltipTitle}>
      <mui.Box
        className={classes.progressBar}
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {bars}
      </mui.Box>
    </mui.Tooltip>
  );
}
