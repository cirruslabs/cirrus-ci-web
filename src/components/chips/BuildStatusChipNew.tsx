import Chip from '@mui/material/Chip';
import Icon from '@mui/material/Icon';
import { buildStatusIconName } from '../../utils/status';
import { BuildStatusChip_build } from './__generated__/BuildStatusChip_build.graphql';

interface Props {
  build: BuildStatusChip_build;
}

function BuildStatusChip({ build }: Props) {
  const label = {
    CREATED: 'created',
    EXECUTING: 'executing',
    COMPLETED: 'completed',
    FAILED: 'failed',
    ABORTED: 'aborted',
  }[build.status];

  const color = {
    CREATED: 'info',
    EXECUTING: 'secondary',
    COMPLETED: 'success',
    FAILED: 'error',
    ABORTED: 'warning',
  }[build.status];

  return (
    <Chip
      label={label}
      color={color}
      size="small"
      variant="outlined"
      icon={<Icon>{buildStatusIconName(build.status, true)}</Icon>}
    ></Chip>
  );
}

export default BuildStatusChip;
