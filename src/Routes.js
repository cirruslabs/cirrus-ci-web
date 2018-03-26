import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import LoadingComponent from "./components/CirrusLoadingComponent";
import Loadable from 'react-loadable';
import Header from "./scenes/Header/Header";
import NotFound from "./scenes/NotFound";


const AsyncHome = Loadable({
  loader: () => import('./scenes/Home/Home'),
  loading: LoadingComponent
});

const AsyncBuild = Loadable({
  loader: () => import('./scenes/Build/Build'),
  loading: LoadingComponent
});

const AsyncRepository = Loadable({
  loader: () => import('./scenes/Repository/Repository'),
  loading: LoadingComponent
});

const AsyncRepositorySettings = Loadable({
  loader: () => import('./scenes/RepositorySettings/RepositorySettings'),
  loading: LoadingComponent
});

const AsyncTask = Loadable({
  loader: () => import('./scenes/Task/Task'),
  loading: LoadingComponent
});

const AsyncGitHub = Loadable({
  loader: () => import('./scenes/GitHub/GitHub'),
  loading: LoadingComponent
});

const AsyncGitHubRepository = Loadable({
  loader: () => import('./scenes/Repository/GitHubRepository'),
  loading: LoadingComponent
});

class Routes extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div style={{width: "100%", height: "100%"}}>
          <Header/>
          <Switch>
            <Route exact path="/" component={AsyncHome} props={this.props}/>
            <Route exact path="/build/:buildId" component={AsyncBuild} props={this.props}/>
            <Route exact path="/github/:owner/:name/:branch*" component={AsyncGitHubRepository} props={this.props}/>
            <Route exact path="/github" component={AsyncGitHub} props={this.props}/>
            <Route exact path="/repository/:repositoryId/:branch*" component={AsyncRepository} props={this.props}/>
            <Route exact path="/settings/repository/:repositoryId" component={AsyncRepositorySettings}
                   props={this.props}/>
            <Route exact path="/task/:taskId" component={AsyncTask} props={this.props}/>
            <Route exact path="/:owner/:name/:branch*" component={AsyncGitHubRepository} props={this.props}/>
            <Route component={NotFound} props={this.props}/>
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default Routes;
