import { BuildStatus } from '../components/chips/__generated__/BuildStatusChip_build.graphql';
import { TaskStatus } from '../components/chips/__generated__/TaskStatusChip_task.graphql';
import { graphql } from 'babel-plugin-relay/macro';
import { TaskCommandStatus } from './__generated__/colors_TaskCommand.graphql';
import { NotificationLevel } from './__generated__/colors_Notification.graphql';
import { useTheme } from '@material-ui/core';

export function useBuildStatusColor(status: BuildStatus) {
  const palette = useTheme().palette;
  switch (status) {
    case 'CREATED':
      return palette.info.main;
    case 'EXECUTING':
      return palette.warning.light;
    case 'COMPLETED':
      return palette.success.main;
    case 'FAILED':
      return palette.error.main;
    case 'ABORTED':
      return palette.error.light;
    default:
      return palette.warning.main;
  }
}

export function useTaskStatusColor(status: TaskStatus) {
  const palette = useTheme().palette;
  return useTaskStatusColorMapping()[status] || palette.grey;
}

export function useTaskStatusColorMapping() {
  const palette = useTheme().palette;
  return {
    CREATED: palette.info.light,
    SCHEDULED: palette.info.main,
    EXECUTING: palette.warning.light,
    PAUSED: palette.secondary.main,
    SKIPPED: palette.success.light,
    COMPLETED: palette.success.main,
    ABORTED: palette.error.light,
    FAILED: palette.error.main,
  };
}

export function useFaviconColor(status: BuildStatus | TaskStatus | null) {
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
  const palette = useTheme().palette;
  return useCommandStatusColorMapping()[status] || palette.grey;
}

export function useCommandStatusColorMapping() {
  const palette = useTheme().palette;
  return {
    SUCCESS: palette.success.main,
    EXECUTING: palette.warning.main,
    FAILURE: palette.error.main,
    ABORTED: palette.error.dark,
    SKIPPED: palette.success.main,
  };
}

graphql`
  fragment colors_Notification on Notification {
    level
  }
`;

export function useNotificationColor(level: NotificationLevel) {
  const palette = useTheme().palette;
  switch (level) {
    case 'INFO':
      return palette.success.main;
    case 'ERROR':
      return palette.error.main;
    default:
      return palette.warning.main;
  }
}
