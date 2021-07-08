import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import { navigate } from '../../utils/navigate';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { RepositoryOwnerChip_repository } from './__generated__/RepositoryOwnerChip_repository.graphql';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import GitHubIcon from '@material-ui/icons/GitHub';

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
  repository: RepositoryOwnerChip_repository;
}

function RepositoryOwnerChip(props: Props) {
  let history = useHistory();
  let repository = props.repository;

  function handleRepositoryClick(event, repository) {
    navigate(history, event, '/github/' + repository.owner);
  }

  return (
    <Chip
      label={repository.owner}
      avatar={
        <Avatar className={props.classes.avatar}>
          <GitHubIcon className={props.classes.avatarIcon} />
        </Avatar>
      }
      onClick={e => handleRepositoryClick(e, repository)}
      className={props.className}
    />
  );
}

export default createFragmentContainer(withStyles(styles)(RepositoryOwnerChip), {
  repository: graphql`
    fragment RepositoryOwnerChip_repository on Repository {
      owner
    }
  `,
});
