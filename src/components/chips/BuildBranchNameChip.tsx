import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import { cirrusColors } from '../../cirrusTheme';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { navigate } from '../../utils/navigate';
import { withStyles } from '@material-ui/core';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { BuildBranchNameChip_build } from './__generated__/BuildBranchNameChip_build.graphql';

interface Props extends RouteComponentProps {
  className?: string;
  build: BuildBranchNameChip_build;
}

class BuildBranchNameChip extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  render() {
    let build = this.props.build;
    return (
      <Chip
        className={this.props.className}
        label={build.branch}
        avatar={
          <Avatar style={{ background: cirrusColors.cirrusPrimary }}>
            <Icon style={{ color: cirrusColors.cirrusWhite }}>call_split</Icon>
          </Avatar>
        }
        onClick={e => this.handleBranchClick(e, build)}
      />
    );
  }

  handleBranchClick(event, build) {
    if (build.repository) {
      navigate(
        this.context.router,
        event,
        '/github/' + build.repository.owner + '/' + build.repository.name + '/' + build.branch,
      );
    } else if (build.repositoryId) {
      navigate(this.context.router, event, '/repository/' + build.repositoryId + '/' + build.branch);
    }
  }
}

export default createFragmentContainer(withRouter(withStyles({})(BuildBranchNameChip)), {
  build: graphql`
    fragment BuildBranchNameChip_build on Build {
      id
      branch
      repository {
        owner
        name
      }
    }
  `,
});
