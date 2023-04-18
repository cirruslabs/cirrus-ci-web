import React from 'react';
import { useParams } from 'react-router-dom';
import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import HookDetails from '../../components/hooks/HookDetails';
import NotFound from '../NotFound';

import { HookQuery } from './__generated__/HookQuery.graphql';

function HookById(hookId: string): JSX.Element {
  const response = useLazyLoadQuery<HookQuery>(
    graphql`
      query HookQuery($hookId: ID!) {
        hook(id: $hookId) {
          ...HookDetails_hook
        }
      }
    `,
    { hookId },
  );

  // todo: pass error message to <NotFound>
  if (!response.hook) {
    return <NotFound />;
  }
  return <HookDetails hook={response.hook} />;
}
export default function Hook(): JSX.Element {
  let { hookId } = useParams();

  if (!hookId) {
    return <NotFound />;
  }

  return HookById(hookId);
}
