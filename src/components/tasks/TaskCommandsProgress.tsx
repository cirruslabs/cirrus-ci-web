import { isTaskFinalStatus } from '../../utils/status';
import React, { useEffect, useState } from 'react';
import { useTaskStatusColorMapping } from '../../utils/colors';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import { formatDuration } from '../../utils/time';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { TaskCommandsProgress_task } from './__generated__/TaskCommandsProgress_task.graphql';

interface Props {
  task: TaskCommandsProgress_task;
  className?: string;
}

function TaskCommandsProgress(props: Props) {
  let { task } = props;
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
      <div
        className="progress-bar"
        role="progressbar"
        key={statusDuration.status}
        style={{ width: percent + '%', backgroundColor: colorMapping[colorStatus] }}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
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
      <div className={classNames(props.className, 'progress')}>{bars}</div>
    </Tooltip>
  );
}

export default createFragmentContainer(TaskCommandsProgress, {
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
