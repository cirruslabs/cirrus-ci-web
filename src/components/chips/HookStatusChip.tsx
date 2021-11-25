import React from 'react';

import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Icon from '@mui/material/Icon';
import { useHookStatusColor } from '../../utils/colors';
import { hookIconName, hookStatusMessage } from '../../utils/status';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { useTheme } from '@mui/material';
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
