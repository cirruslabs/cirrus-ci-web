import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import { useHookStatusColor } from '../../utils/colors';
import { hookIconName, hookStatusMessage } from '../../utils/status';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { useTheme } from '@material-ui/core';
import { HookStatusChip_hook } from './__generated__/HookStatusChip_hook.graphql';

interface Props {
  hook: HookStatusChip_hook;
  className?: string;
}

function HookStatusChip(props: Props) {
  let { hook, className } = props;
  let theme = useTheme();
  return (
    <Chip
      className={className}
      label={hookStatusMessage(hook)}
      avatar={
        <Avatar style={{ backgroundColor: useHookStatusColor(hook) }}>
          <Icon style={{ color: theme.palette.primary.contrastText }}>{hookIconName(hook)}</Icon>
        </Avatar>
      }
    />
  );
}

export default createFragmentContainer(HookStatusChip, {
  hook: graphql`
    fragment HookStatusChip_hook on Hook {
      info {
        error
        durationNanos
      }
    }
  `,
});
