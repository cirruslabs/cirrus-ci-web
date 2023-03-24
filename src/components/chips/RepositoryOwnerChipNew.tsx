import React from 'react';
import { useFragment } from 'react-relay';
import Chip from '@mui/material/Chip';
import { useNavigate } from 'react-router-dom';
import { graphql } from 'babel-plugin-relay/macro';

import { navigateHelper } from '../../utils/navigateHelper';

import { RepositoryOwnerChipNew_repository$key } from './__generated__/RepositoryOwnerChipNew_repository.graphql';

interface Props {
  repository: RepositoryOwnerChipNew_repository$key;
}

export default function RepositoryOwnerChipNew(props: Props) {
  let repository = useFragment(
    graphql`
      fragment RepositoryOwnerChipNew_repository on Repository {
        owner
      }
    `,
    props.repository,
  );

  let navigate = useNavigate();

  function handleRepositoryClick(event, repository) {
    navigateHelper(navigate, event, '/github/' + repository.owner);
  }

  return (
    <Chip
      label={repository.owner}
      size="small"
      title={repository.owner}
      onClick={e => handleRepositoryClick(e, repository)}
      onAuxClick={e => handleRepositoryClick(e, repository)}
    />
  );
}
