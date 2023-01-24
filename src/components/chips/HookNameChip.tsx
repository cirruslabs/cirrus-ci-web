import React from 'react';

import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Functions from '@mui/icons-material/Functions';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { makeStyles } from '@mui/styles';
import { navigateHookHelper } from '../../utils/navigateHelper';
import { useNavigate } from 'react-router-dom';
import { HookNameChip_hook } from './__generated__/HookNameChip_hook.graphql';

const useStyles = makeStyles(theme => {
  return {
    avatar: {
      backgroundColor: theme.palette.primary.main,
    },
    avatarIcon: {
      color: theme.palette.primary.contrastText,
    },
  };
});

interface Props {
  hook: HookNameChip_hook;
  className?: string;
}

let HookNameChip = (props: Props) => {
  const { hook, className } = props;
  let classes = useStyles();
  let navigate = useNavigate();

  return (
    <Chip
      className={className}
      label={hook.name}
      onClick={e => navigateHookHelper(navigate, e, hook.id)}
      onAuxClick={e => navigateHookHelper(navigate, e, hook.id)}
      avatar={
        <Avatar className={classes.avatar}>
          <Functions className={classes.avatarIcon} />
        </Avatar>
      }
    />
  );
};

export default createFragmentContainer(HookNameChip, {
  hook: graphql`
    fragment HookNameChip_hook on Hook {
      id
      name
    }
  `,
});
