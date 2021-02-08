import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import CallSplit from '@material-ui/icons/CallSplit';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { navigate } from '../../utils/navigate';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { BuildBranchNameChip_build } from './__generated__/BuildBranchNameChip_build.graphql';
import { shorten } from '../../utils/text';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = theme =>
  createStyles({
    avatar: {
      backgroundColor: theme.palette.primary.main,
    },
    avatarIcon: {
      color: theme.palette.primary.contrastText,
    },
  });

interface Props extends RouteComponentProps, WithStyles<typeof styles> {
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
        label={shorten(build.branch)}
        avatar={
          <Avatar className={this.props.classes.avatar}>
            <CallSplit className={this.props.classes.avatarIcon} />
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
      navigate(this.context.router.history, event, '/repository/' + build.repositoryId + '/' + build.branch);
    }
  }
}

export default createFragmentContainer(withRouter(withStyles(styles)(BuildBranchNameChip)), {
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
