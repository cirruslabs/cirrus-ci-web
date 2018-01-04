import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom'

import {Card, CardHeader, CardText} from 'material-ui/Card';
import {commandStatusColor} from "../utils/colors";
import TaskCommandLogs from "./TaskCommandLogs";
import {formatDuration} from "../utils/time";
import {isTaskCommandExecuting, isTaskCommandFinalStatus, isTaskFinalStatus} from "../utils/status";
import DurationTicker from "./DurationTicker";
import {cirrusColors} from "../cirrusTheme";

class TaskCommandList extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let styles = {
      divider: {
        widths: '100%',
        height: 1,
        backgroundColor: cirrusColors.undefined
      }
    };
    let commands = this.props.commands;
    let task = this.props.task;

    let commandComponents = [];
    let lastTimestamp = task.executingTimestamp;
    for (let i = 0; i < commands.length; ++i) {
      let command = commands[i];
      if (i > 0) {
        commandComponents.push(<div style={styles.divider}/>);
      }
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
    let styles = {
      header: {
        backgroundColor: commandStatusColor(command.status),
      },
      card: {
        borderRadius: 0,
      }
    };
    let finished = isTaskCommandFinalStatus(command.status);
    let expandable = finished || !isTaskFinalStatus(this.props.task.status);
    return (
      <Card key={command.name}
            style={styles.card}
            initiallyExpanded={command.status === 'FAILURE'}>
        <CardHeader
          title={command.name}
          subtitle={
            finished
              ? formatDuration(command.durationInSeconds)
              : (isTaskCommandExecuting(command.status) ? <DurationTicker timestamp={commandStartTimestamp}/> : "")
          }
          style={styles.header}
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
