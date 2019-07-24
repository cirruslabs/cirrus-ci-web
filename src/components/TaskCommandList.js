import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';

import { commandStatusColor } from '../utils/colors';
import TaskCommandLogs from './TaskCommandLogs';
import { formatDuration } from '../utils/time';
import { isTaskCommandExecuting, isTaskCommandFinalStatus, isTaskFinalStatus } from '../utils/status';
import DurationTicker from './DurationTicker';
import { withStyles } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import * as queryString from 'query-string';

const styles = {
  details: {
    padding: 0,
  },
};

class TaskCommandList extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  render() {
    let task = this.props.task;
    let commands = task.commands;

    let commandComponents = [];
    let lastTimestamp = task.executingTimestamp;
    for (let i = 0; i < commands.length; ++i) {
      let command = commands[i];
      commandComponents.push(this.commandItem(command, lastTimestamp));
      lastTimestamp += command.durationInSeconds * 1000;
    }
    return <div>{commandComponents}</div>;
  }

  commandItem(command, commandStartTimestamp) {
    let { classes } = this.props;
    const selectedCommandName = queryString.parse(this.props.location.search).command;
    let styles = {
      header: {
        backgroundColor: commandStatusColor(command.status),
      },
    };
    let finished = command.durationInSeconds > 0 || isTaskCommandFinalStatus(command.status);
    let expandable = command.name === selectedCommandName || finished || !isTaskFinalStatus(this.props.task.status);
    return (
      <ExpansionPanel
        key={command.name}
        TransitionProps={{ unmountOnExit: true, timeout: 400 }}
        disabled={!expandable}
        defaultExpanded={command.name === selectedCommandName || command.status === 'FAILURE'}
      >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={styles.header}>
          <div>
            <Typography variant="body1">{command.name}</Typography>
            <Typography variant="caption">
              {finished ? (
                formatDuration(command.durationInSeconds)
              ) : isTaskCommandExecuting(command.status) ? (
                <DurationTicker timestamp={commandStartTimestamp} />
              ) : (
                ''
              )}
            </Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <TaskCommandLogs taskId={this.props.task.id} command={command} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default createFragmentContainer(withRouter(withStyles(styles)(TaskCommandList)), {
  task: graphql`
    fragment TaskCommandList_task on Task {
      id
      status
      executingTimestamp
      commands {
        name
        status
        durationInSeconds
      }
    }
  `,
});
