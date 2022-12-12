import Chip from '@mui/material/Chip';
import Icon from '@mui/material/Icon';
import { BuildStatus } from './__generated__/BuildStatusChip_build.graphql';

interface Props {
  status: BuildStatus;
}

function BuildStatusChip({ status }: Props) {
  const label =
    {
      CREATED: 'created',
      EXECUTING: 'executing',
      COMPLETED: 'completed',
      FAILED: 'failed',
      ABORTED: 'aborted',
    }[status] || status.toLowerCase();

  const color =
    {
      CREATED: 'secondary',
      EXECUTING: 'info',
      COMPLETED: 'success',
      FAILED: 'error',
      ABORTED: 'warning',
    }[status] || 'error';

  const iconName =
    {
      CREATED: 'cloud_circle_outlined',
      EXECUTING: 'play_circle_outlined',
      COMPLETED: 'check_circle_outlined',
      FAILED: 'error_outline_outlined',
      ABORTED: 'stop_circle_outlined',
    }[status] || 'error_outline_outlined';

  return <Chip label={label} color={color} size="small" variant="outlined" icon={<Icon>{iconName}</Icon>}></Chip>;
}

export default BuildStatusChip;
