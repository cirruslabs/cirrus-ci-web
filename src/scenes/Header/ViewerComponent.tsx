import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import AccountInformation from '../../components/account/AccountInformation';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import { cirrusColors } from '../../cirrusTheme';
import Button from '@material-ui/core/Button';
import GitHubIcon from '@material-ui/icons/GitHub';
import { ViewerComponentQuery } from './__generated__/ViewerComponentQuery.graphql';

export default () => {
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
          return <CirrusLinearProgress />;
        }
        let viewer = props.viewer;
        if (!viewer) {
          return (
            <Button
              style={{ color: cirrusColors.cirrusWhite }}
              startIcon={<GitHubIcon />}
              href="https://api.cirrus-ci.com/redirect/auth/github"
            >
              Sign in
            </Button>
          );
        }
        return <AccountInformation viewer={viewer} />;
      }}
    />
  );
};
