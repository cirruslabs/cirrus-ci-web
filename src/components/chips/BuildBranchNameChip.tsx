import React from 'react';
import { useFragment } from 'react-relay';
import { useNavigate } from 'react-router-dom';

import { graphql } from 'babel-plugin-relay/macro';

import { Commit } from '@mui/icons-material';
import CallSplit from '@mui/icons-material/CallSplit';
import { Tooltip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { makeStyles } from '@mui/styles';

import { navigateHelper } from 'utils/navigateHelper';
import { shorten } from 'utils/text';

import { BuildBranchNameChip_build$key } from './__generated__/BuildBranchNameChip_build.graphql';

const useStyles = makeStyles(theme => {
  return {
    avatar: {
      backgroundColor: theme.palette.primary.main,
    },
    avatarIcon: {
      color: theme.palette.primary.contrastText,
    },
  };
});

interface Props {
  className?: string;
  build: BuildBranchNameChip_build$key;
}

export default function BuildBranchNameChip(props: Props) {
  let build = useFragment(
    graphql`
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
    props.build,
  );

  let classes = useStyles();
  let navigate = useNavigate();

  function handleBranchClick(event) {
    if (build.repository) {
      navigateHelper(
        navigate,
        event,
        '/github/' + build.repository.owner + '/' + build.repository.name + '/' + build.branch,
      );
    }
  }

  if (build.tag) {
    return (
      <Tooltip title={`${build.tag} tag`}>
        <Chip
          className={props.className}
          label={shorten(build.branch)}
          avatar={
            <Avatar className={classes.avatar}>
              <Commit className={classes.avatarIcon} />
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
        <Avatar className={classes.avatar}>
          <CallSplit className={classes.avatarIcon} />
        </Avatar>
      }
      onClick={handleBranchClick}
      onAuxClick={handleBranchClick}
    />
  );
}
