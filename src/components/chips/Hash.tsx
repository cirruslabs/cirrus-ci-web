import cx from 'classnames';
import { useFragment } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import { makeStyles } from '@mui/styles';
import Stack from '@mui/material/Stack';
import CommitIcon from '@mui/icons-material/Commit';

import { Hash_build$key } from './__generated__/Hash_build.graphql';

const useStyles = makeStyles(theme => {
  return {
    hash: {
      color: theme.palette.text.secondary,
      fontFamily: 'Courier',
      marginTop: theme.spacing(0.5),
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 3 * theme.shape.borderRadius,
      width: 'fit-content',
      padding: '1px 5px',
      '& *': { fontSize: '14px !important' },
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

  return (
    <Stack className={cx(props.className, classes.hash)} direction="row" alignItems="center" spacing={0.5}>
      <CommitIcon fontSize="inherit" />
      <span>{build.changeIdInRepo.substr(0, 7)}</span>
    </Stack>
  );
}
