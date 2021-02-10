import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { TaskExecutionInfo_task } from './__generated__/TaskExecutionInfo_task.graphql';
import { formatDuration } from '../../utils/time';
import { useTheme } from '@material-ui/core';

let styles = {
  chip: {
    marginTop: 4,
    marginBottom: 4,
    marginRight: 4,
  },
};

interface Props extends WithStyles<typeof styles> {
  task: TaskExecutionInfo_task;
}

function TaskExecutionInfo(props: Props) {
  let theme = useTheme();
  let { task, classes } = props;

  if (!task.executionInfo) return null;

  function renderCPUChart() {
    let info = task.executionInfo;
    if (!info.cpuChart) return null;
    if (info.cpuChart.points.length < 2) return null;

    let chartPoints = Array(info.cpuChart.points.length);
    info.cpuChart.points.forEach((point, index) => {
      chartPoints[index] = {
        'Requested CPUs': task.instanceResources.cpu,
        'Used CPUs': Math.min(point.value, task.instanceResources.cpu),
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
            <CartesianGrid stroke={theme.palette.getContrastText(theme.palette.info.dark)} />
            <Area type="monotone" dataKey="Requested CPUs" stroke={null} fill={theme.palette.info.dark} />
            <Area
              type="monotone"
              dataKey="Used CPUs"
              stroke={theme.palette.success.dark}
              fill={theme.palette.success.light}
            />
            <Tooltip labelFormatter={index => `Time: ${chartPoints[index].TimestampLabel}`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  function renderMemoryChart() {
    let info = task.executionInfo;
    if (!info.memoryChart) return null;
    if (info.memoryChart.points.length < 2) return null;

    let chartPoints = Array(info.memoryChart.points.length);
    let memoryUnit = task.instanceResources.memory > 1024 ? 'Gb' : 'Mb';
    info.memoryChart.points.forEach((point, index) => {
      if (memoryUnit === 'Gb') {
        chartPoints[index] = {
          'Requested Memory': (task.instanceResources.memory / 1024.0).toFixed(2),
          'Used Memory': Math.min(point.value / 1024.0, task.instanceResources.memory / 1024.0).toFixed(2),
          TimestampLabel: formatDuration(point.secondsFromStart),
        };
      } else {
        chartPoints[index] = {
          'Requested Memory': task.instanceResources.memory,
          'Used Memory': Math.min(point.value, task.instanceResources.memory),
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
            <CartesianGrid stroke={theme.palette.getContrastText(theme.palette.info.dark)} />
            <Area type="monotone" dataKey="Requested Memory" stroke={null} fill={theme.palette.info.dark} />
            <Area
              type="monotone"
              dataKey="Used Memory"
              stroke={theme.palette.success.dark}
              fill={theme.palette.success.light}
            />
            <Tooltip labelFormatter={index => `Time: ${chartPoints[index].TimestampLabel}`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div>
      {task.executionInfo.labels.map(label => {
        return <Chip key={label} className={classes.chip} label={label} />;
      })}
      <div className="row">
        {renderCPUChart()}
        {renderMemoryChart()}
      </div>
    </div>
  );
}

export default createFragmentContainer(withStyles(styles)(TaskExecutionInfo), {
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
