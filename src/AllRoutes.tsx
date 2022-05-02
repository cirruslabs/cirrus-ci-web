import React, { Suspense } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import ActiveRepositoriesDrawer from './scenes/Header/ActiveRepositoriesDrawer';
import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import BookIcon from '@mui/icons-material/Book';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import classNames from 'classnames';
import ViewerTopRepositories from './scenes/Profile/ViewerTopRepositories';
import CirrusLinearProgress from './components/common/CirrusLinearProgress';
import ThemeSwitchButton from './components/common/ThemeSwitchButton';
import { atom, useRecoilState } from 'recoil';
import { localStorageEffect } from './utils/recoil';
import { Container, Tooltip, useTheme } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import GCPStatus from './components/status/GCPStatus';
import GitHubStatus from './components/status/GitHubStatus';

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

export const styles = theme =>
  createStyles({
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
    titleShift: {
      marginLeft: 2 * theme.spacing(1.0),
    },
    marginRight: {
      marginRight: theme.spacing(1.0),
    },
    appFrame: {
      width: '100%',
      height: '100%',
      zIndex: 1,
      position: 'relative',
      display: 'flex',
    },
    appBar: {
      position: 'absolute',
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    shiftedFixedWidth: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
    appBarShift: {
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingTop: '0',
      backgroundColor: theme.palette.action.disabledBackground,
      ...theme.mixins.toolbar,
    },
    drawerPaper: {
      position: 'relative',
      width: drawerWidth,
    },
    routesPadding: {
      paddingTop: theme.spacing(1.0),
    },
    topRepositories: {
      width: drawerWidth,
      height: '100%',
    },
    content: {
      flexGrow: 1,
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
  });

const cirrusOpenDrawerState = atom({
  key: 'CirrusOpenDrawer',
  default: false,
  effects_UNSTABLE: [localStorageEffect('CirrusOpenDrawer')],
});

function AllRoutes(props: WithStyles<typeof styles>) {
  let { classes } = props;

  let theme = useTheme();
  const [openDrawer, setOpenDrawer] = useRecoilState(cirrusOpenDrawerState);

  function getNavbarTitleStyling() {
    const shared = { cursor: 'pointer' };
    return openDrawer ? { marginLeft: '15px', ...shared } : shared;
  }

  const drawer = (
    <nav>
      <Drawer
        variant="persistent"
        open={openDrawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <Typography variant="h6" color="inherit">
            Active Repositories
          </Typography>
          <IconButton onClick={() => setOpenDrawer(false)} size="large">
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <ViewerTopRepositories className={classes.topRepositories} />
      </Drawer>
    </nav>
  );

  return (
    <BrowserRouter>
      <div className={classes.appFrame}>
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
              <ActiveRepositoriesDrawer />
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
          <Container
            className={openDrawer ? '' : classes.routesPadding}
            maxWidth={openDrawer ? false : 'lg'}
            disableGutters={openDrawer}
          >
            <Suspense fallback={<CirrusLinearProgress />}>
              <Routes>
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
              </Routes>
            </Suspense>
          </Container>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default withStyles(styles)(AllRoutes);
