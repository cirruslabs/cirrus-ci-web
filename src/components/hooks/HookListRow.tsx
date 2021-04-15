import React from 'react';
import { useHistory } from 'react-router-dom';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { navigateHook } from '../../utils/navigate';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { HookListRow_hook } from './__generated__/HookListRow_hook.graphql';
import HookStatusChip from '../chips/HookStatusChip';
import HookNameChip from '../chips/HookNameChip';

const styles = theme =>
  createStyles({
    chip: {
      marginTop: 4,
      marginBottom: 4,
      marginLeft: 4,
    },
    lastChip: {
      marginRight: 4,
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
  let history = useHistory();

  return (
    <TableRow onClick={e => navigateHook(history, e, hook.id)} hover={true} style={{ cursor: 'pointer' }}>
      <TableCell className={classNames(classes.cell)}>
        <HookStatusChip className={classes.chip} hook={hook} />
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
      ...HookNameChip_hook
    }
  `,
});
