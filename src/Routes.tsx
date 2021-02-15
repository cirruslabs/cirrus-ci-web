import React, { Suspense } from 'react';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import ActiveRepositoriesDrawer from './scenes/Header/ActiveRepositoriesDrawer';
import NotFound from './scenes/NotFound';
import { navigate } from './utils/navigate';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import BookIcon from '@material-ui/icons/Book';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import classNames from 'classnames';
import ViewerTopRepositories from './scenes/Profile/ViewerTopRepositories';
import CirrusLinearProgress from './components/common/CirrusLinearProgress';
import ThemeSwitchButton from './components/common/ThemeSwitchButton';
import { atom, useRecoilState } from 'recoil';
import { localStorageEffect } from './utils/recoil';
import { Tooltip, useTheme } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
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

const AsyncGitHubRepository = React.lazy(() => import('./scenes/Repository/GitHubRepository'));

const AsyncGitHubOrganization = React.lazy(() => import('./scenes/GitHub/GitHubOrganization'));

const AsyncGitHubOrganizationSettingsRenderer = React.lazy(
  () => import('./scenes/GitHub/GitHubOrganizationSettingsRenderer'),
);

const AsyncPoolById = React.lazy(() => import('./scenes/Workers/PoolById'));

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
      padding: '0',
      backgroundColor: theme.palette.action.disabledBackground,
      ...theme.mixins.toolbar,
    },
    drawerPaper: {
      position: 'relative',
      width: drawerWidth,
    },
    topRepositories: {
      width: drawerWidth,
      height: '100%',
    },
    content: {
      flexGrow: 1,
      paddingTop: theme.spacing(1.0),
      paddingBottom: theme.spacing(1.0),
      paddingLeft: theme.spacing(1.0) * 3,
      paddingRight: theme.spacing(1.0) * 3,
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

function Routes(props: WithStyles<typeof styles>) {
  let { classes } = props;

  let theme = useTheme();
  let history = useHistory();
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
          <IconButton onClick={() => setOpenDrawer(false)}>
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
        <nav>
          <AppBar
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
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                className={classNames(classes.flex, {
                  [classes.titleShift]: openDrawer,
                })}
                style={getNavbarTitleStyling()}
                onClick={e => navigate(history, e, '/')}
                color="inherit"
              >
                Cirrus CI
              </Typography>
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
                >
                  <BookIcon style={{ color: theme.palette.primary.contrastText }} />
                </IconButton>
              </Tooltip>
              <div className={classes.marginRight}>
                <ActiveRepositoriesDrawer />
              </div>
            </Toolbar>
          </AppBar>
        </nav>
        {openDrawer ? drawer : null}
        <main
          className={classNames(classes.content, {
            [classes.shiftedFixedWidth]: openDrawer,
            [classes.contentShift]: openDrawer,
          })}
        >
          <div className={classNames('invisible', classes.drawerHeader)} />
          <div
            className={classNames({
              'fluid-container': openDrawer,
              container: !openDrawer,
            })}
          >
            <Suspense fallback={<CirrusLinearProgress />}>
              <Switch>
                <Route exact path="/" component={AsyncHome} props={props} />
                <Route exact path="/explorer" component={AsyncApiExplorerRenderer} props={props} />
                <Route exact path="/settings/profile" component={AsyncViewerProfile} props={props} />
                <Route
                  exact
                  path="/settings/github/:organization"
                  component={AsyncGitHubOrganizationSettingsRenderer}
                  props={props}
                />
                <Route
                  exact
                  path="/settings/repository/:repositoryId"
                  component={AsyncRepositorySettings}
                  props={props}
                />
                <Route exact path="/build/:buildId" component={AsyncBuildById} props={props} />
                <Route exact path="/build/:owner/:name/:SHA" component={AsyncBuildBySHA} props={props} />
                <Route exact path="/github/:owner" component={AsyncGitHubOrganization} props={props} />
                <Route exact path="/github/:owner/:name/:branch*" component={AsyncGitHubRepository} props={props} />
                <Route exact path="/repository/:repositoryId/:branch*" component={AsyncRepository} props={props} />
                <Route exact path="/metrics/repository/:owner/:name" component={AsyncRepositoryMetrics} props={props} />
                <Route exact path="/task/:taskId" component={AsyncTask} props={props} />
                <Route exact path="/pool/:poolId" component={AsyncPoolById} props={props} />
                <Route exact path="/:owner/:name/:branch*" component={AsyncGitHubRepository} props={props} />
                <Route component={NotFound} props={props} />
              </Switch>
            </Suspense>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default withStyles(styles)(Routes);
