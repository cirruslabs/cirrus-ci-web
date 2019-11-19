import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import ViewerBuildList from '../../components/ViewerBuildList';
import CirrusLinearProgress from '../../components/CirrusLinearProgress';
import Paper from '@material-ui/core/Paper';
import ReactMarkdown from 'react-markdown';
import { HomeViewerQuery } from './__generated__/HomeViewerQuery.graphql';

const Home = props => (
  <QueryRenderer<HomeViewerQuery>
    environment={environment}
    query={graphql`
      query HomeViewerQuery {
        viewer {
          ...ViewerBuildList_viewer
        }
      }
    `}
    variables={{}}
    render={({ error, props }) => {
      if (!props) {
        return <CirrusLinearProgress />;
      }
      return props.viewer ? (
        <ViewerBuildList viewer={props.viewer} />
      ) : (
        <Paper
          style={{
            padding: '35px',
            margin: '15px',
          }}
        >
          <ReactMarkdown># Welcome to Cirrus CI.</ReactMarkdown>
          <ReactMarkdown>
            Please [**sign in**](https://api.cirrus-ci.com/redirect/auth/github) to see your recent builds.
          </ReactMarkdown>
          <ReactMarkdown>Just got here? Visit [**our documentation**](https://cirrus-ci.org).</ReactMarkdown>
        </Paper>
      );
    }}
  />
);

export default Home;
