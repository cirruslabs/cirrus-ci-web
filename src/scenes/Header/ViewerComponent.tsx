import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import AccountInformation from '../../components/account/AccountInformation';
import CirrusCircularProgress from '../../components/common/CirrusCircularProgress';
import { cirrusColors } from '../../cirrusTheme';
import Button from '@material-ui/core/Button';
import GitHubIcon from '@material-ui/icons/GitHub';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import { ViewerComponentQuery } from './__generated__/ViewerComponentQuery.graphql';

const styles = (theme: Theme) =>
  createStyles({
    leftIcon: {
      marginRight: theme.spacing(1),
    },
  });

class ViewerComponent extends React.Component<WithStyles<typeof styles>> {
  render() {
    return (
      <QueryRenderer<ViewerComponentQuery>
        environment={environment}
        query={graphql`
          query ViewerComponentQuery {
            viewer {
              ...AccountInformation_viewer
            }
          }
        `}
        variables={{}}
        render={({ error, props }) => {
          if (!props) {
            return <CirrusCircularProgress />;
          }
          let viewer = props.viewer;
          if (!viewer) {
            return (
              <Button style={{ color: cirrusColors.cirrusWhite }} href="https://api.cirrus-ci.com/redirect/auth/github">
                <GitHubIcon className={this.props.classes.leftIcon} />
                Sign in
              </Button>
            );
          }
          return <AccountInformation viewer={viewer} />;
        }}
      />
    );
  }
}

export default withStyles(styles)(ViewerComponent);
