import { graphql } from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import { Stack } from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import { createStyles, withStyles, WithStyles } from '@mui/styles';

import { formatDuration } from '../../utils/time';

import { BuildDuration_build } from './__generated__/BuildDuration_build.graphql';

const styles = theme =>
  createStyles({
    icon: {
      color: theme.palette.text.secondary,
      position: 'relative',
      top: '-0.5px',
    },
    time: {
      color: theme.palette.text.secondary,
    },
    noTime: {
      paddingLeft: theme.spacing(0.5),
      color: theme.palette.text.secondary,
    },
  });

interface Props extends WithStyles<typeof styles> {
  build: BuildDuration_build;
}

const BuildDuration = ({ classes, build }: Props) => {
  const seconds = build.clockDurationInSeconds;
  return (
    <>
      {seconds ? (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <AccessTime className={classes.icon} />
          <span className={classes.time}>{formatDuration(seconds)}</span>
        </Stack>
      ) : (
        <span className={classes.noTime}>—</span>
      )}
    </>
  );
};

export default createFragmentContainer(withStyles(styles)(BuildDuration), {
  build: graphql`
    fragment BuildDuration_build on Build {
      id
      clockDurationInSeconds
    }
  `,
});
