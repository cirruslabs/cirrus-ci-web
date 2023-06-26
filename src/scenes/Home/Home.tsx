import React from 'react';
import { useLazyLoadQuery } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import ViewerBuildList from 'components/account/ViewerBuildList';

import WelcomePage from './WelcomePage';
import { HomeViewerQuery } from './__generated__/HomeViewerQuery.graphql';

export default function Home() {
  const response = useLazyLoadQuery<HomeViewerQuery>(
    graphql`
      query HomeViewerQuery {
        viewer {
          id
        }
        ...ViewerBuildList_viewer
      }
    `,
    {},
  );

  if (response.viewer) {
    return <ViewerBuildList viewer={response} />;
  } else {
    return <WelcomePage />;
  }
}
