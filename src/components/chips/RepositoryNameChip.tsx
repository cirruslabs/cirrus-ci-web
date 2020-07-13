import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Storage from '@material-ui/icons/Storage';
import { navigate } from '../../utils/navigate';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { RepositoryNameChip_repository } from './__generated__/RepositoryNameChip_repository.graphql';
import { createStyles, withStyles, WithStyles } from '@material-ui/core';

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
  repository: RepositoryNameChip_repository;
}

class RepositoryNameChip extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  render() {
    let repository = this.props.repository;
    return (
      <Chip
        label={repository.owner + '/' + repository.name}
        avatar={
          <Avatar className={this.props.classes.avatar}>
            <Storage className={this.props.classes.avatarIcon} />
          </Avatar>
        }
        onClick={e => this.handleRepositoryClick(e, repository)}
        className={this.props.className}
      />
    );
  }

  handleRepositoryClick(event, repository) {
    navigate(this.context.router, event, '/github/' + repository.owner + '/' + repository.name);
  }
}

export default createFragmentContainer(withStyles(styles)(RepositoryNameChip), {
  repository: graphql`
    fragment RepositoryNameChip_repository on Repository {
      owner
      name
    }
  `,
});
