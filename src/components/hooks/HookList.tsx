import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import HookListRow from './HookListRow';
import { FragmentRefs } from 'relay-runtime';

interface Hook {
  readonly timestamp: number;
  readonly ' $fragmentRefs': FragmentRefs<'HookListRow_hook'>;
}

interface Props {
  hooks: ReadonlyArray<Hook>;
}

export default (props: Props) => {
  const sortedHooks = props.hooks.slice().sort(function (a, b) {
    return b.timestamp - a.timestamp;
  });

  return (
    <Table style={{ tableLayout: 'auto' }}>
      <TableBody>
        {sortedHooks.map(hook => (
          <HookListRow hook={hook} />
        ))}
      </TableBody>
    </Table>
  );
};
