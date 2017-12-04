import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom'

import {Card, CardHeader, CardText} from 'material-ui/Card';
import {commandStatusColor} from "../utils/colors";
import TaskCommandLogs from "./TaskCommandLogs";
import {formatDuration} from "../utils/time";
import {isTaskCommandExecuting, isTaskCommandFinalStatus, isTaskFinalStatus} from "../utils/status";
import DurationTicker from "./DurationTicker";

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
    let headerStyle = {
      backgroundColor: commandStatusColor(command.status)
    };
    let finished = isTaskCommandFinalStatus(command.status);
    let expandable = finished || !isTaskFinalStatus(this.props.task.status);
    return (
      <Card key={command.name}
            style={{borderRadius: 0}}
            initiallyExpanded={command.status === 'FAILURE'}>
        <CardHeader
          title={command.name}
          subtitle={
            finished
              ? formatDuration(command.durationInSeconds)
              : (isTaskCommandExecuting(command.status) ? <DurationTicker timestamp={commandStartTimestamp}/> : "")
          }
          style={headerStyle}
          actAsExpander={expandable}
          showExpandableButton={expandable}
        />
        <CardText expandable={true}>
          <TaskCommandLogs taskId={this.props.task.id} command={command}/>
        </CardText>
      </Card>
    );
  }
}

export default withRouter(TaskCommandList);
