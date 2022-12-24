import { graphql } from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import { Stack, Link } from '@mui/material';
import { CallSplit } from '@mui/icons-material';
import { createStyles, withStyles, WithStyles } from '@mui/styles';

import { shorten } from '../../utils/text';
import { absoluteLink } from '../../utils/link';

import { BuildBranch_build } from './__generated__/BuildBranch_build.graphql';

const styles = theme =>
  createStyles({
    root: {
      width: '100%',
    },
    name: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  });

interface Props extends WithStyles<typeof styles> {
  build: BuildBranch_build;
  tinted?: boolean;
}

const BuildBranch = ({ classes, build, tinted = false }: Props) => {
  const href = absoluteLink(build.repository.platform, build.repository.owner, build.repository.name, build.branch);
  return (
    <Stack className={classes.root} direction="row" alignItems="center" spacing={0.5}>
      <CallSplit fontSize="inherit" />
      <Link
        className={classes.name}
        href={href}
        underline="hover"
        noWrap
        title={build.branch}
        {...(tinted && { color: 'text.primary' })}
      >
        {shorten(build.branch)}
      </Link>
    </Stack>
  );
};

export default createFragmentContainer(withStyles(styles)(BuildBranch), {
  build: graphql`
    fragment BuildBranch_build on Build {
      id
      branch
      repository {
        platform
        owner
        name
      }
    }
  `,
});
