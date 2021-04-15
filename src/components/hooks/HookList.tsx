import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import HookListRow from './HookListRow';
import { FragmentRefs } from 'relay-runtime';

interface Hook {
  readonly ' $fragmentRefs': FragmentRefs<'HookListRow_hook'>;
}

interface Props {
  hooks: ReadonlyArray<Hook>;
}

export default (props: Props) => {
  return (
    <Table style={{ tableLayout: 'auto' }}>
      <TableBody>
        {props.hooks.map(hook => (
          <HookListRow hook={hook} />
        ))}
      </TableBody>
    </Table>
  );
};
