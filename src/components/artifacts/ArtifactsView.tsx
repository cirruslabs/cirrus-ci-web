import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { createStyles, List, Tooltip, withStyles, WithStyles } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import Toolbar from '@material-ui/core/Toolbar';
import { cirrusColors } from '../../cirrusTheme';
import Paper from '@material-ui/core/Paper';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { navigate } from '../../utils/navigate';
import { TaskArtifacts_task } from './__generated__/TaskArtifacts_task.graphql';

const styles = theme =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: '360px',
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      backgroundColor: cirrusColors.cirrusGrey,
    },
  });

interface Props extends RouteComponentProps<{}>, WithStyles<typeof styles> {
  task: TaskArtifacts_task;
}

class ArtifactsView extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  state = { selectedArtifactName: null, selectedPath: [] };

  _getSelectedArtifact() {
    for (let artifact of this.props.task.artifacts || []) {
      if (artifact.name && artifact.name === this.state.selectedArtifactName) {
        return artifact;
      }
    }
    return null;
  }

  _currentPath() {
    if (!this.state.selectedArtifactName) {
      return null;
    }
    if (this.state.selectedPath.length === 0) {
      return this.state.selectedArtifactName;
    }
    return this.state.selectedArtifactName + '/' + this.state.selectedPath.join('/');
  }

  _getScopedArtifactInfos() {
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

  updateState = partialState => {
    this.setState(prevState => ({
      ...prevState,
      ...partialState,
    }));
  };

  artifactURL = name => {
    let allURLParts = [
      'https://api.cirrus-ci.com/v1/artifact/task',
      this.props.task.id,
      this.state.selectedArtifactName,
    ].concat(this.state.selectedPath);
    allURLParts.push(name);
    return allURLParts.filter(it => it !== null).join('/');
  };

  artifactArchiveURL = name => {
    return ['https://api.cirrus-ci.com/v1/artifact/task', this.props.task.id, `${name}.zip`].join('/');
  };

  render() {
    let { task, classes } = this.props;
    let { artifacts } = task;

    let items = [];

    // ... if needed
    if (this.state.selectedPath.length > 0) {
      items.push(
        <ListItem
          key="..."
          button
          onClick={() =>
            this.updateState({ selectedPath: this.state.selectedPath.slice(0, this.state.selectedPath.length - 1) })
          }
        >
          <ListItemIcon>
            <Icon>folder</Icon>
          </ListItemIcon>
          <ListItemText primary="..." />
        </ListItem>,
      );
    } else if (this.state.selectedArtifactName) {
      items.push(
        <ListItem key="..." button onClick={() => this.updateState({ selectedArtifactName: null })}>
          <ListItemIcon>
            <Icon>folder</Icon>
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
              <Icon>folder_open</Icon>
            </ListItemIcon>
            <ListItemText primary={artifact.name} />
            <Tooltip title="Download All Files (.zip)">
              <Icon onClick={e => navigate(this.context.router, e, this.artifactArchiveURL(artifact.name))}>
                get_app
              </Icon>
            </Tooltip>
          </ListItem>,
        );
      }
    } else {
      let folders = {};
      let scopedArtifactInfos = this._getScopedArtifactInfos();
      for (let info of scopedArtifactInfos) {
        if (!info.isTopLevel && !folders[info.folder]) {
          folders[info.folder] = true;
          items.push(
            <ListItem
              key={info.folder}
              button
              onClick={() => this.updateState({ selectedPath: this.state.selectedPath.concat([info.folder]) })}
            >
              <ListItemIcon>
                <Icon>folder_open</Icon>
              </ListItemIcon>
              <ListItemText primary={info.folder} />
            </ListItem>,
          );
        }
      }

      for (let info of scopedArtifactInfos) {
        if (info.isTopLevel) {
          items.push(
            <ListItem key={info.path} button onClick={() => window.open(this.artifactURL(info.path), '_blank')}>
              <ListItemIcon>
                <Icon>insert_drive_file</Icon>
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
          <Typography variant="h6" color="inherit">
            {'Artifacts' + this._currentPath() == null ? '' : ' in ' + this._currentPath()}
          </Typography>
        </Toolbar>
        <List>{items}</List>
      </Paper>
    );
  }
}

export default withStyles(styles)(withRouter(ArtifactsView));
