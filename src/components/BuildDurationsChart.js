import React from 'react';
import {BarChart, Bar, Rectangle, ResponsiveContainer} from 'recharts';
import {buildStatusColor} from "../utils/colors";

export default class BuildDurationsChart extends React.Component {
  constructor(props) {
    super();
    this.renderBuildBar = this.renderBuildBar.bind(this);
  }

  render() {
    let {builds, selectedBuildId, onSelectBuildId} = this.props;
    return (
      <ResponsiveContainer height='100%' width='100%'>
        <BarChart data={builds}>
          <Bar dataKey='durationInSeconds'
               shape={(props) => this.renderBuildBar(props, selectedBuildId)}
               animationId={Number(selectedBuildId)}
               onMouseEnter={(entry) => onSelectBuildId(entry.id)}
               onMouseLeave={() => onSelectBuildId("0")}/>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  renderBuildBar(props, selectedBuildId) {
    if (props.id === selectedBuildId) {
      const { x, y, width, height, ...others } = props;
      const sign = height >= 0 ? 1 : -1;
      return <Rectangle {...others}
                        x={x - 2} width={width + 4} y={y - sign * 2} height={height + sign * 2}
                        fill={buildStatusColor(props.status)}
                        className="recharts-bar-rectangle" />

    }
    return <Rectangle {...props} fill={buildStatusColor(props.status)} className="recharts-bar-rectangle" />
  }
}
