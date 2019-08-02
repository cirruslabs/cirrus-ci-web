import PropTypes from 'prop-types';
import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { commandStatusColor } from '../utils/colors';
import TaskCommandLogs from './TaskCommandLogs';
import { formatDuration } from '../utils/time';
import { isTaskCommandExecuting, isTaskCommandFinalStatus, isTaskFinalStatus } from '../utils/status';
import DurationTicker from './DurationTicker';
import { withStyles, WithStyles } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import * as queryString from 'query-string';
import { TaskCommandList_task } from './__generated__/TaskCommandList_task.graphql';
import { ItemOfArray } from '../utils/utility-types';

const styles = {
  details: {
    padding: 0,
  },
};

interface Props extends RouteComponentProps, WithStyles<typeof styles> {
  task: TaskCommandList_task;
}

interface State {
  userChosenCommandExpansionState: { [taskName: string]: boolean };
}

class TaskCommandList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { userChosenCommandExpansionState: {} };
  }

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

  setUserChosenCommandExpansionState(commandName: string, expanded: boolean) {
    this.setState({
      userChosenCommandExpansionState: {
        ...this.state.userChosenCommandExpansionState,
        [commandName]: expanded,
      },
    });
  }

  commandItem(command: ItemOfArray<TaskCommandList_task['commands']>, commandStartTimestamp: number) {
    let { classes } = this.props;
    const selectedCommandName = queryString.parse(this.props.location.search).command;
    let styles = {
      header: {
        backgroundColor: commandStatusColor(command.status),
      },
    };
    let finished = command.durationInSeconds > 0 || isTaskCommandFinalStatus(command.status);
    let expandable = command.name === selectedCommandName || finished || !isTaskFinalStatus(this.props.task.status);

    const isCommandExpanded = this.state.userChosenCommandExpansionState.hasOwnProperty(command.name)
      ? this.state.userChosenCommandExpansionState[command.name]
      : command.name === selectedCommandName || command.status === 'FAILURE' || command.status === 'EXECUTING';

    return (
      <ExpansionPanel
        key={command.name}
        TransitionProps={{ unmountOnExit: true, timeout: 400 }}
        disabled={!expandable}
        onChange={() => this.setUserChosenCommandExpansionState(command.name, !isCommandExpanded)}
        expanded={isCommandExpanded}
      >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={styles.header}>
          <div>
            <Typography variant="body1">{command.name}</Typography>
            <Typography variant="caption">
              {finished ? (
                formatDuration(command.durationInSeconds)
              ) : isTaskCommandExecuting(command.status) ? (
                <DurationTicker startTimestamp={commandStartTimestamp} />
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
