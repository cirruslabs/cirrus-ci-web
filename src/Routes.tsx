import React, { Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ViewerComponent from './scenes/Header/ViewerComponent';
import NotFound from './scenes/NotFound';
import { navigate } from './utils/navigate';
import { cirrusColors } from './cirrusTheme';
import {
  AppBar,
  Button,
  Drawer,
  Icon,
  IconButton,
  Toolbar,
  Typography,
  withStyles,
  WithStyles,
  createStyles,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ViewerTopRepositories from './scenes/Viewer/ViewerTopRepositories';
import CirrusCircularProgress from './components/common/CirrusCircularProgress';

const AsyncViewerProfile = React.lazy(() => import('./scenes/Viewer/ViewerProfile'));

const AsyncHome = React.lazy(() => import('./scenes/Home/Home'));

const AsyncBuildById = React.lazy(() => import('./scenes/Build/BuildById'));

const AsyncBuildBySHA = React.lazy(() => import('./scenes/Build/BuildBySHA'));

const AsyncRepository = React.lazy(() => import('./scenes/Repository/Repository'));

const AsyncRepositorySettings = React.lazy(() => import('./scenes/RepositorySettings/RepositorySettings'));

const AsyncRepositoryMetrics = React.lazy(() => import('./scenes/RepositoryMetrics/RepositoryMetrics'));

const AsyncTask = React.lazy(() => import('./scenes/Task/Task'));

const AsyncGitHub = React.lazy(() => import('./scenes/GitHub/GitHub'));

const AsyncGitHubRepository = React.lazy(() => import('./scenes/Repository/GitHubRepository'));

const AsyncGitHubOrganization = React.lazy(() => import('./scenes/GitHub/GitHubOrganization'));

const AsyncGitHubOrganizationSettingsRenderer = React.lazy(() =>
  import('./scenes/GitHub/GitHubOrganizationSettingsRenderer'),
);

const AsyncApiExplorerRenderer = React.lazy(() => import('./components/explorer/ApiExplorer'));

const drawerWidth = 360;

const styles = theme =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    flex: {
      flex: 1,
    },
    hide: {
      display: 'none',
    },
    menuButton: {
      margin: theme.spacing(1.0),
    },
    leftIcon: {
      marginRight: theme.spacing(1.0),
    },
    titleShift: {
      marginLeft: 2 * theme.spacing(1.0),
    },
    viewer: {
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
      backgroundColor: cirrusColors.cirrusGrey,
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
        easing: theme.transitions.easing.sharp,
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

class Routes extends React.Component<WithStyles<typeof styles>, { openDrawer: boolean }> {
  static contextTypes = {
    router: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      openDrawer: localStorage.getItem('cirrusOpenDrawer') === 'true',
    };
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
  }

  handleDrawerOpen() {
    this.setState({ openDrawer: true });
    localStorage.setItem('cirrusOpenDrawer', 'true');
  }

  handleDrawerClose() {
    this.setState({ openDrawer: false });
    localStorage.setItem('cirrusOpenDrawer', 'false');
  }

  render() {
    let { classes } = this.props;
    let { openDrawer } = this.state;

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
            <IconButton onClick={this.handleDrawerClose}>
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
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, openDrawer && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                className={classNames(classes.flex, {
                  [classes.titleShift]: openDrawer,
                })}
                style={{ cursor: 'pointer' }}
                onClick={e => navigate(this.context.router, e, '/')}
                color="inherit"
              >
                Cirrus CI
              </Typography>
              <Button
                style={{ color: cirrusColors.cirrusWhite, marginRight: 8 }}
                href="https://github.com/cirruslabs/cirrus-ci-web"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon className={classNames('fa', 'fa-code', classes.leftIcon)} />
                <span className="d-none d-md-block">Source</span>
              </Button>
              <Button
                style={{ color: cirrusColors.cirrusWhite, marginRight: 8 }}
                href="https://cirrus-ci.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon className={classNames('fa', 'fa-book', classes.leftIcon)} />
                <span className="d-none d-md-block">Documentation</span>
              </Button>
              <div className={classes.viewer}>
                <ViewerComponent />
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
            <div
              className={classNames({
                'fluid-container': openDrawer,
                container: !openDrawer,
              })}
            >
              <Suspense fallback={<CirrusCircularProgress />}>
                <Switch>
                  <Route exact path="/" component={AsyncHome} props={this.props} />
                  <Route exact path="/explorer" component={AsyncApiExplorerRenderer} props={this.props} />
                  <Route exact path="/settings/profile" component={AsyncViewerProfile} props={this.props} />
                  <Route
                    exact
                    path="/settings/github/:organization"
                    component={AsyncGitHubOrganizationSettingsRenderer}
                    props={this.props}
                  />
                  <Route
                    exact
                    path="/settings/repository/:repositoryId"
                    component={AsyncRepositorySettings}
                    props={this.props}
                  />
                  <Route exact path="/build/:buildId" component={AsyncBuildById} props={this.props} />
                  <Route exact path="/build/:owner/:name/:SHA" component={AsyncBuildBySHA} props={this.props} />
                  <Route exact path="/github/:owner" component={AsyncGitHubOrganization} props={this.props} />
                  <Route
                    exact
                    path="/github/:owner/:name/:branch*"
                    component={AsyncGitHubRepository}
                    props={this.props}
                  />
                  <Route exact path="/github" component={AsyncGitHub} props={this.props} />
                  <Route
                    exact
                    path="/repository/:repositoryId/:branch*"
                    component={AsyncRepository}
                    props={this.props}
                  />
                  <Route
                    exact
                    path="/metrics/repository/:owner/:name"
                    component={AsyncRepositoryMetrics}
                    props={this.props}
                  />
                  <Route exact path="/task/:taskId" component={AsyncTask} props={this.props} />
                  <Route exact path="/:owner/:name/:branch*" component={AsyncGitHubRepository} props={this.props} />
                  <Route component={NotFound} props={this.props} />
                </Switch>
              </Suspense>
            </div>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default withStyles(styles)(Routes);
