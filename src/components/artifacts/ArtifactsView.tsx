import React, {useState} from 'react';
import Typography from '@mui/material/Typography';
import {makeStyles} from '@mui/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import {navigateHelper} from '../../utils/navigateHelper';
import {TaskArtifacts_task} from './__generated__/TaskArtifacts_task.graphql';
import Folder from '@mui/icons-material/Folder';
import InsertDriveFile from '@mui/icons-material/InsertDriveFile';
import GetApp from '@mui/icons-material/GetApp';
import FolderOpen from '@mui/icons-material/FolderOpen';
import ViewList from '@mui/icons-material/ViewList';
import AccountTree from '@mui/icons-material/AccountTree';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {useNavigate} from 'react-router-dom';

const useStyles = makeStyles(theme => {
  return {
    title: {
      display: 'flex',
      flexGrow: 1,
    },
  };
});

interface Props {
  task: TaskArtifacts_task;
}

interface SingleArtifactItemInfo {
  path: string;
  folder: string;
  size: number;
  isTopLevel: boolean;
}

function ArtifactsView(props: Props) {
  let navigate = useNavigate();
  let [selectedArtifactName, setSelectedArtifactName] = useState(null);
  let [selectedPath, setSelectedPath] = useState([]);
  let [isFolderView, setFolderView] = useState(true);

  let artifactURL = (name: string) => {
    let allURLParts = ['https://api.cirrus-ci.com/v1/artifact/task', props.task.id, selectedArtifactName].concat(
      selectedPath,
    );
    allURLParts.push(name);
    return allURLParts.filter(it => it !== null).join('/');
  };

  let artifactArchiveURL = (name: string) =>
    ['https://api.cirrus-ci.com/v1/artifact/task', props.task.id, `${name}.zip`].join('/');

  function getSelectedArtifact() {
    for (let artifact of props.task.artifacts || []) {
      if (artifact.name && artifact.name === selectedArtifactName) {
        return artifact;
      }
    }
    return null;
  }

  function currentPath(): string {
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

  let { task } = props;
  let classes = useStyles();
  let { artifacts } = task;

  let items = [];

  // ... if needed
  if (selectedPath.length > 0 && isFolderView) {
    items.push(
      <ListItem key="..." button onClick={() => setSelectedPath(selectedPath.slice(0, selectedPath.length - 1))}>
        <ListItemIcon>
          <Folder />
        </ListItemIcon>
        <ListItemText primary="..." />
      </ListItem>,
    );
  } else if (selectedArtifactName && isFolderView) {
    items.push(
      <ListItem key="..." button onClick={() => setSelectedArtifactName(null)}>
        <ListItemIcon>
          <Folder />
        </ListItemIcon>
        <ListItemText primary="..." />
      </ListItem>,
    );
  }

  if (!selectedArtifactName) {
    for (let artifact of artifacts) {
      items.push(
        <ListItem key={artifact.name} button onClick={() => setSelectedArtifactName(artifact.name)}>
          <ListItemIcon>
            <FolderOpen />
          </ListItemIcon>
          <ListItemText primary={artifact.name} />
          <Tooltip title="Download All Files (.zip)">
            <IconButton onClick={e => navigateHelper(navigate, e, artifactArchiveURL(artifact.name))} size="large">
              <GetApp />
            </IconButton>
          </Tooltip>
        </ListItem>,
      );
    }
  } else {
    let folders: string[] = [];
    let scopedArtifactInfos = getScopedArtifactInfos();

    for (let info of scopedArtifactInfos) {
      if (!info.isTopLevel && !folders.includes(info.folder) && isFolderView) {
        folders.push(info.folder);
        items.push(
          <ListItem key={info.folder} button onClick={() => setSelectedPath(selectedPath.concat([info.folder]))}>
            <ListItemIcon>
              <Folder />
            </ListItemIcon>
            <ListItemText primary={info.folder} />
          </ListItem>,
        );
      }
    }

    for (let info of scopedArtifactInfos) {
      if (info.isTopLevel || !isFolderView) {
        items.push(
          <ListItem key={info.path} button onClick={() => window.open(artifactURL(info.path), '_blank')}>
            <ListItemIcon>
              <InsertDriveFile />
            </ListItemIcon>
            <ListItemText primary={info.path} secondary={bytesToHumanReadable(info.size)} />
          </ListItem>,
        );
      }
    }
  }

  return (
    <Paper elevation={16}>
      <Toolbar className={classes.title}>
        <Typography variant="h6" color="inherit" className={classes.title}>
          {currentPath() || 'Artifacts'}
        </Typography>
        {getSelectedArtifact() === null ? null : (
          <ToggleButtonGroup
            value={isFolderView}
            exclusive
            onChange={(_event, val) => setFolderView(val)}
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

export default ArtifactsView;
