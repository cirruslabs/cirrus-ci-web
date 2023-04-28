import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { useFragment } from 'react-relay';
import { useRecoilValue, atom } from 'recoil';
import { localStorageEffect } from '../../utils/recoil';
import { graphql } from 'babel-plugin-relay/macro';
import cx from 'classnames';

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
import { muiThemeOptions } from '../../cirrusTheme';

import { BuildCard_build$key } from './__generated__/BuildCard_build.graphql';

const useStyles = makeStyles(theme => {
  return {
    card: {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    },
    // For pages with chart
    cardSelected: {
      backgroundColor: theme.palette.action.hover,
    },
    commitName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 1,
      WebkitBoxOrient: 'vertical',
      whiteSpace: 'normal',
      [theme.breakpoints.only('xs')]: {
        marginBottom: theme.spacing(2.5),
      },
    },
  };
});

interface Props {
  build: BuildCard_build$key;
  // For pages with chart
  selectedBuildId?: boolean;
  setSelectedBuildId?: Function;
}

// TODO: move cirrusOpenDrawerState to separate component
const cirrusOpenDrawerState = atom({
  key: 'CirrusOpenDrawer',
  default: false,
  effects_UNSTABLE: [localStorageEffect('CirrusOpenDrawer')],
});

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

  // For default Chip component values
  const themeOptions = useRecoilValue(muiThemeOptions);
  const muiTheme = useMemo(() => createTheme(themeOptions), [themeOptions]);

  // For screens with open Drawer
  const muiThemeWithCustomBreakpoints = createTheme({
    ...muiTheme,
    breakpoints: {
      values: {
        xs: 0,
        sm: 900,
        md: 1200,
        lg: 1600,
        xl: 1800,
      },
    },
  });

  const showChipsHeader = isDrawerOpen
    ? pageWidth >= muiThemeWithCustomBreakpoints.breakpoints.values.md
    : pageWidth >= muiTheme.breakpoints.values.md;

  // For pages with chart
  let rowProps;
  const selectable = !!props.setSelectedBuildId;
  if (selectable) {
    rowProps = {
      onMouseEnter() {
        if (props.selectedBuildId) return;
        props.setSelectedBuildId(build.id);
      },
      onMouseLeave() {
        props.setSelectedBuildId(null);
      },
    };
  }

  return (
    <ThemeProvider theme={isDrawerOpen ? muiThemeWithCustomBreakpoints : muiTheme}>
      <Grid
        className={cx(classes.card, props.selectedBuildId && classes.cardSelected)}
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
        {...rowProps}
      >
        {/* LEFT */}
        <Grid xs={4} sm={3} md={2} mt={{ xs: 1, sm: 0 }}>
          <Grid
            container
            direction="row"
            spacing={{ xs: 0.5, sm: 1 }}
            alignItems={{ xs: 'start', sm: 'center' }}
            wrap="nowrap"
          >
            {/* STATUS UP XS-SCREEN*/}
            <Grid display={{ xs: 'none', sm: 'block' }} minWidth={120} flexShrink={0} py={0}>
              <BuildStatusChipNew build={build} />
            </Grid>

            {/* COMMIT */}
            <Grid xs={9} py={{ xs: 'default', sm: 0 }}>
              <Typography
                className={classes.commitName}
                variant="subtitle1"
                title={build.changeMessageTitle}
                gutterBottom
                lineHeight={1}
              >
                {build.changeMessageTitle}
              </Typography>
              <Hash build={build} />
            </Grid>

            {/* DURATION XS-SCREEN*/}
            <Grid display={{ xs: 'block', sm: 'none' }} xs={3}>
              <Duration build={build} iconFirst />
            </Grid>
          </Grid>
        </Grid>

        {/* RIGHT */}
        <Grid xs={4} sm={1} md={2} mb={{ xs: 1, sm: 0 }}>
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
              {/* TODO: fix mt: md value work incorrectly with custom breakpoint */}
              <Box ml={0.5} mt={{ md: 2 }}>
                <Duration build={build} iconFirst rightAlighment={!showChipsHeader} />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
