import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { useFragment } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { useRecoilValue } from 'recoil';

import { makeStyles } from '@mui/styles';
import { createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Hash from '../chips/Hash';
import Duration from '../chips/Duration';
import BuildStatusChipNew from '../chips/BuildStatusChipNew';
import BuildBranchNameChipNew from '../chips/BuildBranchNameChipNew';
import RepositoryNameChipNew from '../chips/RepositoryNameChipNew';
import RepositoryOwnerChipNew from '../chips/RepositoryOwnerChipNew';
import usePageWidth from '../../utils/usePageWidth';
import { navigateBuildHelper } from '../../utils/navigateHelper';
import { muiThemeOptions, cirrusOpenDrawerState } from '../../cirrusTheme';
import useThemeWithAdjustableBreakpoints from '../../utils/useThemeWithAdjustableBreakpoints';

import { BuildCard_build$key } from './__generated__/BuildCard_build.graphql';

const useStyles = makeStyles(theme => {
  return {
    card: {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    },
    commitName: {
      [theme.breakpoints.only('xs')]: {
        marginBottom: theme.spacing(2.5),
      },
    },
  };
});

interface Props {
  build: BuildCard_build$key;
}

export default function BuildCard(props: Props) {
  let build = useFragment(
    graphql`
      fragment BuildCard_build on Build {
        id
        changeMessageTitle
        repository {
          ...RepositoryNameChipNew_repository
          ...RepositoryOwnerChipNew_repository
        }
        ...Hash_build
        ...Duration_build
        ...BuildStatusChipNew_build
        ...BuildBranchNameChipNew_build
      }
    `,
    props.build,
  );

  let classes = useStyles();
  const navigate = useNavigate();
  const isDrawerOpen = useRecoilValue(cirrusOpenDrawerState);

  const pageWidth = usePageWidth();

  let theme = useRecoilValue(muiThemeOptions);
  let themeWithAdjustableBreakpoints = useThemeWithAdjustableBreakpoints(theme);
  const themeForNewDesign = useMemo(
    () => createTheme(themeWithAdjustableBreakpoints),
    [themeWithAdjustableBreakpoints],
  );

  if (!build) {
    return null;
  }

  const showChipsHeader = pageWidth >= themeForNewDesign.breakpoints.values.md;

  return (
    <ThemeProvider theme={themeForNewDesign}>
      <Grid
        className={classes.card}
        container
        columns={4}
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 0.5, sm: 1, md: 3 }}
        mt={{ sm: 0.5, md: 1.5 }}
        alignItems={{ xs: 'start', sm: 'center' }}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
        onClick={e => {
          const target = e.target as HTMLElement;
          if (target.closest('a')) return;
          navigateBuildHelper(navigate, e, build.id);
        }}
        onAuxClick={e => {
          const target = e.target as HTMLElement;
          if (target.closest('a')) return;
          navigateBuildHelper(navigate, e, build.id);
        }}
      >
        {/* LEFT */}
        <Grid xs={4} sm={3} md={2} my={{ sm: 1.5 }} mt={{ xs: 1.5 }}>
          <Grid
            container
            direction="row"
            spacing={{ xs: 1 }}
            alignItems={{ xs: 'start', sm: 'center' }}
            justifyContent={{ xs: 'space-between', sm: 'flex-start' }}
            wrap="nowrap"
          >
            {/* STATUS UP XS-SCREEN*/}
            <Grid display={{ xs: 'none', sm: 'block' }} minWidth={120} flexShrink={0} py={0}>
              <BuildStatusChipNew build={build} />
            </Grid>

            {/* COMMIT */}
            <Grid py={{ xs: 'default', sm: 0 }}>
              <Typography
                className={classes.commitName}
                variant="subtitle1"
                title={build.changeMessageTitle}
                gutterBottom
                lineHeight={1}
                noWrap
              >
                {build.changeMessageTitle}
              </Typography>
              <Hash build={build} />
            </Grid>

            {/* DURATION XS-SCREEN*/}
            <Grid display={{ xs: 'block', sm: 'none' }} width={120}>
              <Duration build={build} iconFirst />
            </Grid>
          </Grid>
        </Grid>

        {/* RIGHT */}
        <Grid xs={4} sm={1} md={2} my={{ sm: 1.5 }} mb={{ xs: 1.5 }}>
          <Grid
            container
            columns={11}
            direction="row"
            spacing={{ xs: 0.5, sm: 1 }}
            alignItems={{ xs: 'start', md: 'center' }}
          >
            {/* STATUS XS-SCREEN */}
            <Grid display={{ xs: 'block', sm: 'none' }}>
              <BuildStatusChipNew build={build} />
            </Grid>

            {/* REPOSITORY */}
            <Grid sm={11} md={3} py={{ sm: 'default', md: 0 }}>
              <RepositoryNameChipNew withHeader={showChipsHeader} repository={build.repository} />
            </Grid>

            {/* OWNER */}
            <Grid sm={11} md={3} py={{ sm: 'default', md: 0 }}>
              <RepositoryOwnerChipNew withHeader={showChipsHeader} repository={build.repository} />
            </Grid>

            {/* BRANCH*/}
            <Grid sm={11} md={3} py={{ sm: 'default', md: 0 }}>
              <BuildBranchNameChipNew withHeader={showChipsHeader} build={build} />
            </Grid>

            {/* DURATION UP XS-SCREEN*/}
            <Grid display={{ xs: 'none', sm: 'block' }} sm={11} md={2} py={{ sm: 'default', md: 0 }}>
              <Box ml={0.5} mt={isDrawerOpen ? { lg: 2 } : { md: 2 }}>
                <Duration build={build} iconFirst rightAlighment={!showChipsHeader} />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
