import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { ThemeProvider } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { graphql } from 'babel-plugin-relay/macro';
import { useFragment, useSubscription } from 'react-relay';
import cx from 'classnames';

import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { createTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import Hash from '../chips/Hash';
import Duration from '../chips/Duration';
import BuildStatusChipNew from '../chips/BuildStatusChipNew';
import RepositoryNameChipNew from '../chips/RepositoryNameChipNew';
import { muiThemeOptions } from '../../cirrusTheme';
import { navigateRepositoryHelper } from '../../utils/navigateHelper';

import { LastDefaultBranchBuildRow_repository$key } from './__generated__/LastDefaultBranchBuildRow_repository.graphql';

const buildSubscription = graphql`
  subscription LastDefaultBranchBuildRowSubscription($repositoryID: ID!) {
    repository(id: $repositoryID) {
      ...LastDefaultBranchBuildRow_repository
    }
  }
`;

const useStyles = makeStyles(theme => {
  return {
    cell: {
      whiteSpace: 'nowrap',
      overflowWrap: 'anywhere',
      textOverflow: 'ellipsis',
    },
    cellRepository: {
      width: 180,
      minWidth: 180,
      maxWidth: 180,
      verticalAlign: 'top',
    },
    container: {
      width: 150,
      flexShrink: 0,
    },
    commitName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'normal',
      // Text truncate doesnt't work here without styles below
      display: '-webkit-box',
      WebkitLineClamp: 1,
      WebkitBoxOrient: 'vertical',
    },
  };
});

interface Props {
  repository: LastDefaultBranchBuildRow_repository$key;
}

export default function LastDefaultBranchBuildRow(props: Props) {
  let repository = useFragment(
    graphql`
      fragment LastDefaultBranchBuildRow_repository on Repository {
        id
        owner
        name
        lastDefaultBranchBuild {
          id
          branch
          changeMessageTitle
          ...Hash_build
          ...Duration_build
          ...BuildStatusChipNew_build
        }
        ...RepositoryNameChipNew_repository
      }
    `,
    props.repository,
  );

  const buildSubscriptionConfig = useMemo(
    () => ({
      variables: { repositoryID: repository.id },
      subscription: buildSubscription,
    }),
    [repository.id],
  );
  useSubscription(buildSubscriptionConfig);

  let navigate = useNavigate();
  let classes = useStyles();
  let theme = useTheme();

  const themeOptions = useRecoilValue(muiThemeOptions);
  const muiTheme = useMemo(() => createTheme(themeOptions), [themeOptions]);

  let build = repository.lastDefaultBranchBuild;

  const LastBuild = () => (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent={{ sm: 'space-between' }}
      alignItems={{ sm: 'end' }}
      // spacing={{ xs: 0.5 }}
    >
      {/* COMMIT */}
      <div>
        <Typography variant="caption" color={theme.palette.text.disabled}>
          Last build
        </Typography>
        <Typography
          className={classes.commitName}
          variant="subtitle1"
          title={build.changeMessageTitle}
          gutterBottom
          lineHeight={1}
          mt={0.5}
          mb={0.5}
        >
          {build.changeMessageTitle}
        </Typography>
        <Box display={{ xs: 'none', sm: 'block' }}>
          <Hash build={build} />
        </Box>
      </div>

      {/* STATUS DURATION */}
      <div className={classes.container}>
        <BuildStatusChipNew build={build} />
        <Box mt={0.5} />
        <Box pl={0.5}>
          <Duration build={build} iconFirst rightAlighment />
        </Box>
      </div>
    </Stack>
  );

  if (!build) {
    return null;
  }
  return (
    <ThemeProvider theme={muiTheme}>
      <TableRow
        key={repository.id}
        onClick={e => navigateRepositoryHelper(navigate, e, repository.owner, repository.name)}
        hover={true}
        style={{ cursor: 'pointer' }}
      >
        {/* REPOSITORY */}
        <TableCell className={cx(classes.cell, classes.cellRepository)}>
          <RepositoryNameChipNew repository={repository} withHeader />
        </TableCell>

        {/* LAST BUILD */}
        <TableCell className={classes.cell}>
          <LastBuild />
        </TableCell>
      </TableRow>
    </ThemeProvider>
  );
}
