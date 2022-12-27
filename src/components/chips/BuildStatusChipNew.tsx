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
      TRIGGERED: 'info',
      CREATED: 'secondary',
      EXECUTING: 'info',
      COMPLETED: 'success',
      FAILED: 'error',
      ABORTED: 'warning',
    }[status] || 'error';

  const icon =
    {
      TRIGGERED: 'play_circle',
      CREATED: 'cloud_circle',
      EXECUTING: 'play_circle',
      COMPLETED: 'check_circle',
      FAILED: 'error_circle',
      ABORTED: 'stop_circle',
    }[status] || 'error_circle';

  return (
    <Chip
      label={label}
      color={color}
      size="small"
      variant="filled"
      icon={<Icon>{icon}</Icon>}
      sx={{
        '& .MuiChip-iconSmall': {
          marginLeft: '5px',
        },
      }}
    ></Chip>
  );
}

export default BuildStatusChip;
