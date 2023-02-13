import React from 'react';

import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { navigateHelper } from '../../utils/navigateHelper';
import { useFragment } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { RepositoryOwnerChip_repository$key } from './__generated__/RepositoryOwnerChip_repository.graphql';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';

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
  repository: RepositoryOwnerChip_repository$key;
}

export default function RepositoryOwnerChip(props: Props) {
  let repository = useFragment(
    graphql`
      fragment RepositoryOwnerChip_repository on Repository {
        owner
      }
    `,
    props.repository,
  );

  let classes = useStyles();
  let navigate = useNavigate();

  function handleRepositoryClick(event, repository) {
    navigateHelper(navigate, event, '/github/' + repository.owner);
  }

  return (
    <Chip
      label={repository.owner}
      avatar={
        <Avatar className={classes.avatar}>
          <GitHubIcon className={classes.avatarIcon} />
        </Avatar>
      }
      onClick={e => handleRepositoryClick(e, repository)}
      onAuxClick={e => handleRepositoryClick(e, repository)}
      className={props.className}
    />
  );
}
