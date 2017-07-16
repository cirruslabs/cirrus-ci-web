import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import CircularProgress from 'material-ui/CircularProgress';
import {buildStatusColor} from "../utils/colors";

const BuildStatus = ({status}) => {
  switch (status) {
    case "CREATED":
      return <FontIcon className="material-icons" color={buildStatusColor(status)}>cloud</FontIcon>;
    case "EXECUTING":
      return <CircularProgress size={28}/>;
    case "COMPLETED":
      return <FontIcon className="material-icons" color={buildStatusColor(status)}>done</FontIcon>;
    default:
      return <FontIcon className="material-icons" color={buildStatusColor(status)}>error</FontIcon>;
  }
};

export default BuildStatus;
