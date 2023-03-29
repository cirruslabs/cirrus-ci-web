import { useFragment } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import { Tooltip } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { formatDuration } from '../../utils/time';

import { Duration_build$key } from './__generated__/Duration_build.graphql';

interface Props {
  build: Duration_build$key;
  rightAlighment?: boolean;
}

const durationTooltipTitle =
  'Clock duration reflects elapsed time between creation of all tasks for a particular build and completion of the last one of them. Clock duration can be impacted by resource availability, scheduling delays, parallelism constraints and other factors that affect execution of tasks.';

export default function Duration(props: Props) {
  const build = useFragment(
    graphql`
      fragment Duration_build on Build {
        clockDurationInSeconds
      }
    `,
    props.build,
  );

  return (
    <Stack direction="row" alignItems="center" spacing={0.5} justifyContent={props.rightAlighment && 'flex-end'}>
      <Typography variant="subtitle1">
        {build.clockDurationInSeconds ? formatDuration(build.clockDurationInSeconds) : '—'}
      </Typography>
      <Tooltip title={durationTooltipTitle}>
        <AccessTimeIcon fontSize="small" />
      </Tooltip>
    </Stack>
  );
}
