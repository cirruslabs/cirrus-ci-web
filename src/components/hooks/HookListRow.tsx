import React from 'react';
import { useFragment } from 'react-relay';
import { useNavigate } from 'react-router-dom';

import { graphql } from 'babel-plugin-relay/macro';
import classNames from 'classnames';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { makeStyles } from '@mui/styles';

import HookCreatedChip from 'components/chips/HookCreatedChip';
import HookNameChip from 'components/chips/HookNameChip';
import HookStatusChip from 'components/chips/HookStatusChip';
import { navigateHookHelper } from 'utils/navigateHelper';

import { HookListRow_hook$key } from './__generated__/HookListRow_hook.graphql';

const useStyles = makeStyles(theme => {
  return {
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
  };
});

interface Props {
  hook: HookListRow_hook$key;
}

export default function HookListRow(props: Props) {
  let hook = useFragment(
    graphql`
      fragment HookListRow_hook on Hook {
        id
        ...HookStatusChip_hook
        ...HookCreatedChip_hook
        ...HookNameChip_hook
      }
    `,
    props.hook,
  );

  let classes = useStyles();
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
