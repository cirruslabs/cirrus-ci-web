import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Bar, BarChart, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import mui from 'mui';

import { RepositoryBuildList_repository$data } from 'components/repositories/__generated__/RepositoryBuildList_repository.graphql';
import { useBuildStatusColorMapping } from 'utils/colors';
import { navigateBuildHelper } from 'utils/navigateHelper';
import { formatDuration } from 'utils/time';
import { NodeOfConnection } from 'utils/utility-types';

interface Props {
  builds: NodeOfConnection<RepositoryBuildList_repository$data['builds']>[];
}

function BuildDurationsChart(props: Props) {
  let [selectedBuildId, setSelectedBuildId] = useState<string | null>(null);
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
      <mui.Paper>
        <mui.Typography style={{ margin: 4 }}>
          {formatDuration(payloadElement.value)} {label}
        </mui.Typography>
      </mui.Paper>
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
          cursor="pointer"
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
          shape={props => renderBuildBar(props, selectedBuildId)}
          onClick={(build, index, event) => navigateBuildHelper(navigate, event, build.id)}
          onMouseEnter={entry => setSelectedBuildId(entry.id)}
          onMouseLeave={() => setSelectedBuildId('0')}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default mui.withStyles({})(BuildDurationsChart);
