import React from 'react';

import { useCommandStatusColorMapping } from '../../utils/colors';
import TaskCommandLogs from './TaskCommandLogs';
import { formatDuration } from '../../utils/time';
import { isTaskCommandExecuting, isTaskCommandFinalStatus } from '../../utils/status';
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
import { TaskCommandList_task } from './__generated__/TaskCommandList_task.graphql';
import { ItemOfArray } from '../../utils/utility-types';
import { useLocation } from 'react-router-dom';
import { createStyles } from '@material-ui/styles';
import { Box, useTheme } from '@material-ui/core';
import { useRecoilValue } from 'recoil';
import { prefersDarkModeState } from '../../cirrusTheme';

const styles = theme =>
  createStyles({
    details: {
      padding: 0,
    },
  });

interface Props extends WithStyles<typeof styles> {
  task: TaskCommandList_task;
}

function TaskCommandList(props: Props) {
  let task = props.task;
  let commands = task.commands;

  let commandComponents = [];
  let lastTimestamp = task.executingTimestamp;
  let colorMapping = useCommandStatusColorMapping();
  let location = useLocation();
  let theme = useTheme();
  const prefersDarkMode = useRecoilValue(prefersDarkModeState);

  function commandItem(command: ItemOfArray<TaskCommandList_task['commands']>, commandStartTimestamp: number) {
    let search = queryString.parse(location.search);
    const selectedCommandName = search.command || search.logs;
    let summaryStyle = prefersDarkMode
      ? {}
      : {
          color: theme.palette.getContrastText(colorMapping[command.status]),
          backgroundColor: colorMapping[command.status],
        };

    let finished = command.durationInSeconds > 0 || isTaskCommandFinalStatus(command.status);

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
    } else if (command.type === 'ARTIFACTS') {
      topText = `Upload ${command.name} artifacts`;
    } else {
      topText = command.name;
    }

    return (
      <Box
        key={command.name}
        borderLeft={theme.spacing(prefersDarkMode ? 1.0 : 0.0)}
        borderColor={colorMapping[command.status]}
      >
        <Accordion
          TransitionProps={{ unmountOnExit: true, timeout: 400 }}
          disabled={command.status === 'SKIPPED'}
          defaultExpanded={command.name === selectedCommandName || command.status === 'FAILURE'}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} style={summaryStyle}>
            <div>
              <Typography variant="body1">{topText}</Typography>
              <Typography variant="caption">
                {command.status === 'SKIPPED' ? (
                  'skipped'
                ) : finished ? (
                  formatDuration(command.durationInSeconds)
                ) : isTaskCommandExecuting(command.status) ? (
                  <DurationTicker startTimestamp={commandStartTimestamp} />
                ) : (
                  ''
                )}
              </Typography>
            </div>
          </AccordionSummary>
          <AccordionDetails className={props.classes.details}>
            <TaskCommandLogs taskId={props.task.id} command={command} />
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  }

  for (let i = 0; i < commands.length; ++i) {
    let command = commands[i];
    commandComponents.push(commandItem(command, lastTimestamp));
    lastTimestamp += command.durationInSeconds * 1000;
  }
  return <div>{commandComponents}</div>;
}

export default createFragmentContainer(withStyles(styles)(TaskCommandList), {
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
