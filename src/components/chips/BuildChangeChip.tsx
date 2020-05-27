import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/icons/Input';
import { graphql } from 'babel-plugin-relay/macro';
import PropTypes from 'prop-types';
import React from 'react';
import { createFragmentContainer } from 'react-relay';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { navigateBuild } from '../../utils/navigate';
import { BuildChangeChip_build } from './__generated__/BuildChangeChip_build.graphql';
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

interface Props extends RouteComponentProps, WithStyles<typeof styles> {
  build: BuildChangeChip_build;
  className?: string;
}

class BuildChangeChip extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  render() {
    let { build, className } = this.props;
    return (
      <Chip
        label={build.changeIdInRepo.substr(0, 6)}
        avatar={
          <Avatar className={this.props.classes.avatar}>
            <Input className={this.props.classes.avatarIcon} />
          </Avatar>
        }
        onClick={e => navigateBuild(this.context.router, e, build.id)}
        className={className}
      />
    );
  }
}

export default createFragmentContainer(withRouter(withStyles(styles)(BuildChangeChip)), {
  build: graphql`
    fragment BuildChangeChip_build on Build {
      id
      changeIdInRepo
    }
  `,
});
