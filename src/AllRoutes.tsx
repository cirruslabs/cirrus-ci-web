import React, { Suspense } from 'react';
import * as Sentry from '@sentry/react';
import { useRecoilState } from 'recoil';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import classNames from 'classnames';

import { makeStyles } from '@mui/styles';
import { Container, Tooltip, useTheme } from '@mui/material';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import BookIcon from '@mui/icons-material/Book';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import useMediaQuery from '@mui/material/useMediaQuery';
import CloseIcon from '@mui/icons-material/Close';
import { grey } from '@mui/material/colors';

import { cirrusOpenDrawerState } from '../src/cirrusTheme';
import GCPStatus from './components/status/GCPStatus';
import GitHubStatus from './components/status/GitHubStatus';
import ThemeSwitchButton from './components/common/ThemeSwitchButton';
import CirrusLinearProgress from './components/common/CirrusLinearProgress';
import ViewerTopRepositories from './scenes/Profile/ViewerTopRepositories';
import ActiveRepositoriesDrawer from './scenes/Header/ActiveRepositoriesDrawer';

const AsyncViewerProfile = React.lazy(() => import('./scenes/Profile/ViewerProfile'));

const AsyncHome = React.lazy(() => import('./scenes/Home/Home'));

const AsyncBuildById = React.lazy(() => import('./scenes/Build/BuildById'));

const AsyncBuildBySHA = React.lazy(() => import('./scenes/Build/BuildBySHA'));

const AsyncRepository = React.lazy(() => import('./scenes/Repository/Repository'));

const AsyncRepositorySettings = React.lazy(() => import('./scenes/RepositorySettings/RepositorySettings'));

const AsyncRepositoryMetrics = React.lazy(() => import('./scenes/RepositoryMetrics/RepositoryMetrics'));

const AsyncTask = React.lazy(() => import('./scenes/Task/Task'));

const AsyncOwnerRepository = React.lazy(() => import('./scenes/Repository/OwnerRepository'));

const AsyncOwner = React.lazy(() => import('./scenes/Owner/Owner'));

const AsyncOwnerSettingsRenderer = React.lazy(() => import('./scenes/Owner/OwnerSettingsRenderer'));

const AsyncPoolById = React.lazy(() => import('./scenes/Workers/PoolById'));

const AsyncHook = React.lazy(() => import('./scenes/Hook/Hook'));

const AsyncApiExplorerRenderer = React.lazy(() => import('./components/explorer/ApiExplorer'));

const drawerWidth = 360;

const useStyles = makeStyles(theme => {
  return {
    flex: {
      flex: 1,
    },
    hide: {
      display: 'none',
    },
    menuButton: {
      margin: theme.spacing(1.0),
    },
    linkButton: {
      color: theme.palette.primary.contrastText,
      marginLeft: 8,
    },
    // Reset ml for <nav> inside mui <Stack>
    nav: {
      marginLeft: '0 !important',
    },
    titleShift: {
      marginLeft: theme.spacing(2.0),
    },
    marginRight: {
      marginRight: theme.spacing(1.0),
    },
    appFrame: {
      width: '100%',
      height: '100%',
    },
    appBar: {
      position: 'absolute',
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      [theme.breakpoints.not('xs')]: {
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
    drawerHeader: {
      ...theme.mixins.toolbar,
    },
    drawerPaper: {
      position: 'relative',
      width: drawerWidth,
      border: 'none',
    },
    topRepositories: {
      width: drawerWidth,
      height: '100%',
    },
    content: {
      flexGrow: 1,
      width: '100%',
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: 0,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      padding: 0,
      marginLeft: 0,
    },
    shiftedFixedWidth: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  };
});

function AllRoutes() {
  let classes = useStyles();
  let theme = useTheme();
  const [openDrawer, setOpenDrawer] = useRecoilState(cirrusOpenDrawerState);

  function getNavbarTitleStyling() {
    const shared = { cursor: 'pointer' };
    return openDrawer ? { marginLeft: '15px', ...shared } : shared;
  }

  const isScreenDownSmSize = useMediaQuery(theme.breakpoints.down('sm'));

  const drawerContent = (
    <Stack px={2} pb={3} sx={{ background: theme.palette.mode === 'light' ? grey[300] : grey[800] }}>
      <Stack className={classes.drawerHeader} direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" color="text.primary">
          Active Repositories
        </Typography>
        <IconButton onClick={() => setOpenDrawer(false)} size="large">
          <CloseIcon />
        </IconButton>
      </Stack>
      <Suspense fallback={<CirrusLinearProgress />}>
        <ViewerTopRepositories className={classes.topRepositories} />
      </Suspense>
    </Stack>
  );

  const drawer = (
    <nav className={classes.nav}>
      <Drawer
        variant="temporary"
        // Prevent body overflow hidden
        open={isScreenDownSmSize && openDrawer}
        onClose={() => setOpenDrawer(false)}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: { xs: '100vw' } },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="persistent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            borderRadius: `0px 0px ${theme.shape.borderRadius * 2}px 0px`,
          },
        }}
        open={openDrawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        {drawerContent}
      </Drawer>
    </nav>
  );

  const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

  return (
    <BrowserRouter>
      <Stack className={classes.appFrame} direction="row" position="relative" zIndex={1}>
        <AppBar
          enableColorOnDark
          position="static"
          className={classNames(classes.appBar, {
            [classes.shiftedFixedWidth]: openDrawer,
            [classes.appBarShift]: openDrawer,
          })}
        >
          <Toolbar disableGutters={true}>
            <IconButton
              color="inherit"
              aria-label="open navigation"
              onClick={() => setOpenDrawer(true)}
              className={classNames(classes.menuButton, openDrawer && classes.hide)}
              size="large"
            >
              <MenuIcon />
            </IconButton>
            <Link to={'/'} style={{ color: theme.palette.primary.contrastText, textDecoration: 'none' }}>
              <Typography
                variant="h6"
                className={classNames({ [classes.titleShift]: openDrawer })}
                style={getNavbarTitleStyling()}
                color="inherit"
              >
                Cirrus CI
              </Typography>
            </Link>
            <div className={classes.flex} />
            <Suspense fallback={<div />}>
              <GCPStatus />
            </Suspense>
            <Suspense fallback={<div />}>
              <GitHubStatus />
            </Suspense>
            <ThemeSwitchButton />
            <Tooltip title="Go to front-end source repository">
              <IconButton
                className={classes.linkButton}
                href="https://github.com/cirruslabs/cirrus-ci-web"
                target="_blank"
                rel="noopener noreferrer"
                size="large"
              >
                <GitHubIcon style={{ color: theme.palette.primary.contrastText }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Go to documentation">
              <IconButton
                className={classes.linkButton}
                href="https://cirrus-ci.org/"
                target="_blank"
                rel="noopener noreferrer"
                size="large"
              >
                <BookIcon style={{ color: theme.palette.primary.contrastText }} />
              </IconButton>
            </Tooltip>
            <div className={classes.marginRight}>
              <Suspense fallback={<CirrusLinearProgress />}>
                <ActiveRepositoriesDrawer />
              </Suspense>
            </div>
          </Toolbar>
        </AppBar>
        {openDrawer ? drawer : null}
        <main
          className={classNames(classes.content, {
            [classes.shiftedFixedWidth]: openDrawer,
            [classes.contentShift]: openDrawer,
          })}
        >
          <div className={classNames('invisible', classes.drawerHeader)} />
          <Container maxWidth={openDrawer ? false : 'lg'}>
            <Suspense fallback={<CirrusLinearProgress />}>
              <SentryRoutes>
                <Route path="/" element={<AsyncHome />} />
                <Route path="explorer" element={<AsyncApiExplorerRenderer />} />
                <Route path="settings/profile" element={<AsyncViewerProfile />} />
                <Route path="settings/:platform/:name" element={<AsyncOwnerSettingsRenderer />} />
                <Route path="settings/repository/:repositoryId" element={<AsyncRepositorySettings />} />
                <Route path="build/:buildId" element={<AsyncBuildById />} />
                <Route path="build/:owner/:name/:SHA" element={<AsyncBuildBySHA />} />
                <Route path=":platform/:owner/:name/*" element={<AsyncOwnerRepository />} />
                <Route path=":platform/:owner/:name" element={<AsyncOwnerRepository />} />
                <Route path=":platform/:owner" element={<AsyncOwner />} />
                <Route path="repository/:repositoryId/*" element={<AsyncRepository />} />
                <Route path="repository/:repositoryId" element={<AsyncRepository />} />
                <Route path="metrics/repository/:platform/:owner/:name" element={<AsyncRepositoryMetrics />} />
                <Route path="task/:taskId" element={<AsyncTask />} />
                <Route path="task/:taskId/hooks" element={<AsyncTask />} />
                <Route path="pool/:poolId" element={<AsyncPoolById />} />
                <Route path="hook/:hookId" element={<AsyncHook />} />
              </SentryRoutes>
            </Suspense>
          </Container>
        </main>
      </Stack>
    </BrowserRouter>
  );
}

export default AllRoutes;
