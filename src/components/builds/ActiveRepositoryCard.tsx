import React, { useMemo } from 'react';
import { useFragment, useSubscription } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';

import { makeStyles } from '@mui/styles';
import { createTheme } from '@mui/material/styles';
import { muiThemeOptions } from '../../cirrusTheme';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import BuildStatusChipNew from '../chips/BuildStatusChipNew';
import RepositoryOwnerChipNew from '../chips/RepositoryOwnerChipNew';
import RepositoryNameChipNew from '../chips/RepositoryNameChipNew';
import { navigateBuildHelper } from '../../utils/navigateHelper';

import { ActiveRepositoryCard_repository$key } from './__generated__/ActiveRepositoryCard_repository.graphql';

const buildSubscription = graphql`
  subscription ActiveRepositoryCardSubscription($repositoryID: ID!) {
    repository(id: $repositoryID) {
      ...ActiveRepositoryCard_repository
    }
  }
`;

const useStyles = makeStyles(theme => {
  return {
    commitName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      whiteSpace: 'normal',
    },
  };
});

interface Props {
  repository: ActiveRepositoryCard_repository$key;
}

export default function ActiveRepositoryCard(props: Props) {
  let repository = useFragment(
    graphql`
      fragment ActiveRepositoryCard_repository on Repository {
        id
        lastDefaultBranchBuild {
          id
          changeMessageTitle
          ...BuildStatusChipNew_build
        }
        ...RepositoryNameChipNew_repository
        ...RepositoryOwnerChipNew_repository
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

  let themeOptions = useRecoilValue(muiThemeOptions);
  const muiTheme = useMemo(() => createTheme(themeOptions), [themeOptions]);

  let classes = useStyles();
  let build = repository.lastDefaultBranchBuild;
  if (!build) {
    return null;
  }
  return (
    <ThemeProvider theme={muiTheme}>
      <Paper
        sx={{
          px: 1,
          py: 1.5,
          width: '100%',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: muiTheme.palette.action.hover,
            outline: `1px solid ${muiTheme.palette.action.selected}`,
          },
        }}
        elevation={muiTheme.palette.mode === 'dark' ? 1 : 0}
        onClick={e => navigateBuildHelper(navigate, e, build.id)}
        onAuxClick={e => navigateBuildHelper(navigate, e, build.id)}
      >
        {/* REPO OWNER  */}
        <Grid container spacing={1} mb={1} wrap="nowrap">
          <Grid>
            <RepositoryNameChipNew withHeader repository={repository} />
          </Grid>
          <Grid>
            <RepositoryOwnerChipNew withHeader repository={repository} />
          </Grid>
        </Grid>

        {/* LAST СOMMIT STATUS MESSAGE*/}
        <Stack direction="row" alignItems={'center'}>
          <BuildStatusChipNew build={build} mini />
          <Typography
            className={classes.commitName}
            variant="subtitle1"
            title={build.changeMessageTitle}
            lineHeight={1.3}
            ml={0.5}
            mb={0}
          >
            {build.changeMessageTitle}
          </Typography>
        </Stack>
      </Paper>
    </ThemeProvider>
  );
}
