import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Storage from '@material-ui/icons/Storage';
import { cirrusColors } from '../../cirrusTheme';
import { navigate } from '../../utils/navigate';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { RepositoryNameChip_repository } from './__generated__/RepositoryNameChip_repository.graphql';

interface Props {
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
          <Avatar style={{ background: cirrusColors.cirrusPrimary }}>
            <Storage style={{ color: cirrusColors.cirrusWhite }} />
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

export default createFragmentContainer(RepositoryNameChip, {
  repository: graphql`
    fragment RepositoryNameChip_repository on Repository {
      owner
      name
    }
  `,
});
