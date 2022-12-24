import { graphql } from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import { useTheme, Stack, Link } from '@mui/material';
import { createStyles, withStyles, WithStyles } from '@mui/styles';
import { EastOutlined } from '@mui/icons-material';

import { absoluteLink } from '../../utils/link';
import BuildStatusChipNew from '../chips/BuildStatusChipNew';
import BuildHash from './BuildHash';
import BuildBranch from './BuildBranch';
import BuildDuration from './BuildDuration';

import { BuildPreview_build } from './__generated__/BuildPreview_build.graphql';

const styles = theme =>
  createStyles({
    commitName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      marginLeft: theme.spacing(1),
    },
    branch: {
      maxWidth: 200,
    },
    arrow: {
      marginLeft: theme.spacing(1.5),
      marginRight: theme.spacing(1.5),
      color: theme.palette.text.disabled,
    },
  });

interface Props extends WithStyles<typeof styles> {
  build: BuildPreview_build;
}

const BuildPreview = ({ classes, build }: Props) => {
  const theme = useTheme();
  return (
    <Stack>
      <Stack direction="row" alignItems="center">
        <BuildStatusChipNew status={build.status} mini />
        <Link
          className={classes.commitName}
          href={absoluteLink('build', build.id)}
          underline="hover"
          title={build.changeMessageTitle}
          noWrap
        >
          {build.changeMessageTitle}
        </Link>
        <EastOutlined className={classes.arrow} />
        <div className={classes.branch}>
          <BuildBranch build={build} tinted />
        </div>
      </Stack>
      <Stack height={theme.spacing(1)} />
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <BuildHash build={build} />
        <BuildDuration build={build} />
      </Stack>
    </Stack>
  );
};

export default createFragmentContainer(withStyles(styles)(BuildPreview), {
  build: graphql`
    fragment BuildPreview_build on Build {
      id
      status
      changeMessageTitle
      ...BuildHash_build
      ...BuildBranch_build
      ...BuildDuration_build
    }
  `,
});
