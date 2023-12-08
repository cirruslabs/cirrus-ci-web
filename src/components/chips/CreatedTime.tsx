import React from 'react';
import { useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import mui from 'mui';

import { CreatedTime_build$key } from './__generated__/CreatedTime_build.graphql';

interface Props {
  build: CreatedTime_build$key;
}

export default function CreatedTime(props: Props) {
  const build = useFragment(
    graphql`
      fragment CreatedTime_build on Build {
        buildCreatedTimestamp
      }
    `,
    props.build,
  );

  const today = new Date();
  const buildDate = new Date(build.buildCreatedTimestamp);

  let label = new Date(build.buildCreatedTimestamp).toLocaleTimeString();
  if (
    buildDate.getDate() !== today.getDate() ||
    buildDate.getMonth() !== today.getMonth() ||
    buildDate.getFullYear() !== today.getFullYear()
  ) {
    // check if date is not today and then append date
    label += ' ' + buildDate.toLocaleDateString();
  }

  return (
    <mui.Chip
      variant="outlined"
      size="small"
      clickable
      sx={{ borderRadius: 1.5 }}
      icon={<mui.icons.WatchLater />}
      label={label}
    />
  );
}
