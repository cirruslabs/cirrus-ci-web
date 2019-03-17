import React from 'react';

import {graphql, QueryRenderer} from 'react-relay';

import environment from '../../createRelayEnvironment';
import BuildDetails from '../../components/BuildDetails'
import CirrusLinearProgress from "../../components/CirrusLinearProgress";
import NotFound from "../NotFound";

const Build = (props) => (
  <QueryRenderer
    environment={environment}
    variables={props.match.params}
    query={
      graphql`
        query BuildQuery($buildId: ID!) {
          build(id: $buildId) {
            ...BuildDetails_build
          }
        }
      `
    }

    render={({error, props}) => {
      if (!props) {
        return <CirrusLinearProgress/>
      }
      if (!props.build) {
        return <NotFound message={error}/>;
      }
      return <BuildDetails build={props.build}/>
    }}
  />
);

export default Build;
