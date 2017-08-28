import React from 'react';
import {BarChart, Bar, Rectangle, ResponsiveContainer} from 'recharts';
import {buildStatusColor} from "../utils/colors";

export default class BuildDurationsChart extends React.Component {
  constructor(props) {
    super();
    this.state = {};
    this.handleBuildClear = this.handleBuildClear.bind(this);
    this.handleBuildHover = this.handleBuildHover.bind(this);
    this.renderBuildBar = this.renderBuildBar.bind(this);
  }

  render() {
    let {builds} = this.props;
    return (
      <ResponsiveContainer height='100%' width='100%'>
        <BarChart data={builds}>
          <Bar dataKey='buildDurationInSeconds'
               shape={this.renderBuildBar}
               animationId={Number(this.state.selectedBuildId || "0")}
               onMouseEnter={this.handleBuildHover}
               onMouseLeave={this.handleBuildClear}/>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  renderBuildBar(props) {
    if (props.id === this.state.selectedBuildId) {
      const { x, y, width, height, ...others } = props;
      const sign = height >= 0 ? 1 : -1;
      return <Rectangle {...others}
                        x={x - 2} width={width + 4} y={y - sign * 2} height={height + sign * 2}
                        fill={buildStatusColor(props.status)}
                        className="recharts-bar-rectangle" />

    }
    return <Rectangle {...props} fill={buildStatusColor(props.status)} className="recharts-bar-rectangle" />
  }

  handleBuildClear(entry) {
    this.setState({selectedBuildId: 0})
  }

  handleBuildHover(entry) {
    this.setState({selectedBuildId: entry.id})
  }
}
