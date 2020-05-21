import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import React from 'react';
import { Typography, withStyles, WithStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { TaskExecutionInfo_task } from './__generated__/TaskExecutionInfo_task.graphql';
import { cirrusColors } from '../../cirrusTheme';
import { formatDuration } from '../../utils/time';

let styles = {
  chip: {
    marginTop: 4,
    marginBottom: 4,
    marginRight: 4,
  },
};

interface Props extends RouteComponentProps, WithStyles<typeof styles> {
  task: TaskExecutionInfo_task;
}

class TaskExecutionInfo extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  render() {
    let { task, classes } = this.props;

    if (!task.executionInfo) return null;

    return (
      <div>
        {task.executionInfo.labels.map(label => {
          return <Chip key={label} className={classes.chip} label={label} />;
        })}
        <div className="row">
          {this.renderCPUChart()}
          {this.renderMemoryChart()}
        </div>
      </div>
    );
  }

  renderCPUChart() {
    let { task } = this.props;
    let info = task.executionInfo;

    if (!info.cpuChart) return null;
    if (info.cpuChart.points.length < 2) return null;
    let chartPoints = Array(info.cpuChart.points.length);
    info.cpuChart.points.forEach((point, index) => {
      chartPoints[index] = {
        'Requested CPUs': task.instanceResources.cpu,
        'Used CPUs': point.value,
        TimestampLabel: formatDuration(point.secondsFromStart),
      };
    });
    return (
      <div className="col">
        <Typography variant="h6" align="center" className="align-middle">
          CPU Usage
        </Typography>
        <ResponsiveContainer height={200} width="100%">
          <AreaChart data={chartPoints}>
            <CartesianGrid />
            <Area type="monotone" dataKey="Requested CPUs" stroke={null} fill={cirrusColors.lightInitialization} />
            <Area
              type="monotone"
              dataKey="Used CPUs"
              stroke={cirrusColors.darkSuccess}
              fill={cirrusColors.lightSuccess}
            />
            <Tooltip labelFormatter={index => `Time: ${chartPoints[index].TimestampLabel}`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  renderMemoryChart() {
    let { task } = this.props;
    let info = task.executionInfo;

    if (!info.memoryChart) return null;
    if (info.memoryChart.points.length < 2) return null;

    let chartPoints = Array(info.memoryChart.points.length);
    let memoryUnit = task.instanceResources.memory > 1024 ? 'Gb' : 'Mb';
    info.memoryChart.points.forEach((point, index) => {
      if (memoryUnit === 'Gb') {
        chartPoints[index] = {
          'Requested Memory': (task.instanceResources.memory / 1024.0).toFixed(2),
          'Used Memory': (point.value / 1024.0).toFixed(2),
          TimestampLabel: formatDuration(point.secondsFromStart),
        };
      } else {
        chartPoints[index] = {
          'Requested Memory': task.instanceResources.memory,
          'Used Memory': point.value,
          TimestampLabel: formatDuration(point.secondsFromStart),
        };
      }
    });
    return (
      <div className="col">
        <Typography variant="h6" align="center" className="align-middle">
          Memory Usage ({memoryUnit})
        </Typography>
        <ResponsiveContainer height={200} width="100%">
          <AreaChart data={chartPoints}>
            <CartesianGrid />
            <Area type="monotone" dataKey="Requested Memory" stroke={null} fill={cirrusColors.lightInitialization} />
            <Area
              type="monotone"
              dataKey="Used Memory"
              stroke={cirrusColors.darkSuccess}
              fill={cirrusColors.lightSuccess}
            />
            <Tooltip labelFormatter={index => `Time: ${chartPoints[index].TimestampLabel}`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default createFragmentContainer(withStyles(styles)(withRouter(TaskExecutionInfo)), {
  task: graphql`
    fragment TaskExecutionInfo_task on Task {
      instanceResources {
        cpu
        memory
      }
      executionInfo {
        labels
        cpuChart {
          points {
            value
            secondsFromStart
          }
        }
        memoryChart {
          points {
            value
            secondsFromStart
          }
        }
      }
    }
  `,
});
