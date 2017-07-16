import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import CircularProgress from 'material-ui/CircularProgress';
import {taskStatusColor} from "../utils/colors";

const TaskStatus = ({status}) => {
  switch (status) {
    case "CREATED":
      return <FontIcon className="material-icons" color={taskStatusColor(status)}>cloud</FontIcon>;
    case "EXECUTING":
      return <CircularProgress size={28}/>;
    case "COMPLETED":
      return <FontIcon className="material-icons" color={taskStatusColor(status)}>done</FontIcon>;
    default:
      return <FontIcon className="material-icons" color={taskStatusColor(status)}>error</FontIcon>;
  }
};

export default TaskStatus;
