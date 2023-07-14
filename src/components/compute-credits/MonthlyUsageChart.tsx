import React, { useState } from 'react';
import { useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { useTheme } from '@mui/material';
import Switch from '@mui/material/Switch';

import mui from '../../mui';
import PlatformIcon from '../icons/PlatformIcon';
import { MonthlyUsageChart_info$key } from './__generated__/MonthlyUsageChart_info.graphql';

interface Props {
  info?: MonthlyUsageChart_info$key;
}

interface UsageChartItem {
  date: string;
  linux: number;
  windows: number;
  darwin: number;
  freebsd: number;
}

export default function MonthlyUsageChart(props: Props) {
  let info = useFragment(
    graphql`
      fragment MonthlyUsageChart_info on OwnerInfo {
        monthlyComputeUsage {
          date
          usageDetails {
            instancePlatform
            instanceArchitecture
            cpuSeconds
            balanceInMicroCredits
          }
        }
      }
    `,
    props.info ?? null,
  );

  let [usageUnit, setUsageUnit] = useState('credits');

  let theme = useTheme();
  let platformColorMapping = {
    darwin: theme.palette.success.main,
    linux: theme.palette.info.main,
    windows: theme.palette.warning.main,
    freebsd: theme.palette.error.main,
  };

  let chartData: UsageChartItem[] = [];

  for (let usage of info?.monthlyComputeUsage || []) {
    let date = usage['date'];
    let chartItem: UsageChartItem = {
      date: date.substring(4, 6) + '/' + date.substring(0, 4),
      linux: 0,
      windows: 0,
      darwin: 0,
      freebsd: 0,
    };
    for (let usageDetail of usage['usageDetails']) {
      let platform = usageDetail['instancePlatform'].toLocaleLowerCase();
      chartItem[platform] = chartItem[platform] || 0;
      if (usageUnit === 'credits') {
        chartItem[platform] += Math.ceil(usageDetail['balanceInMicroCredits'] / 1_000_000);
      } else {
        chartItem[platform] += Math.ceil(usageDetail['cpuSeconds'] / 60 / 60);
      }
    }
    chartData.push(chartItem);
  }

  const UsageTooltip = ({ active, payload, label }) => {
    if (!active) return null;
    return (
      <mui.Paper>
        <mui.List dense={true}>
          {payload.reverse().map(entry => (
            <mui.ListItem id={entry.name}>
              <mui.ListItemIcon>
                <PlatformIcon platform={entry.name} sx={{ color: platformColorMapping[entry.name] }} />
              </mui.ListItemIcon>
              <mui.ListItemText primary={entry.value + ' ' + usageUnit} />
            </mui.ListItem>
          ))}
        </mui.List>
      </mui.Paper>
    );
  };

  return (
    <mui.Card elevation={24}>
      <mui.CardHeader
        title="Free Compute Monthly Usage"
        action={
          <mui.Stack direction="row" spacing={1} alignItems="center">
            <mui.Typography>Credits</mui.Typography>
            <Switch
              checked={usageUnit === 'hours'}
              onClick={event => setUsageUnit(usageUnit === 'credits' ? 'hours' : 'credits')}
            />
            <mui.Typography>CPU Hours</mui.Typography>
          </mui.Stack>
        }
      />
      <mui.CardContent>
        <ResponsiveContainer debounce={300} height="100%" width="100%" minHeight={300}>
          <BarChart data={chartData}>
            <YAxis name={usageUnit} />
            <XAxis dataKey="date" />
            <Tooltip cursor={false} content={UsageTooltip} />
            <Bar stackId="stack" dataKey="darwin" fill={platformColorMapping['darwin']} />
            <Bar stackId="stack" dataKey="linux" fill={platformColorMapping['linux']} />
            <Bar stackId="stack" dataKey="windows" fill={platformColorMapping['windows']} />
            <Bar stackId="stack" dataKey="freebsd" fill={platformColorMapping['freebsd']} />
          </BarChart>
        </ResponsiveContainer>
        <mui.Typography variant="subtitle1">
          <p>Chart above shows usage per platform of compute resources that Cirrus CI provides for free each month.</p>
        </mui.Typography>
      </mui.CardContent>
    </mui.Card>
  );
}
