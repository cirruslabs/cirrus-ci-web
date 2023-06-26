import React, { useEffect, useMemo } from 'react';
import { useFragment, requestSubscription } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import Chip from '@mui/material/Chip';
import Icon from '@mui/material/Icon';
import { makeStyles } from '@mui/styles';

import environment from 'createRelayEnvironment';

import { isBuildFinalStatus } from 'utils/status';

import { BuildStatusChipNew_build$key } from './__generated__/BuildStatusChipNew_build.graphql';

interface Props {
  build: BuildStatusChipNew_build$key;
  mini?: boolean;
}

const useStyles = makeStyles(theme => {
  return {
    chip: {
      '& *': {
        color: theme.palette.background.default,
      },
    },
  };
});

const buildSubscription = graphql`
  subscription BuildStatusChipNewSubscription($buildID: ID!) {
    build(id: $buildID) {
      ...BuildStatusChipNew_build
    }
  }
`;

export default function BuildStatusChip(props: Props) {
  let build = useFragment(
    graphql`
      fragment BuildStatusChipNew_build on Build {
        id
        status
      }
    `,
    props.build,
  );

  let classes = useStyles();

  const isFinalStatus = useMemo(() => isBuildFinalStatus(build.status), [build.status]);
  useEffect(() => {
    if (isFinalStatus) {
      return;
    }

    let variables = { buildID: build.id };

    const subscription = requestSubscription(environment, {
      subscription: buildSubscription,
      variables: variables,
    });
    return () => {
      subscription.dispose();
    };
  }, [build.id, isFinalStatus]);

  const label =
    {
      CREATED: 'created',
      EXECUTING: 'executing',
      COMPLETED: 'completed',
      FAILED: 'failed',
      ABORTED: 'aborted',
    }[build.status] || build.status.toLowerCase();

  const color =
    {
      TRIGGERED: 'info',
      CREATED: 'secondary',
      EXECUTING: 'info',
      COMPLETED: 'success',
      FAILED: 'error',
      ABORTED: 'warning',
    }[build.status] || 'error';

  const icon =
    {
      TRIGGERED: 'play_circle',
      CREATED: 'cloud_circle',
      EXECUTING: 'play_circle',
      COMPLETED: 'check_circle',
      FAILED: 'error_circle',
      ABORTED: 'stop_circle',
    }[build.status] || 'error_circle';

  if (props.mini) {
    return <Icon color={color}>{icon}</Icon>;
  }

  return (
    <div className={classes.chip}>
      <Chip label={label} color={color} size="small" variant="filled" icon={<Icon>{icon}</Icon>}></Chip>
    </div>
  );
}
