import React, { useState } from 'react';
import { useFragment } from 'react-relay';
import { useNavigate } from 'react-router-dom';

import { graphql } from 'babel-plugin-relay/macro';

import mui from 'mui';

import { navigateHelper } from 'utils/navigateHelper';

import { ArtifactsView_task$key } from './__generated__/ArtifactsView_task.graphql';

const useStyles = mui.makeStyles(theme => {
  return {
    title: {
      display: 'flex',
      flexGrow: 1,
    },
  };
});

interface Props {
  task: ArtifactsView_task$key;
}

interface SingleArtifactItemInfo {
  path: string;
  folder: string;
  size: number;
  isTopLevel: boolean;
}

export default function ArtifactsView(props: Props) {
  let task = useFragment(
    graphql`
      fragment ArtifactsView_task on Task {
        id
        artifacts {
          name
          files {
            path
            size
          }
        }
      }
    `,
    props.task,
  );

  let navigate = useNavigate();
  let [selectedArtifactName, setSelectedArtifactName] = useState<string | null>(null);
  let [selectedPath, setSelectedPath] = useState<Array<string>>([]);
  let [isFolderView, setFolderView] = useState(true);

  let artifactURL = (name: string) => {
    let allURLParts = ['https://api.cirrus-ci.com/v1/artifact/task', task.id, selectedArtifactName].concat(
      selectedPath,
    );
    allURLParts.push(name);
    return allURLParts.filter(it => it !== null).join('/');
  };

  let artifactArchiveURL = (name: string) =>
    ['https://api.cirrus-ci.com/v1/artifact/task', task.id, `${name}.zip`].join('/');

  function getSelectedArtifact() {
    for (let artifact of task.artifacts || []) {
      if (artifact.name && artifact.name === selectedArtifactName) {
        return artifact;
      }
    }
    return null;
  }

  function currentPath(): string | null {
    if (!selectedArtifactName) {
      return null;
    }
    if (selectedPath.length === 0) {
      return selectedArtifactName;
    }
    return selectedArtifactName + '/' + selectedPath.join('/');
  }

  function bytesToHumanReadable(bytes: number): string {
    if (bytes === 0) {
      return '0 Bytes';
    }

    let divisor = 1024;
    let suffixes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];

    let magnitude = Math.log(bytes) / Math.log(divisor);
    magnitude |= 0;

    if (magnitude >= suffixes.length) {
      return "That's a big file!";
    }

    let size = bytes / Math.pow(divisor, magnitude);

    let suffix = suffixes[magnitude];
    return `${size.toFixed(2)} ${suffix}`;
  }

  function getScopedArtifactInfos(): SingleArtifactItemInfo[] {
    let currentArtifact = getSelectedArtifact();
    if (!currentArtifact) {
      return [];
    }

    let selectedPrefix = selectedPath.length === 0 ? '' : selectedPath.join('/') + '/';
    const results: Array<SingleArtifactItemInfo> = [];

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

  let classes = useStyles();
  let { artifacts } = task;

  let items: Array<JSX.Element> = [];

  // ... if needed
  if (selectedPath.length > 0 && isFolderView) {
    items.push(
      <mui.ListItem key="..." button onClick={() => setSelectedPath(selectedPath.slice(0, selectedPath.length - 1))}>
        <mui.ListItemIcon>
          <mui.icons.Folder />
        </mui.ListItemIcon>
        <mui.ListItemText primary="..." />
      </mui.ListItem>,
    );
  } else if (selectedArtifactName && isFolderView) {
    items.push(
      <mui.ListItem key="..." button onClick={() => setSelectedArtifactName(null)}>
        <mui.ListItemIcon>
          <mui.icons.Folder />
        </mui.ListItemIcon>
        <mui.ListItemText primary="..." />
      </mui.ListItem>,
    );
  }

  if (!selectedArtifactName) {
    for (let artifact of artifacts) {
      items.push(
        <mui.ListItem key={artifact.name} button onClick={() => setSelectedArtifactName(artifact.name)}>
          <mui.ListItemIcon>
            <mui.icons.FolderOpen />
          </mui.ListItemIcon>
          <mui.ListItemText primary={artifact.name} />
          <mui.Tooltip title="Download All Files (.zip)">
            <mui.IconButton onClick={e => navigateHelper(navigate, e, artifactArchiveURL(artifact.name))} size="large">
              <mui.icons.GetApp />
            </mui.IconButton>
          </mui.Tooltip>
        </mui.ListItem>,
      );
    }
  } else {
    let folders: string[] = [];
    let scopedArtifactInfos = getScopedArtifactInfos();

    for (let info of scopedArtifactInfos) {
      if (!info.isTopLevel && !folders.includes(info.folder) && isFolderView) {
        folders.push(info.folder);
        items.push(
          <mui.ListItem key={info.folder} button onClick={() => setSelectedPath(selectedPath.concat([info.folder]))}>
            <mui.ListItemIcon>
              <mui.icons.Folder />
            </mui.ListItemIcon>
            <mui.ListItemText primary={info.folder} />
          </mui.ListItem>,
        );
      }
    }

    for (let info of scopedArtifactInfos) {
      if (info.isTopLevel || !isFolderView) {
        items.push(
          <mui.ListItem key={info.path} button onClick={() => window.open(artifactURL(info.path), '_blank')}>
            <mui.ListItemIcon>
              <mui.icons.InsertDriveFile />
            </mui.ListItemIcon>
            <mui.ListItemText primary={info.path} secondary={bytesToHumanReadable(info.size)} />
          </mui.ListItem>,
        );
      }
    }
  }

  return (
    <mui.Paper elevation={16}>
      <mui.Toolbar className={classes.title}>
        <mui.Typography variant="h6" color="inherit" className={classes.title}>
          {currentPath() || 'Artifacts'}
        </mui.Typography>
        {getSelectedArtifact() === null ? null : (
          <mui.ToggleButtonGroup
            value={isFolderView}
            exclusive
            onChange={(_event, val) => setFolderView(val)}
            aria-label="folder view"
          >
            <mui.ToggleButton value={false} aria-label="overview">
              <mui.icons.ViewList />
            </mui.ToggleButton>
            <mui.ToggleButton value={true} aria-label="tree view">
              <mui.icons.AccountTree />
            </mui.ToggleButton>
          </mui.ToggleButtonGroup>
        )}
      </mui.Toolbar>
      <mui.List>{items}</mui.List>
    </mui.Paper>
  );
}
