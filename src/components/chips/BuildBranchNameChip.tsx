import React from 'react';

import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import CallSplit from '@mui/icons-material/CallSplit';
import { useNavigate } from 'react-router-dom';
import { navigateHelper } from '../../utils/navigateHelper';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { BuildBranchNameChip_build } from './__generated__/BuildBranchNameChip_build.graphql';
import { shorten } from '../../utils/text';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import { Commit } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

const styles = theme =>
  createStyles({
    avatar: {
      backgroundColor: theme.palette.primary.main,
    },
    avatarIcon: {
      color: theme.palette.primary.contrastText,
    },
  });

interface Props extends WithStyles<typeof styles> {
  className?: string;
  build: BuildBranchNameChip_build;
}

function BuildBranchNameChip(props: Props) {
  let navigate = useNavigate();
  let build = props.build;

  function handleBranchClick(event) {
    if (build.repository) {
      navigateHelper(
        navigate,
        event,
        '/github/' + build.repository.owner + '/' + build.repository.name + '/' + build.branch,
      );
    } else if (build.repository.id) {
      navigateHelper(navigate, event, '/repository/' + build.repository.id + '/' + build.branch);
    }
  }

  if (build.tag) {
    return (
      <Tooltip title={`${build.tag} tag`}>
        <Chip
          className={props.className}
          label={shorten(build.branch)}
          avatar={
            <Avatar className={props.classes.avatar}>
              <Commit className={props.classes.avatarIcon} />
            </Avatar>
          }
          onClick={handleBranchClick}
          onAuxClick={handleBranchClick}
        />
      </Tooltip>
    );
  }

  return (
    <Chip
      className={props.className}
      label={shorten(build.branch)}
      avatar={
        <Avatar className={props.classes.avatar}>
          <CallSplit className={props.classes.avatarIcon} />
        </Avatar>
      }
      onClick={handleBranchClick}
      onAuxClick={handleBranchClick}
    />
  );
}

export default createFragmentContainer(withStyles(styles)(BuildBranchNameChip), {
  build: graphql`
    fragment BuildBranchNameChip_build on Build {
      id
      branch
      tag
      repository {
        id
        owner
        name
      }
    }
  `,
});
