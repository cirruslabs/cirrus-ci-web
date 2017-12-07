import React from 'react';

import {graphql, QueryRenderer} from 'react-relay';

import environment from '../../createRelayEnvironment';
import ViewerBuildList from '../../components/ViewerBuildList'
import CirrusLinearProgress from "../../components/CirrusLinearProgress";
import {Paper, Toolbar, ToolbarGroup, ToolbarTitle} from "material-ui";
import {cirrusColors} from "../../cirrusTheme";

const Home = (props) => (
  <QueryRenderer
    environment={environment}
    query={
      graphql`
        query HomeViewerQuery {
          viewer {
            ...ViewerBuildList_viewer
          }
        }
      `
    }

    render={({error, props}) => {
      if (!props) {
        return <CirrusLinearProgress />
      }
      if (!props.viewer) {
        return (
          <div style={{paddingTop: 8}} className="container">
            <Paper zDepth={1} rounded={false}>
              <Toolbar>
                <ToolbarGroup>
                  <ToolbarTitle text="Please Log In to see your recent builds"/>
                </ToolbarGroup>
              </Toolbar>
            </Paper>
          </div>
        );
      }
      return <ViewerBuildList viewer={props.viewer}/>
    }}
  />
);

export default Home;
