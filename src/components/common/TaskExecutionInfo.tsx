import React from 'react';
import { useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useRecoilState } from 'recoil';

import { Box, useTheme } from '@mui/material';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import { prefersDarkModeState } from 'cirrusTheme';

import { formatDuration } from 'utils/time';

import { TaskExecutionInfo_task$key } from './__generated__/TaskExecutionInfo_task.graphql';

const useStyles = makeStyles(theme => {
  return {
    chip: {
      marginTop: 4,
      marginBottom: 4,
      marginRight: 4,
    },
  };
});

interface Props {
  task: TaskExecutionInfo_task$key;
}

export default function TaskExecutionInfo(props: Props) {
  let task = useFragment(
    graphql`
      fragment TaskExecutionInfo_task on Task {
        instanceResources {
          cpu
          memory
        }
        executionInfo {
          labels
          cpuChart {
            maxValue
            points {
              value
              secondsFromStart
            }
          }
          memoryChart {
            maxValue
            points {
              value
              secondsFromStart
            }
          }
        }
      }
    `,
    props.task,
  );

  let theme = useTheme();
  const [prefersDarkMode] = useRecoilState(prefersDarkModeState);
  let classes = useStyles();

  if (!task.executionInfo) return null;

  function renderCPUChart() {
    let info = task.executionInfo;
    if (!info.cpuChart) return null;
    if (info.cpuChart.points.length < 2) return null;

    let chartPoints = Array(info.cpuChart.points.length);
    let requestedCPU = task.instanceResources ? task.instanceResources.cpu : info.cpuChart.maxValue;
    info.cpuChart.points.forEach((point, index) => {
      chartPoints[index] = {
        'Requested CPUs': requestedCPU,
        'Used CPUs': point.value.toFixed(2),
        'Seconds from start': point.secondsFromStart,
      };
    });
    return (
      <Box sx={{ flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <Typography variant="h6" align="center">
          CPU Usage
        </Typography>
        <ResponsiveContainer debounce={300} height={200} width="100%">
          <AreaChart data={chartPoints}>
            <XAxis type="number" domain={[0, 'dataMax']} dataKey="Seconds from start" hide />
            <YAxis type="number" domain={[0, requestedCPU]} hide />
            <CartesianGrid stroke={''} fill={prefersDarkMode ? theme.palette.info.dark : theme.palette.info.light} />
            <Area
              type="monotone"
              dataKey="Used CPUs"
              stroke={theme.palette.success.dark}
              fill={prefersDarkMode ? theme.palette.success.main : theme.palette.success.light}
            />
            <Tooltip
              labelFormatter={(name) => `Time: ${formatDuration(name)}`}
              contentStyle={{ backgroundColor: theme.palette.background.paper }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    );
  }

  function renderMemoryChart() {
    let info = task.executionInfo;
    if (!info.memoryChart) return null;
    if (info.memoryChart.points.length < 2) return null;

    let chartPoints = Array(info.memoryChart.points.length);
    let requestedMemory = task.instanceResources ? task.instanceResources.memory : info.memoryChart.maxValue;
    let memoryUnit = requestedMemory > 1024 ? 'Gb' : 'Mb';
    info.memoryChart.points.forEach((point, index) => {
      if (memoryUnit === 'Gb') {
        chartPoints[index] = {
          'Requested Memory': (requestedMemory / 1024.0).toFixed(2),
          'Used Memory': Math.min(point.value / 1024.0, requestedMemory / 1024.0).toFixed(2),
          'Seconds from start': point.secondsFromStart,
        };
      } else {
        chartPoints[index] = {
          'Requested Memory': requestedMemory,
          'Used Memory': Math.min(point.value, requestedMemory),
          'Seconds from start': point.secondsFromStart,
        };
      }
    });
    return (
      <Box sx={{ flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <Typography variant="h6" align="center">
          Memory Usage ({memoryUnit})
        </Typography>
        <ResponsiveContainer debounce={300} height={200} width="100%">
          <AreaChart data={chartPoints}>
            <XAxis type="number" domain={[0, 'dataMax']} dataKey="Seconds from start" hide />
            <YAxis type="number" domain={[0, memoryUnit === 'Gb' ? requestedMemory / 1024 : requestedMemory]} hide />
            <CartesianGrid stroke={''} fill={prefersDarkMode ? theme.palette.info.dark : theme.palette.info.light} />
            <Area
              type="monotone"
              dataKey="Used Memory"
              stroke={theme.palette.success.dark}
              fill={prefersDarkMode ? theme.palette.success.main : theme.palette.success.light}
            />
            <Tooltip
              labelFormatter={name => `Time: ${formatDuration(name)}`}
              contentStyle={{ backgroundColor: theme.palette.background.paper }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {task.executionInfo.labels.map(label => {
        return <Chip key={label} className={classes.chip} label={label} />;
      })}
      <Box sx={{ flexDirection: 'row', display: 'flex' }}>
        {renderCPUChart()}
        {renderMemoryChart()}
      </Box>
    </div>
  );
}
