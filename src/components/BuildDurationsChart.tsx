import React from 'react';
import { Bar, BarChart, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { buildStatusColor } from '../utils/colors';
import { formatDuration } from '../utils/time';
import { navigateBuild } from '../utils/navigate';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import PropTypes from 'prop-types';
import { RepositoryBuildList_repository } from './__generated__/RepositoryBuildList_repository.graphql';
import { NodeOfConnection, UnspecifiedCallbackFunction } from '../utils/utility-types';

const BuildDurationsChartTooltip = props => {
  let style = {
    padding: 4,
    backgroundColor: '#FFF',
  };
  return <p style={style}>{props.label}</p>;
};

interface Props extends RouteComponentProps {
  builds: NodeOfConnection<RepositoryBuildList_repository['builds']>[];
  selectedBuildId: number;
  onSelectBuildId: UnspecifiedCallbackFunction;
}

class BuildDurationsChart extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  static renderBuildBar(props, selectedBuildId) {
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
          fill={buildStatusColor(props.status)}
          className="recharts-bar-rectangle"
        />
      );
    }
    return <Rectangle {...props} fill={buildStatusColor(props.status)} className="recharts-bar-rectangle" />;
  }

  render() {
    let { builds, selectedBuildId, onSelectBuildId } = this.props;
    let maxDuration = Math.max(...builds.map(build => build.durationInSeconds));
    let ticks = [0];
    for (let nextTick = 60; nextTick < maxDuration; nextTick += 60) {
      ticks.push(nextTick);
    }
    return (
      <ResponsiveContainer height="100%" width="100%">
        <BarChart data={builds}>
          <YAxis dataKey="durationInSeconds" tickFormatter={formatDuration} ticks={ticks} />
          <XAxis dataKey="changeMessageTitle" hide={true} />
          <Tooltip content={<BuildDurationsChartTooltip />} />
          <Bar
            dataKey="durationInSeconds"
            isAnimationActive={false}
            shape={props => BuildDurationsChart.renderBuildBar(props, selectedBuildId)}
            onClick={(build, index, event) => navigateBuild(this.context.router, event, build.id)}
            onMouseEnter={entry => onSelectBuildId(entry.id)}
            onMouseLeave={() => onSelectBuildId('0')}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

export default withRouter(BuildDurationsChart);
