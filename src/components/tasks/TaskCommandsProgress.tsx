import { isTaskFinalStatus } from '../../utils/status';
import React, { useEffect, useState } from 'react';
import { useTaskStatusColorMapping } from '../../utils/colors';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import classNames from 'classnames';
import { formatDuration } from '../../utils/time';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { TaskCommandsProgress_task } from './__generated__/TaskCommandsProgress_task.graphql';
import { Box } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import { WithStyles } from '@mui/styles';

const styles = theme =>
  createStyles({
    progressBar: {
      backgroundColor: 'transparent',
      width: '100%',
      minWidth: 100,
    },
    progressBarElement: {
      minHeight: theme.spacing(1.5),
    },
  });

interface Props extends WithStyles<typeof styles> {
  task: TaskCommandsProgress_task;
  className?: string;
}

function TaskCommandsProgress(props: Props) {
  let { task, classes } = props;
  let [totalDuration, setTotalDuration] = useState(
    task.statusDurations.reduce((sum, statusDuration) => sum + statusDuration.durationInSeconds, 0),
  );

  useEffect(() => {
    if (!isTaskFinalStatus(task.status)) {
      const intervalId = setInterval(() => {
        setTotalDuration((Date.now() - task.creationTimestamp) / 1000);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [task.status, task.creationTimestamp]);

  let bars = [];

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
      <Box
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
        <Typography variant="caption" display="block" key={statusDuration.status}>
          {formatDuration(statusDuration.durationInSeconds)}: {statusDuration.status}
        </Typography>
      ))}
    </div>
  );

  return (
    <Tooltip placement="bottom" title={tooltipTitle}>
      <Box
        className={classes.progressBar}
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {bars}
      </Box>
    </Tooltip>
  );
}

export default createFragmentContainer(withStyles(styles)(TaskCommandsProgress), {
  task: graphql`
    fragment TaskCommandsProgress_task on Task {
      status
      creationTimestamp
      statusDurations {
        status
        durationInSeconds
      }
    }
  `,
});
