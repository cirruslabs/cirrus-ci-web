import { BuildStatus } from '../components/chips/__generated__/BuildStatusChip_build.graphql';
import { TaskStatus } from '../components/chips/__generated__/TaskStatusChip_task.graphql';
import { graphql } from 'babel-plugin-relay/macro';
import { TaskCommandStatus } from './__generated__/colors_TaskCommand.graphql';
import { NotificationLevel } from './__generated__/colors_Notification.graphql';
import { useTheme } from '@material-ui/core';
import { cirrusColorsState, prefersDarkModeState } from '../cirrusTheme';
import { useRecoilValue } from 'recoil';

export function useBuildStatusColor(status: BuildStatus) {
  const palette = useTheme().palette;
  return useBuildStatusColorMapping()[status] || palette.warning.main;
}

export function useBuildStatusColorMapping() {
  const palette = useTheme().palette;
  return {
    CREATED: palette.info.main,
    EXECUTING: palette.warning.light,
    COMPLETED: palette.success.main,
    FAILED: palette.error.main,
    ABORTED: palette.error.light,
  };
}

export function useTaskStatusColor(status: TaskStatus) {
  const cirrusColors = useRecoilValue(cirrusColorsState);
  return useTaskStatusColorMapping()[status] || cirrusColors.undefined;
}

export function useTaskStatusColorMapping() {
  const palette = useTheme().palette;
  return {
    CREATED: palette.info.light,
    TRIGGERED: palette.info.light,
    SCHEDULED: palette.info.main,
    EXECUTING: palette.warning.light,
    PAUSED: palette.secondary.main,
    SKIPPED: palette.success.light,
    COMPLETED: palette.success.main,
    ABORTED: palette.error.light,
    FAILED: palette.error.main,
  };
}

export function useHookStatusColor(hook) {
  const palette = useTheme().palette;

  return hook.info.error === '' ? palette.success.main : palette.error.main;
}

export function useFaviconColor(status: BuildStatus | TaskStatus | boolean | null) {
  const palette = useTheme().palette;
  switch (status) {
    case 'COMPLETED':
      return palette.success.main;
    case 'SKIPPED':
      return palette.success.light;
    case 'ABORTED':
      return palette.error.main;
    case 'FAILED':
      return palette.error.main;
    case 'EXECUTING':
    case 'CREATED':
    case 'SCHEDULED':
    case 'PAUSED':
      return palette.warning.light;
    case true:
      return palette.success.main;
    case false:
      return palette.error.main;
    default:
      return palette.primary.main;
  }
}

graphql`
  fragment colors_TaskCommand on TaskCommand {
    status
  }
`;

export function useCommandStatusColor(status: TaskCommandStatus) {
  const cirrusColors = useRecoilValue(cirrusColorsState);
  return useCommandStatusColorMapping()[status] || cirrusColors.undefined;
}

export function useCommandStatusColorMapping() {
  const palette = useTheme().palette;
  const cirrusColors = useRecoilValue(cirrusColorsState);
  const prefersDarkMode = useRecoilValue(prefersDarkModeState);
  return {
    SUCCESS: prefersDarkMode ? palette.success.dark : palette.success.light,
    EXECUTING: prefersDarkMode ? palette.warning.dark : palette.warning.light,
    FAILURE: prefersDarkMode ? palette.error.dark : palette.error.light,
    ABORTED: prefersDarkMode ? palette.error.dark : palette.error.light,
    SKIPPED: prefersDarkMode ? palette.success.dark : palette.success.light,
    UNDEFINED: cirrusColors.undefined,
  };
}

graphql`
  fragment colors_Notification on Notification {
    level
  }
`;

export function useNotificationColor(level: NotificationLevel) {
  const palette = useTheme().palette;
  const prefersDarkMode = useRecoilValue(prefersDarkModeState);
  switch (level) {
    case 'INFO':
      return prefersDarkMode ? palette.success.dark : palette.success.main;
    case 'ERROR':
      return prefersDarkMode ? palette.error.dark : palette.error.main;
    default:
      return prefersDarkMode ? palette.warning.dark : palette.warning.main;
  }
}
