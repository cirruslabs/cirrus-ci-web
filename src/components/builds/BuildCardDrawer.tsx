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
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import BuildStatusChipNew from '../chips/BuildStatusChipNew';
import RepositoryOwnerChipNew from '../chips/RepositoryOwnerChipNew';
import RepositoryNameChipNew from '../chips/RepositoryNameChipNew';
import { navigateBuildHelper } from '../../utils/navigateHelper';

import { BuildCardDrawer_repository$key } from './__generated__/BuildCardDrawer_repository.graphql';

const buildSubscription = graphql`
  subscription BuildCardDrawerSubscription($repositoryID: ID!) {
    repository(id: $repositoryID) {
      ...BuildCardDrawer_repository
    }
  }
`;

const useStyles = makeStyles(theme => {
  return {
    cardContainer: {
      // boxShadow: '0 16px 52px rgb(0 0 0 / 13%)',
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
        outline: `1px solid ${theme.palette.action.selected}`,
      },
      cursor: 'pointer',
    },
    commitName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      whiteSpace: 'normal',
      [theme.breakpoints.only('xs')]: {
        marginBottom: theme.spacing(2.5),
      },
    },
  };
});

interface Props {
  repository: BuildCardDrawer_repository$key;
}

export default function BuildCardDrawer(props: Props) {
  let repository = useFragment(
    graphql`
      fragment BuildCardDrawer_repository on Repository {
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
        className={classes.cardContainer}
        sx={{ mx: 1, my: 0.5, px: 1, py: 1.5 }}
        elevation={muiTheme.palette.mode === 'dark' ? 1 : 0}
        onClick={e => navigateBuildHelper(navigate, e, build.id)}
        onAuxClick={e => navigateBuildHelper(navigate, e, build.id)}
      >
        <Typography
          className={classes.commitName}
          variant="subtitle1"
          title={build.changeMessageTitle}
          gutterBottom
          lineHeight={1.3}
          ml={0.5}
          mb={2}
        >
          {build.changeMessageTitle}
        </Typography>

        <Grid container spacing={0.5}>
          <Grid>
            <BuildStatusChipNew build={build} />
          </Grid>
          <Grid>
            <RepositoryNameChipNew repository={repository} />
          </Grid>
          <Grid>
            <RepositoryOwnerChipNew repository={repository} />
          </Grid>
        </Grid>
      </Paper>
    </ThemeProvider>
  );
}
