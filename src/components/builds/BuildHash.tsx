import { graphql } from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import { Stack } from '@mui/material';
import { createStyles, withStyles, WithStyles } from '@mui/styles';
import { Commit } from '@mui/icons-material';

import { BuildHash_build } from './__generated__/BuildHash_build.graphql';

const styles = theme =>
  createStyles({
    root: {
      fontFamily: 'Courier',
      color: theme.palette.text.secondary,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 3 * theme.shape.borderRadius,
      width: 'fit-content',
      padding: '1px 5px',
      '& *': { fontSize: '14px !important' },
    },
  });

interface Props extends WithStyles<typeof styles> {
  build: BuildHash_build;
}

const BuildHash = ({ classes, build }: Props) => {
  return (
    <Stack className={classes.root} direction="row" alignItems="center" spacing={0.5}>
      <Commit fontSize="inherit" />
      <span>{build.changeIdInRepo.substr(0, 7)}</span>
    </Stack>
  );
};

export default createFragmentContainer(withStyles(styles)(BuildHash), {
  build: graphql`
    fragment BuildHash_build on Build {
      id
      changeIdInRepo
    }
  `,
});
