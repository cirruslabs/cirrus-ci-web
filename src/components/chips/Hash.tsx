import cx from 'classnames';
import { useFragment } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import mui from 'mui';

import { Hash_build$key } from './__generated__/Hash_build.graphql';

const useStyles = mui.makeStyles(theme => {
  return {
    hash: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 3 * theme.shape.borderRadius,
      width: 'fit-content',
      padding: `0 ${theme.spacing(0.5)}`,
    },
  };
});

interface Props {
  build: Hash_build$key;
  className?: string;
}

export default function Hash(props: Props) {
  const build = useFragment(
    graphql`
      fragment Hash_build on Build {
        changeIdInRepo
      }
    `,
    props.build,
  );

  const classes = useStyles();
  const theme = mui.useTheme();

  return (
    <mui.Stack className={cx(props.className, classes.hash)} direction="row" alignItems="center" spacing={0.5}>
      <mui.icons.Commit fontSize="small" sx={{ color: theme.palette.text.secondary }} />
      <mui.Typography variant="subtitle2" color={theme.palette.text.secondary}>
        {build.changeIdInRepo.substr(0, 7)}
      </mui.Typography>
    </mui.Stack>
  );
}
