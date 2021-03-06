import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Storage from '@material-ui/icons/Storage';
import { navigate } from '../../utils/navigate';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { RepositoryNameChip_repository } from './__generated__/RepositoryNameChip_repository.graphql';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

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
  fullName?: boolean;
  repository: RepositoryNameChip_repository;
}

function RepositoryNameChip(props: Props) {
  let history = useHistory();
  let repository = props.repository;

  function handleRepositoryClick(event, repository) {
    navigate(history, event, '/github/' + repository.owner + '/' + repository.name);
  }

  return (
    <Chip
      label={props.fullName ? `${repository.owner}/${repository.name}` : repository.name}
      avatar={
        <Avatar className={props.classes.avatar}>
          <Storage className={props.classes.avatarIcon} />
        </Avatar>
      }
      onClick={e => handleRepositoryClick(e, repository)}
      className={props.className}
    />
  );
}

export default createFragmentContainer(withStyles(styles)(RepositoryNameChip), {
  repository: graphql`
    fragment RepositoryNameChip_repository on Repository {
      owner
      name
    }
  `,
});
