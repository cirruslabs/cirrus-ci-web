import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { navigate } from '../../utils/navigate';
import { TaskArtifacts_task } from './__generated__/TaskArtifacts_task.graphql';
import Folder from '@material-ui/icons/Folder';
import InsertDriveFile from '@material-ui/icons/InsertDriveFile';
import GetApp from '@material-ui/icons/GetApp';
import FolderOpen from '@material-ui/icons/FolderOpen';
import ViewList from '@material-ui/icons/ViewList';
import AccountTree from '@material-ui/icons/AccountTree';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const styles = {
  title: {
    display: 'flex',
    flexGrow: 1,
  },
};

interface Props extends RouteComponentProps, WithStyles<typeof styles> {
  task: TaskArtifacts_task;
}

interface State {
  selectedArtifactName?: string;
  selectedPath?: string[];
  isFolderView?: boolean;
}

interface SingleArtifactItemInfo {
  path: string;
  folder: string;
  size: number;
  isTopLevel: boolean;
}

class ArtifactsView extends React.Component<Props, State> {
  static contextTypes = {
    router: PropTypes.object,
  };

  state: State = { selectedArtifactName: null, selectedPath: [], isFolderView: true };

  _getSelectedArtifact() {
    for (let artifact of this.props.task.artifacts || []) {
      if (artifact.name && artifact.name === this.state.selectedArtifactName) {
        return artifact;
      }
    }
    return null;
  }

  _currentPath(): string {
    if (!this.state.selectedArtifactName) {
      return null;
    }
    if (this.state.selectedPath.length === 0) {
      return this.state.selectedArtifactName;
    }
    return this.state.selectedArtifactName + '/' + this.state.selectedPath.join('/');
  }

  _getScopedArtifactInfos(): SingleArtifactItemInfo[] {
    let currentArtifact = this._getSelectedArtifact();
    if (!currentArtifact) {
      return [];
    }

    let selectedPrefix = this.state.selectedPath.length === 0 ? '' : this.state.selectedPath.join('/') + '/';
    let results = [];

    let files = currentArtifact.files;
    for (let fileInfo of files) {
      if (selectedPrefix === '' || fileInfo.path.startsWith(selectedPrefix)) {
        let subPath = fileInfo.path.substring(selectedPrefix.length);
        let folderName = subPath.substring(0, subPath.indexOf('/'));
        results.push({
          path: subPath,
          folder: folderName,
          size: fileInfo.size,
          isTopLevel: subPath.indexOf('/') === -1,
        });
      }
    }

    return results;
  }

  updateState = (partialState: State) => {
    this.setState(prevState => ({
      ...prevState,
      ...partialState,
    }));
  };

  artifactURL = (name: string) => {
    let allURLParts = [
      'https://api.cirrus-ci.com/v1/artifact/task',
      this.props.task.id,
      this.state.selectedArtifactName,
    ].concat(this.state.selectedPath);
    allURLParts.push(name);
    return allURLParts.filter(it => it !== null).join('/');
  };

  artifactArchiveURL = (name: string) =>
    ['https://api.cirrus-ci.com/v1/artifact/task', this.props.task.id, `${name}.zip`].join('/');

  render() {
    let { task, classes } = this.props;
    let { artifacts } = task;

    let items = [];

    // ... if needed
    if (this.state.selectedPath.length > 0 && this.state.isFolderView) {
      items.push(
        <ListItem
          key="..."
          button
          onClick={() =>
            this.updateState({ selectedPath: this.state.selectedPath.slice(0, this.state.selectedPath.length - 1) })
          }
        >
          <ListItemIcon>
            <Folder />
          </ListItemIcon>
          <ListItemText primary="..." />
        </ListItem>,
      );
    } else if (this.state.selectedArtifactName && this.state.isFolderView) {
      items.push(
        <ListItem key="..." button onClick={() => this.updateState({ selectedArtifactName: null })}>
          <ListItemIcon>
            <Folder />
          </ListItemIcon>
          <ListItemText primary="..." />
        </ListItem>,
      );
    }

    if (!this.state.selectedArtifactName) {
      for (let artifact of artifacts) {
        items.push(
          <ListItem
            key={artifact.name}
            button
            onClick={() => this.updateState({ selectedArtifactName: artifact.name })}
          >
            <ListItemIcon>
              <FolderOpen />
            </ListItemIcon>
            <ListItemText primary={artifact.name} />
            <Tooltip title="Download All Files (.zip)">
              <IconButton onClick={e => navigate(this.context.router, e, this.artifactArchiveURL(artifact.name))}>
                <GetApp />
              </IconButton>
            </Tooltip>
          </ListItem>,
        );
      }
    } else {
      let folders: string[] = [];
      let scopedArtifactInfos = this._getScopedArtifactInfos();

      for (let info of scopedArtifactInfos) {
        if (!info.isTopLevel && !folders.includes(info.folder) && this.state.isFolderView) {
          folders.push(info.folder);
          items.push(
            <ListItem
              key={info.folder}
              button
              onClick={() => this.updateState({ selectedPath: this.state.selectedPath.concat([info.folder]) })}
            >
              <ListItemIcon>
                <Folder />
              </ListItemIcon>
              <ListItemText primary={info.folder} />
            </ListItem>,
          );
        }
      }

      for (let info of scopedArtifactInfos) {
        if (info.isTopLevel || !this.state.isFolderView) {
          items.push(
            <ListItem key={info.path} button onClick={() => window.open(this.artifactURL(info.path), '_blank')}>
              <ListItemIcon>
                <InsertDriveFile />
              </ListItemIcon>
              <ListItemText primary={info.path} />
            </ListItem>,
          );
        }
      }
    }

    return (
      <Paper elevation={1}>
        <Toolbar className={classes.title}>
          <Typography variant="h6" color="inherit" className={classes.title}>
            {this._currentPath() || 'Artifacts'}
          </Typography>
          {this._getSelectedArtifact() === null ? null : (
            <ToggleButtonGroup
              value={this.state.isFolderView}
              exclusive
              onChange={(_event, val) => {
                this.updateState({ isFolderView: val });
              }}
              aria-label="folder view"
            >
              <ToggleButton value={false} aria-label="overview">
                <ViewList />
              </ToggleButton>
              <ToggleButton value={true} aria-label="tree view">
                <AccountTree />
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        </Toolbar>
        <List>{items}</List>
      </Paper>
    );
  }
}

export default withStyles(styles)(withRouter(ArtifactsView));
