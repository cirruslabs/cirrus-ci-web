import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import HookDetails from '../../components/hooks/HookDetails';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import NotFound from '../NotFound';
import { HookQuery } from './__generated__/HookQuery.graphql';
import { useParams } from 'react-router-dom';

export default function Hook(): JSX.Element {
  let { hookId } = useParams();
  return (
    <QueryRenderer<HookQuery>
      environment={environment}
      variables={{ hookId }}
      query={graphql`
        query HookQuery($hookId: ID!) {
          hook(id: $hookId) {
            ...HookDetails_hook
          }
        }
      `}
      render={({ error, props }) => {
        if (!props) {
          return <CirrusLinearProgress />;
        }
        if (!props.hook) {
          return <NotFound message={error} />;
        }
        return <HookDetails hook={props.hook} />;
      }}
    />
  );
}
