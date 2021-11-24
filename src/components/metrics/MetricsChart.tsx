import React, { useState } from 'react';
import { graphql } from 'babel-plugin-relay/macro';
import Typography from '@mui/material/Typography';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import { createFragmentContainer } from 'react-relay';
import 'react-vis/dist/style.css';
import { FlexibleWidthXYPlot, Hint, LineSeries, VerticalGridLines, XAxis, YAxis } from 'react-vis';
import Chip from '@mui/material/Chip';
import { formatDuration } from '../../utils/time';
import { MetricsChart_chart } from './__generated__/MetricsChart_chart.graphql';

const styles = theme =>
  createStyles({
    title: { 'text-align': 'center' },
  });

interface Props extends WithStyles<typeof styles> {
  chart: MetricsChart_chart;
}

function intervals(intervalIncrement, maxValue) {
  let result = [];
  let value = intervalIncrement;
  while (value < maxValue) {
    result.push(value);
    value += intervalIncrement;
  }
  return result;
}

function MetricsChart(props: Props) {
  let [hoveredPointIndex, setHoveredPointIndex] = useState(null);
  let { chart, classes } = props;

  function _onNearestX(value, { index }) {
    setHoveredPointIndex(index);
  }

  function formatValue(value) {
    if (props.chart.dataUnits === 'seconds') {
      return formatDuration(value);
    }
    return value;
  }

  function intermediateValues() {
    let points = props.chart.points || [];
    let maxValue = 0;
    for (let point of points) {
      if (maxValue < point.value) {
        maxValue = point.value;
      }
    }

    if (props.chart.dataUnits === 'seconds') {
      if (maxValue < 60) return null;
      // 10 minutes
      if (maxValue < 10 * 60) return intervals(60, maxValue);
      // 1 hour
      if (maxValue < 60 * 60) return intervals(60 * 10, maxValue);
      // 10 hour
      if (maxValue < 10 * 60 * 60) return intervals(60 * 60, maxValue);
      // 100 hour
      if (maxValue < 100 * 60 * 60) return intervals(10 * 60 * 60, maxValue);
      // 1000 hour
      if (maxValue < 1000 * 60 * 60) return intervals(100 * 60 * 60, maxValue);
      // 10000 hour
      if (maxValue < 10000 * 60 * 60) return intervals(1000 * 60 * 60, maxValue);
      return intervals(10000 * 60 * 60, maxValue);
    }
    return null;
  }

  let points = chart.points;
  let chartData = points.map(function (point, index) {
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
        <Chip label={formatValue(hoveredPoint.value) + ' on ' + date.toLocaleDateString()} />
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
        onMouseLeave={_ => setHoveredPointIndex(null)}
        onValueMouseOver={v => setHoveredPointIndex(v.x)}
      >
        <LineSeries onNearestX={_onNearestX} data={chartData} />
        <XAxis hideTicks />
        <VerticalGridLines tickValues={chartDateTicks} />
        <YAxis tickValues={intermediateValues()} tickFormat={formatValue.bind(this)} tickLabelAngle={60} />
        {hint}
      </FlexibleWidthXYPlot>
    </div>
  );
}

export default createFragmentContainer(withStyles(styles)(MetricsChart), {
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
