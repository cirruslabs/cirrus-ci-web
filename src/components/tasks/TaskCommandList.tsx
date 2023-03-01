import React from 'react';

import { useCommandStatusColorMapping } from '../../utils/colors';
import TaskCommandLogs from './TaskCommandLogs';
import { formatDuration } from '../../utils/time';
import { isTaskCommandExecuting, isTaskCommandFinalStatus } from '../../utils/status';
import DurationTicker from '../common/DurationTicker';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { useFragment } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import * as queryString from 'query-string';
import { TaskCommandList_task, TaskCommandList_task$key } from './__generated__/TaskCommandList_task.graphql';
import { ItemOfArray } from '../../utils/utility-types';
import { useLocation } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { Box, useTheme } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { prefersDarkModeState } from '../../cirrusTheme';

const useStyles = makeStyles(theme => {
  return {
    details: {
      padding: 0,
    },
  };
});

interface Props {
  task: TaskCommandList_task$key;
}

export default function TaskCommandList(props: Props) {
  let task = useFragment(
    graphql`
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
    props.task,
  );

  let classes = useStyles();
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
        sx={{
          borderStyle: 'hidden hidden hidden solid',
          borderWidth: theme.spacing(prefersDarkMode ? 1.0 : 0.0),
          borderColor: colorMapping[command.status],
        }}
      >
        <Accordion
          TransitionProps={{ unmountOnExit: true, timeout: 400 }}
          style={{ backgroundColor: 'transparent' }}
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
          <AccordionDetails className={classes.details}>
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
