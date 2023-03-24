import React from 'react';
import { useFragment } from 'react-relay';
import { useNavigate } from 'react-router-dom';
import { graphql } from 'babel-plugin-relay/macro';

import { makeStyles } from '@mui/styles';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import { navigateHelper } from '../../utils/navigateHelper';

import { RepositoryOwnerChipNew_repository$key } from './__generated__/RepositoryOwnerChipNew_repository.graphql';

const useStyles = makeStyles(theme => {
  return {
    header: {
      fontSize: '14px !important',
      color: theme.palette.text.disabled,
    },
  };
});

interface Props {
  repository: RepositoryOwnerChipNew_repository$key;
  withHeader?: boolean;
  className?: string;
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

  let classes = useStyles();
  let navigate = useNavigate();

  function handleRepositoryClick(event, repository) {
    navigateHelper(navigate, event, '/github/' + repository.owner);
  }

  return (
    <>
      {props.withHeader ? (
        <Stack direction="column" spacing={0.5} alignItems="flex-start">
          <div className={classes.header}>Owner</div>
          <Chip
            className={props.className}
            label={repository.owner}
            size="small"
            title={repository.owner}
            onClick={e => handleRepositoryClick(e, repository)}
            onAuxClick={e => handleRepositoryClick(e, repository)}
          />
        </Stack>
      ) : (
        <Chip
          className={props.className}
          label={repository.owner}
          size="small"
          title={repository.owner}
          onClick={e => handleRepositoryClick(e, repository)}
          onAuxClick={e => handleRepositoryClick(e, repository)}
        />
      )}
    </>
  );
}
