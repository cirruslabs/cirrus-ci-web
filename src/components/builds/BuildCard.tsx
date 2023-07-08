import { ThemeProvider } from '@emotion/react';
import { useMemo } from 'react';
import { useFragment } from 'react-relay';
import { useNavigate } from 'react-router-dom';

import { graphql } from 'babel-plugin-relay/macro';
import { useRecoilValue } from 'recoil';

import { muiThemeOptions, cirrusOpenDrawerState } from 'cirrusTheme';
import mui from 'mui';

import BuildBranchNameChipNew from 'components/chips/BuildBranchNameChipNew';
import BuildStatusChipNew from 'components/chips/BuildStatusChipNew';
import Duration from 'components/chips/Duration';
import Hash from 'components/chips/Hash';
import RepositoryNameChipNew from 'components/chips/RepositoryNameChipNew';
import RepositoryOwnerChipNew from 'components/chips/RepositoryOwnerChipNew';
import { navigateBuildHelper } from 'utils/navigateHelper';
import usePageWidth from 'utils/usePageWidth';
import useThemeWithAdjustableBreakpoints from 'utils/useThemeWithAdjustableBreakpoints';

import { BuildCard_build$key } from './__generated__/BuildCard_build.graphql';
import Box from "@mui/material/Box";

const useStyles = mui.makeStyles(theme => {
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
    () => mui.createTheme(themeWithAdjustableBreakpoints),
    [themeWithAdjustableBreakpoints],
  );

  if (!build) {
    return null;
  }

  const showChipsHeader = pageWidth >= themeForNewDesign.breakpoints.values.md;

  return (
    <ThemeProvider theme={themeForNewDesign}>
      <mui.Grid
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
        <mui.Grid xs={4} sm={3} md={2} my={{ sm: 1.5 }} mt={{ xs: 1.5 }}>
          <mui.Grid
            container
            direction="row"
            spacing={{ xs: 1 }}
            alignItems={{ xs: 'start', sm: 'center' }}
            justifyContent={{ xs: 'space-between', sm: 'flex-start' }}
            wrap="nowrap"
          >
            {/* STATUS UP XS-SCREEN*/}
            <mui.Grid display={{ xs: 'none', sm: 'block' }} minWidth={120} flexShrink={0} py={0}>
              <BuildStatusChipNew build={build} />
            </mui.Grid>

            {/* COMMIT */}
            <mui.Grid py={{ xs: 'default', sm: 0 }}>
              <mui.Typography
                className={classes.commitName}
                variant="subtitle1"
                title={build.changeMessageTitle}
                gutterBottom
                lineHeight={1}
                noWrap
              >
                {build.changeMessageTitle}
              </mui.Typography>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Hash build={build} />
              </Box>
            </mui.Grid>

            {/* DURATION XS-SCREEN*/}
            <mui.Grid display={{ xs: 'block', sm: 'none' }} width={120}>
              <Duration build={build} iconFirst />
            </mui.Grid>
          </mui.Grid>
        </mui.Grid>

        {/* RIGHT */}
        <mui.Grid xs={4} sm={1} md={2} my={{ sm: 1.5 }} mb={{ xs: 1.5 }}>
          <mui.Grid
            container
            columns={11}
            direction="row"
            spacing={{ xs: 0.5, sm: 1 }}
            alignItems={{ xs: 'start', md: 'center' }}
          >
            {/* STATUS XS-SCREEN */}
            <mui.Grid display={{ xs: 'block', sm: 'none' }}>
              <BuildStatusChipNew build={build} />
            </mui.Grid>

            {/* REPOSITORY */}
            <mui.Grid sm={11} md={3} py={{ sm: 'default', md: 0 }}>
              <RepositoryNameChipNew withHeader={showChipsHeader} repository={build.repository} />
            </mui.Grid>

            {/* OWNER */}
            <mui.Grid sm={11} md={3} py={{ sm: 'default', md: 0 }}>
              <RepositoryOwnerChipNew withHeader={showChipsHeader} repository={build.repository} />
            </mui.Grid>

            {/* BRANCH*/}
            <mui.Grid sm={11} md={3} py={{ sm: 'default', md: 0 }}>
              <BuildBranchNameChipNew withHeader={showChipsHeader} build={build} />
            </mui.Grid>

            {/* DURATION UP XS-SCREEN*/}
            <mui.Grid display={{ xs: 'none', sm: 'block' }} sm={11} md={2} py={{ sm: 'default', md: 0 }}>
              <mui.Box ml={0.5} mt={isDrawerOpen ? { lg: 2 } : { md: 2 }}>
                <Duration build={build} iconFirst rightAlighment={!showChipsHeader} />
              </mui.Box>
            </mui.Grid>
          </mui.Grid>
        </mui.Grid>
      </mui.Grid>
    </ThemeProvider>
  );
}
