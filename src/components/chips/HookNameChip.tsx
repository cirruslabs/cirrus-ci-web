import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Functions from '@material-ui/icons/Functions';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { navigateHook } from '../../utils/navigate';
import { useHistory } from 'react-router-dom';
import { HookNameChip_hook } from './__generated__/HookNameChip_hook.graphql';

const styles = theme =>
  createStyles({
    avatar: {
      backgroundColor: theme.palette.primary.main,
    },
    avatarIcon: {
      color: theme.palette.primary.contrastText,
    },
  });

interface Props extends WithStyles<typeof styles> {
  hook: HookNameChip_hook;
  className?: string;
}

let HookNameChip = (props: Props) => {
  const { hook, className, classes } = props;
  let history = useHistory();

  return (
    <Chip
      className={className}
      label={hook.name}
      onClick={e => navigateHook(history, e, hook.id)}
      avatar={
        <Avatar className={classes.avatar}>
          <Functions className={classes.avatarIcon} />
        </Avatar>
      }
    />
  );
};

export default createFragmentContainer(withStyles(styles)(HookNameChip), {
  hook: graphql`
    fragment HookNameChip_hook on Hook {
      id
      name
    }
  `,
});
