import React from 'react';
import { useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import ComputeCreditsBase from './ComputeCreditsBase';
import ComputeCreditsTransactionsList from './ComputeCreditsTransactionsList';
import { OwnerComputeCredits_info$key } from './__generated__/OwnerComputeCredits_info.graphql';

interface Props {
  info: OwnerComputeCredits_info$key;
}

export default function OwnerComputeCredits(props: Props) {
  let info = useFragment(
    graphql`
      fragment OwnerComputeCredits_info on OwnerInfo {
        uid
        name
        balanceInCredits
        ...ComputeCreditsBase_info
        transactions(last: 50) {
          edges {
            node {
              ...ComputeCreditsTransactionsList_transactions
            }
          }
        }
      }
    `,

    props.info,
  );

  return (
    <ComputeCreditsBase
      ownerUid={info.uid}
      balanceInCredits={info.balanceInCredits}
      info={info}
      transactionsComponent={
        <ComputeCreditsTransactionsList transactions={info.transactions.edges.map(edge => edge.node)} />
      }
    />
  );
}
