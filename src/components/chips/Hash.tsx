import cx from 'classnames';
import { useFragment } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CommitIcon from '@mui/icons-material/Commit';

import { Hash_build$key } from './__generated__/Hash_build.graphql';

const useStyles = makeStyles(theme => {
  return {
    hash: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: '4px',
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
  const theme = useTheme();

  return (
    <Stack className={cx(props.className, classes.hash)} direction="row" alignItems="center" spacing={0.5}>
      <CommitIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
      <Typography variant="subtitle2" color={theme.palette.text.secondary}>
        {build.changeIdInRepo.substr(0, 7)}
      </Typography>
    </Stack>
  );
}
