import React from 'react';
import { graphql } from 'babel-plugin-relay/macro';
import PropTypes from 'prop-types';
import { createStyles, Typography, WithStyles, withStyles } from '@material-ui/core';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { createFragmentContainer } from 'react-relay';
import 'react-vis/dist/style.css';
import { FlexibleWidthXYPlot, Hint, LineSeries, VerticalGridLines, XAxis, YAxis } from 'react-vis';
import Chip from '@material-ui/core/Chip';
import { formatDuration } from '../../utils/time';
import { MetricsChart_chart } from './__generated__/MetricsChart_chart.graphql';

const styles = theme =>
  createStyles({
    title: { 'text-align': 'center' },
    chip: {},
  });

interface Props extends RouteComponentProps, WithStyles<typeof styles> {
  chart: MetricsChart_chart;
}

interface State {
  hoveredPointIndex: number;
}

class MetricsChart extends React.Component<Props, State> {
  static contextTypes = {
    router: PropTypes.object,
  };

  state = {
    hoveredPointIndex: null,
  };

  _onNearestX = (value, { index }) => {
    this.setState({ hoveredPointIndex: index });
  };

  render() {
    let { chart, classes } = this.props;
    let { hoveredPointIndex } = this.state;

    let points = chart.points;
    let chartData = points.map(function(point, index) {
      return { x: index, y: point.value };
    });
    let chartDateTicks = [];
    for (let i = 0; i < points.length; ++i) {
      let point = points[i];
      let pointDate = new Date(point.date.year, point.date.month - 1, point.date.day);
      let isMonday = pointDate.getDay() === 1;
      if (isMonday) {
        chartDateTicks.push(i);
      }
    }

    let hint = null;
    if (hoveredPointIndex) {
      let hoveredPoint = points[hoveredPointIndex];
      let date = new Date(hoveredPoint.date.year, hoveredPoint.date.month - 1, hoveredPoint.date.day);
      hint = (
        <Hint value={chartData[hoveredPointIndex]}>
          <Chip
            className={classes.chip}
            label={this.formatValue(hoveredPoint.value) + ' on ' + date.toLocaleDateString()}
          />
        </Hint>
      );
    }

    return (
      <div>
        <Typography variant="h4" className={classes.title}>
          {chart.title}
        </Typography>
        <FlexibleWidthXYPlot
          height={300}
          xType="time"
          onMouseLeave={_ => this.setState({ hoveredPointIndex: null })}
          onValueMouseOver={v => this.setState({ hoveredPointIndex: v.x })}
        >
          <LineSeries onNearestX={this._onNearestX} data={chartData} />
          <XAxis hideTicks />
          <VerticalGridLines tickValues={chartDateTicks} />
          <YAxis tickValues={this.intermediateValues()} tickFormat={this.formatValue.bind(this)} tickLabelAngle={60} />
          {hint}
        </FlexibleWidthXYPlot>
      </div>
    );
  }

  formatValue(value) {
    if (this.props.chart.dataUnits === 'seconds') {
      return formatDuration(value);
    }
    return value;
  }

  intermediateValues() {
    let points = this.props.chart.points || [];
    let maxValue = 0;
    for (let point of points) {
      if (maxValue < point.value) {
        maxValue = point.value;
      }
    }

    if (this.props.chart.dataUnits === 'seconds') {
      if (maxValue < 60) return null;
      // 10 minutes
      if (maxValue < 10 * 60) return MetricsChart.intervals(60, maxValue);
      // 1 hour
      if (maxValue < 60 * 60) return MetricsChart.intervals(60 * 10, maxValue);
      // 10 hour
      if (maxValue < 10 * 60 * 60) return MetricsChart.intervals(60 * 60, maxValue);
      // 100 hour
      if (maxValue < 100 * 60 * 60) return MetricsChart.intervals(10 * 60 * 60, maxValue);
      // 1000 hour
      if (maxValue < 1000 * 60 * 60) return MetricsChart.intervals(100 * 60 * 60, maxValue);
      // 10000 hour
      if (maxValue < 10000 * 60 * 60) return MetricsChart.intervals(1000 * 60 * 60, maxValue);
      return MetricsChart.intervals(10000 * 60 * 60, maxValue);
    }
    return null;
  }

  static intervals(intervalIncrement, maxValue) {
    let result = [];
    let value = intervalIncrement;
    while (value < maxValue) {
      result.push(value);
      value += intervalIncrement;
    }
    return result;
  }
}

export default createFragmentContainer(withStyles(styles)(withRouter(MetricsChart)), {
  chart: graphql`
    fragment MetricsChart_chart on MetricsChart {
      title
      dataUnits
      points {
        date {
          year
          month
          day
        }
        value
      }
    }
  `,
});
