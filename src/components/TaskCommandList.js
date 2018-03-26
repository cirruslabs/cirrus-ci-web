import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom'

import {commandStatusColor} from "../utils/colors";
import TaskCommandLogs from "./TaskCommandLogs";
import {formatDuration} from "../utils/time";
import {isTaskCommandExecuting, isTaskCommandFinalStatus, isTaskFinalStatus} from "../utils/status";
import DurationTicker from "./DurationTicker";
import {ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography, withStyles} from "material-ui";
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';

const styles = {
  details: {
    padding: 0,
  }
};

class TaskCommandList extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let commands = this.props.commands;
    let task = this.props.task;

    let commandComponents = [];
    let lastTimestamp = task.executingTimestamp;
    for (let i = 0; i < commands.length; ++i) {
      let command = commands[i];
      commandComponents.push(this.commandItem(command, lastTimestamp));
      lastTimestamp += command.durationInSeconds * 1000
    }
    return (
      <div>
        {commandComponents}
      </div>
    );
  }

  commandItem(command, commandStartTimestamp) {
    let {classes} = this.props;
    let styles = {
      header: {
        backgroundColor: commandStatusColor(command.status),
      },
    };
    let finished = isTaskCommandFinalStatus(command.status);
    let expandable = finished || !isTaskFinalStatus(this.props.task.status);
    return (
      <ExpansionPanel key={command.name}
                      CollapseProps={{unmountOnExit: true, timeout: 400}}
                      disabled={!expandable}
                      defaultExpanded={command.status === 'FAILURE'}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} style={styles.header}>
          <div>
            <Typography variant="body1">{command.name}</Typography>
            <Typography variant="caption">{
              finished
                ? formatDuration(command.durationInSeconds)
                : (isTaskCommandExecuting(command.status) ? <DurationTicker timestamp={commandStartTimestamp}/> : "")
            }</Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <TaskCommandLogs taskId={this.props.task.id} command={command}/>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default withRouter(withStyles(styles)(TaskCommandList));
