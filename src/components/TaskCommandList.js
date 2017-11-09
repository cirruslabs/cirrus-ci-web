import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom'

import {Card, CardHeader, CardText} from 'material-ui/Card';
import {commandStatusColor} from "../utils/colors";
import TaskCommandLogs from "./TaskCommandLogs";

class TaskCommandList extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let commands = this.props.commands;
    return (
      <div>
        {commands.map(command => this.commandItem(command))}
      </div>
    );
  }

  commandItem(command) {
    let headerStyle = {
      backgroundColor: commandStatusColor(command.status)
    };
    let expandable = command.status === 'FAILURE' || command.status === 'SUCCESS' || command.status === 'EXECUTING';
    return (
      <Card key={command.name}
            style={{borderRadius: 0}}
            initiallyExpanded={command.status === 'FAILURE'}>
        <CardHeader
          title={command.name}
          subtitle={command.durationInSeconds + " seconds"}
          style={headerStyle}
          actAsExpander={expandable}
          showExpandableButton={expandable}
        />
        <CardText expandable={true}>
          <TaskCommandLogs taskId={this.props.taskId} command={command}/>
        </CardText>
      </Card>
    );
  }
}

export default withRouter(TaskCommandList);
