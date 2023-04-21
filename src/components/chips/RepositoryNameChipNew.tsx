import React from 'react';
import { useFragment } from 'react-relay';
import { useNavigate } from 'react-router-dom';
import { graphql } from 'babel-plugin-relay/macro';

import { useTheme } from '@mui/material';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Ballot from '@mui/icons-material/Ballot';

import { navigateHelper } from '../../utils/navigateHelper';

import { RepositoryNameChipNew_repository$key } from './__generated__/RepositoryNameChipNew_repository.graphql';

interface Props {
  repository: RepositoryNameChipNew_repository$key;
  withHeader?: boolean;
  className?: string;
}

export default function RepositoryNameChipNew(props: Props) {
  let repository = useFragment(
    graphql`
      fragment RepositoryNameChipNew_repository on Repository {
        owner
        name
      }
    `,
    props.repository,
  );

  let navigate = useNavigate();
  let theme = useTheme();

  function handleRepositoryClick(event, repository) {
    navigateHelper(navigate, event, '/github/' + repository.owner + '/' + repository.name);
  }

  return (
    <>
      {props.withHeader ? (
        <Stack direction="column" spacing={1} alignItems="flex-start">
          <Typography variant="caption" color={theme.palette.text.disabled} lineHeight={1}>
            Repository
          </Typography>
          <Chip
            className={props.className}
            label={repository.name}
            avatar={<Ballot />}
            size="small"
            title={repository.name}
            onClick={e => handleRepositoryClick(e, repository)}
            onAuxClick={e => handleRepositoryClick(e, repository)}
          />
        </Stack>
      ) : (
        <Chip
          className={props.className}
          label={repository.name}
          avatar={<Ballot />}
          size="small"
          title={repository.name}
          onClick={e => handleRepositoryClick(e, repository)}
          onAuxClick={e => handleRepositoryClick(e, repository)}
        />
      )}
    </>
  );
}
