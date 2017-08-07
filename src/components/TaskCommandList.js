import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom'

import {Card, CardHeader, CardText} from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import {commandStatusColor} from "../utils/colors";

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
    return (
      <Card key={command.name}
            style={{borderRadius: 0}}
            initiallyExpanded={command.status === 'FAILURE'}>
        <CardHeader
          title={command.name}
          subtitle={command.durationInSeconds + " seconds"}
          style={headerStyle}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <div>{command.status}</div>
          <FloatingActionButton mini={true}
                                href={this.logURL(command) }>
            <FontIcon className="material-icons">get_app</FontIcon>
          </FloatingActionButton>
        </CardText>
      </Card>
    );
  }

  logURL(command) {
    return "http://api.cirrus-ci.org/v1/task/" + this.props.taskId + "/logs/" + command.name + ".log";
  }
}

export default withRouter(TaskCommandList);
