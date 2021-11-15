import React from 'react';
import { useNavigate } from 'react-router-dom';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { navigateHookHelper } from '../../utils/navigateHelper';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { HookListRow_hook } from './__generated__/HookListRow_hook.graphql';
import HookStatusChip from '../chips/HookStatusChip';
import HookNameChip from '../chips/HookNameChip';
import HookCreatedChip from '../chips/HookCreatedChip';

const styles = theme =>
  createStyles({
    chip: {
      marginTop: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
      marginLeft: theme.spacing(0.5),
    },
    lastChip: {
      marginRight: theme.spacing(0.5),
    },
    cell: {
      padding: 0,
      height: '100%',
    },
  });

interface Props extends WithStyles<typeof styles> {
  hook: HookListRow_hook;
}

function HookListRow(props: Props) {
  let { hook, classes } = props;
  let navigate = useNavigate();

  return (
    <TableRow onClick={e => navigateHookHelper(navigate, e, hook.id)} hover={true} style={{ cursor: 'pointer' }}>
      <TableCell className={classNames(classes.cell)}>
        <HookStatusChip className={classes.chip} hook={hook} />
        <HookCreatedChip className={classes.chip} hook={hook} />
        <HookNameChip className={classNames(classes.chip, classes.lastChip)} hook={hook} />
      </TableCell>
    </TableRow>
  );
}

export default createFragmentContainer(withStyles(styles)(HookListRow), {
  hook: graphql`
    fragment HookListRow_hook on Hook {
      id
      ...HookStatusChip_hook
      ...HookCreatedChip_hook
      ...HookNameChip_hook
    }
  `,
});
