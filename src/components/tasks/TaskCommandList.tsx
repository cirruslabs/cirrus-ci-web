import PropTypes from 'prop-types';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { commandStatusColor } from '../../utils/colors';
import TaskCommandLogs from './TaskCommandLogs';
import { formatDuration } from '../../utils/time';
import { isTaskCommandExecuting, isTaskCommandFinalStatus, isTaskFinalStatus } from '../../utils/status';
import DurationTicker from '../common/DurationTicker';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import * as queryString from 'query-string';
import { TaskCommandList_task, TaskCommandType } from './__generated__/TaskCommandList_task.graphql';
import { ItemOfArray } from '../../utils/utility-types';

const styles = {
  details: {
    padding: 0,
  },
};

interface Props extends RouteComponentProps, WithStyles<typeof styles> {
  task: TaskCommandList_task;
}

class TaskCommandList extends React.Component<Props> {
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

    // the text at the top (name and type)
    let topText: string;

    if (command.type === 'CLONE') {
      topText = 'Clone';
    } else if (['EXECUTE_SCRIPT', 'EXECUTE_BACKGROUND_SCRIPT'].includes(command.type)) {
      topText = 'Run ' + command.name;
    } else if (command.type === 'CACHE') {
      topText = 'Populate ' + command.name + ' cache';
    } else if (command.type === 'UPLOAD_CACHE') {
      // the upload text is added on the backend
      topText = command.name;
    } else if (command.type === null) {
      // todo: remind Fedor to fix this on the backend
      topText = `Upload ${command.name} artifacts`;
    } else {
      throw new Error(`no way to handle ${command.type}!`);
    }

    return (
      <Accordion
        key={command.name}
        TransitionProps={{ unmountOnExit: true, timeout: 400 }}
        disabled={!expandable}
        defaultExpanded={command.name === selectedCommandName || command.status === 'FAILURE'}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} style={styles.header}>
          <div>
            <Typography variant="body1">{topText}</Typography>
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
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <TaskCommandLogs taskId={this.props.task.id} command={command} />
        </AccordionDetails>
      </Accordion>
    );
  }
}

export default createFragmentContainer(withStyles(styles)(withRouter(TaskCommandList)), {
  task: graphql`
    fragment TaskCommandList_task on Task {
      id
      status
      executingTimestamp
      commands {
        name
        type
        status
        durationInSeconds
      }
    }
  `,
});
