import React from 'react';

import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Storage from '@mui/icons-material/Storage';
import {navigateHelper} from '../../utils/navigateHelper';
import {createFragmentContainer} from 'react-relay';
import {graphql} from 'babel-plugin-relay/macro';
import {RepositoryNameChip_repository} from './__generated__/RepositoryNameChip_repository.graphql';
import {makeStyles} from '@mui/styles';
import {useNavigate} from 'react-router-dom';

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
  fullName?: boolean;
  repository: RepositoryNameChip_repository;
}

function RepositoryNameChip(props: Props) {
  let classes = useStyles();
  let navigate = useNavigate();
  let repository = props.repository;

  function handleRepositoryClick(event, repository) {
    navigateHelper(navigate, event, '/github/' + repository.owner + '/' + repository.name);
  }

  return (
    <Chip
      label={props.fullName ? `${repository.owner}/${repository.name}` : repository.name}
      avatar={
        <Avatar className={classes.avatar}>
          <Storage className={classes.avatarIcon} />
        </Avatar>
      }
      onClick={e => handleRepositoryClick(e, repository)}
      onAuxClick={e => handleRepositoryClick(e, repository)}
      className={props.className}
    />
  );
}

export default createFragmentContainer(RepositoryNameChip, {
  repository: graphql`
    fragment RepositoryNameChip_repository on Repository {
      owner
      name
    }
  `,
});
