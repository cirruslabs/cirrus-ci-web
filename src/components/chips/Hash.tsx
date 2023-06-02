import React, { useCallback } from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import mui from 'mui';

import { Hash_build$key } from './__generated__/Hash_build.graphql';

interface Props {
  build: Hash_build$key;
}

export default function Hash(props: Props) {
  const build = useFragment(
    graphql`
      fragment Hash_build on Build {
        changeIdInRepo
      }
    `,
    props.build,
  );

  const hash = build.changeIdInRepo.substr(0, 7);
  const onClick = useCallback(
    e => {
      e.stopPropagation();
      e.preventDefault();
      navigator.clipboard.writeText(hash);
    },
    [hash],
  );

  return (
    <mui.Tooltip title="Click to copy">
      <mui.Chip
        variant="outlined"
        size="small"
        clickable
        sx={{ borderRadius: 1.5 }}
        icon={<mui.icons.Commit />}
        label={hash}
        onClick={onClick}
        onMouseDown={e => e.stopPropagation()}
      />
    </mui.Tooltip>
  );
}
