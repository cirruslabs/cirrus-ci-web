import {isTaskFinalStatus} from "../utils/status";
import React from "react";
import {taskStatusColor} from "../utils/colors";

class TaskCommandsProgress extends React.Component {
  render() {
    let task = this.props.task;
    let totalDuration = task.statusDurations.reduce(
      (sum, statusDuration) => sum + statusDuration.durationInSeconds,
      0
    );
    if (!isTaskFinalStatus(task.status)) {
      totalDuration = (Date.now() - task.creationTimestamp) / 1000;
      setTimeout(() => this.forceUpdate(), 1000);
    }

    let bars = [];

    let totalPercent = 0;
    for (let i = 0; i < task.statusDurations.length; ++i) {
      let statusDuration = task.statusDurations[i];
      let isLastBar = i === task.statusDurations.length - 1;

      let percent = 100 * statusDuration.durationInSeconds / totalDuration;
      if (isLastBar) {
        percent = 100 - totalPercent;
      } else {
        totalPercent += percent;
      }
      bars.push(
        <div className="progress-bar"
             role="progressbar"
             key={statusDuration.status}
             style={{width: percent + '%', backgroundColor: taskStatusColor(statusDuration.status)}}
             aria-valuenow={percent}
             aria-valuemin="0"
             aria-valuemax="100">{percent > 10 ? statusDuration.status : ""}</div>
      )
    }

    return (
      <div className="progress">
        {bars}
      </div>
    );
  }
}

export default TaskCommandsProgress
