import React from 'react';

import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import Head from 'react-helmet';

// has to be JS because otherwise the property throws a TS error
export default createFragmentContainer(
  props => {
    let task = props.task;
    return (
      <Head>
        <title>{task.name} - Cirrus CI</title>
      </Head>
    );
  },
  {
    task: graphql`
      fragment TaskNameChip_task on Task {
        name
      }
    `,
  },
);
