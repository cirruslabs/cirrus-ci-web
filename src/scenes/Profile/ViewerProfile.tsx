import React from 'react';
import { useLazyLoadQuery } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import Typography from '@mui/material/Typography';

import UserProfile from 'components/account/UserProfile';

import { ViewerProfileQuery } from './__generated__/ViewerProfileQuery.graphql';

export default function ViewerProfile() {
  const response = useLazyLoadQuery<ViewerProfileQuery>(
    graphql`
      query ViewerProfileQuery {
        viewer {
          ...UserProfile_user
        }
      }
    `,
    {},
  );

  if (!response.viewer) {
    return <Typography variant="subtitle1">Please sign in to see your profile!</Typography>;
  }
  return <UserProfile user={response.viewer} />;
}
