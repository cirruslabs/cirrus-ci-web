import React from 'react';
import { Bar, BarChart, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useBuildStatusColorMapping } from '../../utils/colors';
import { formatDuration } from '../../utils/time';
import { navigateBuildHelper } from '../../utils/navigateHelper';
import { NodeOfConnection, UnspecifiedCallbackFunction } from '../../utils/utility-types';
import { RepositoryBuildList_repository } from '../repositories/__generated__/RepositoryBuildList_repository.graphql';
import { withStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography } from '@mui/material';

interface Props {
  builds: NodeOfConnection<RepositoryBuildList_repository['builds']>[];
  selectedBuildId: string;
  onSelectBuildId: UnspecifiedCallbackFunction;
}

function BuildDurationsChart(props: Props) {
  let navigate = useNavigate();
  let statusColorMapping = useBuildStatusColorMapping();
  let { builds, selectedBuildId, onSelectBuildId } = props;
  let maxDuration = Math.max(...builds.map(build => build.durationInSeconds || 0));
  let ticks = [0];
  for (let nextTick = 60; nextTick < maxDuration; nextTick += 60) {
    ticks.push(nextTick);
  }

  const BuildDurationsChartTooltip = ({ active, payload, label }) => {
    if (!active) return null;
    let payloadElement = payload[0];
    if (!payloadElement) return null;
    return (
      <Paper>
        <Typography style={{ margin: 4 }}>
          {formatDuration(payloadElement.value)} {label}
        </Typography>
      </Paper>
    );
  };

  function renderBuildBar(props, selectedBuildId) {
    if (props.id === selectedBuildId) {
      const { x, y, width, height, ...others } = props;
      const sign = height >= 0 ? 1 : -1;
      return (
        <Rectangle
          {...others}
          x={x - 2}
          width={width + 4}
          y={y - sign * 2}
          height={height + sign * 2}
          fill={statusColorMapping[props.status]}
          className="recharts-bar-rectangle"
        />
      );
    }
    return <Rectangle {...props} fill={statusColorMapping[props.status]} className="recharts-bar-rectangle" />;
  }

  return (
    <ResponsiveContainer height="100%" width="100%">
      <BarChart data={builds}>
        <YAxis dataKey="durationInSeconds" tickFormatter={formatDuration} ticks={ticks} />
        <XAxis dataKey="changeMessageTitle" hide />
        <Tooltip cursor={false} content={BuildDurationsChartTooltip} />
        <Bar
          dataKey="durationInSeconds"
          isAnimationActive={false}
          shape={props => renderBuildBar(props, selectedBuildId)}
          onClick={(build, index, event) => navigateBuildHelper(navigate, event, build.id)}
          onMouseEnter={entry => onSelectBuildId(entry.id)}
          onMouseLeave={() => onSelectBuildId('0')}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default withStyles({})(BuildDurationsChart);
