import React from 'react';
import {BarChart, Bar, Rectangle, ResponsiveContainer} from 'recharts';
import {buildStatusColor} from "../utils/colors";

const BuildBar = (build) => {
  return <Rectangle {...build} fill={buildStatusColor(build.status)} className="recharts-bar-rectangle" />
};

const BuildDurationsChart = ({builds}) => {
  return (
    <ResponsiveContainer height='100%' width='100%'>
      <BarChart data={builds}>
        <Bar shape={BuildBar} dataKey='buildDurationInSeconds'/>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BuildDurationsChart
