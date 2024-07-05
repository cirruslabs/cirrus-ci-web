import * as Sentry from '@sentry/react';
import React, { Suspense } from 'react';
import { useFragment } from 'react-relay';
import { useLocation } from 'react-router-dom';

import { graphql } from 'babel-plugin-relay/macro';
import queryString from 'query-string';
import { useRecoilValue } from 'recoil';

import { prefersDarkModeState } from 'cirrusTheme';
import mui from 'mui';

import CirrusCircularProgress from 'components/common/CirrusCircularProgress';
import DurationTicker from 'components/common/DurationTicker';
import { useCommandStatusColorMapping } from 'utils/colors';
import { isTaskCommandExecuting, isTaskCommandFinalStatus } from 'utils/status';
import { formatDuration } from 'utils/time';
import { ItemOfArray } from 'utils/utility-types';

import TaskCommandLogs from './TaskCommandLogs';
import { TaskCommandList_task$key, TaskCommandList_task$data } from './__generated__/TaskCommandList_task.graphql';

const useStyles = mui.makeStyles(theme => {
  return {
    details: {
      padding: 0,
    },
  };
});

interface Props {
  task: TaskCommandList_task$key;
  stripTimestamps?: boolean;
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

  let commandComponents: Array<JSX.Element> = [];
  let lastTimestamp = task.executingTimestamp;
  let colorMapping = useCommandStatusColorMapping();
  let location = useLocation();
  let theme = mui.useTheme();
  const prefersDarkMode = useRecoilValue(prefersDarkModeState);

  function commandItem(
    command: ItemOfArray<TaskCommandList_task$data['commands']>,
    commandStartTimestamp: number | null = null,
  ) {
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
      <mui.Box
        key={command.name}
        sx={{
          borderStyle: 'hidden hidden hidden solid',
          borderWidth: theme.spacing(prefersDarkMode ? 1.0 : 0.0),
          borderColor: colorMapping[command.status],
        }}
      >
        <mui.Accordion
          TransitionProps={{ unmountOnExit: true, timeout: 400 }}
          style={{ backgroundColor: 'transparent' }}
          disabled={command.status === 'SKIPPED'}
          defaultExpanded={command.name === selectedCommandName || command.status === 'FAILURE'}
        >
          <mui.AccordionSummary expandIcon={<mui.icons.ExpandMore />} style={summaryStyle}>
            <div>
              <mui.Typography variant="body1">{topText}</mui.Typography>
              <mui.Typography variant="caption">
                {command.status === 'SKIPPED' ? (
                  'skipped'
                ) : finished ? (
                  formatDuration(command.durationInSeconds)
                ) : isTaskCommandExecuting(command.status) && commandStartTimestamp ? (
                  <DurationTicker startTimestamp={commandStartTimestamp} />
                ) : (
                  ''
                )}
              </mui.Typography>
            </div>
          </mui.AccordionSummary>
          <mui.AccordionDetails className={classes.details}>
            <Sentry.ErrorBoundary fallback={<CirrusCircularProgress />}>
              <Suspense fallback={<CirrusCircularProgress />}>
                <TaskCommandLogs taskId={task.id} command={command} stripTimestamps={props.stripTimestamps} />
              </Suspense>
            </Sentry.ErrorBoundary>
          </mui.AccordionDetails>
        </mui.Accordion>
      </mui.Box>
    );
  }

  for (let i = 0; i < commands.length; ++i) {
    let command = commands[i];
    commandComponents.push(commandItem(command, lastTimestamp));
    if (lastTimestamp) lastTimestamp += command.durationInSeconds * 1000;
  }
  return <div>{commandComponents}</div>;
}
