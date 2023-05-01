import React from 'react';
import { Bar, BarChart, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useBuildStatusColorMapping } from '../../utils/colors';
import { formatDuration } from '../../utils/time';
import { navigateBuildHelper } from '../../utils/navigateHelper';
import { NodeOfConnection } from '../../utils/utility-types';
import { RepositoryBuildList_repository } from '../repositories/__generated__/RepositoryBuildList_repository.graphql';
import { withStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography } from '@mui/material';
import { useSelectedBuildContext } from '../../contexts/SelectedBuildContext';

interface Props {
  builds: NodeOfConnection<RepositoryBuildList_repository['builds']>[];
}

function BuildDurationsChart(props: Props) {
  const { buildId, setBuildId } = useSelectedBuildContext();
  let navigate = useNavigate();
  let statusColorMapping = useBuildStatusColorMapping();
  let { builds } = props;
  let maxDuration = Math.max(...builds.map(build => build.clockDurationInSeconds || 0));
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
    <ResponsiveContainer debounce={300} height="100%" width="100%">
      <BarChart data={builds}>
        <YAxis dataKey="clockDurationInSeconds" tickFormatter={formatDuration} ticks={ticks} />
        <XAxis dataKey="changeMessageTitle" hide />
        <Tooltip cursor={false} content={BuildDurationsChartTooltip} />
        <Bar
          dataKey="clockDurationInSeconds"
          isAnimationActive={false}
          shape={props => renderBuildBar(props, buildId)}
          onClick={(build, index, event) => navigateBuildHelper(navigate, event, build.id)}
          onMouseEnter={entry => setBuildId(entry.id)}
          onMouseLeave={() => setBuildId('0')}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default withStyles({})(BuildDurationsChart);
