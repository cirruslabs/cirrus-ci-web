import React from 'react';
import { useFragment } from 'react-relay';
import { useNavigate } from 'react-router-dom';
import { graphql } from 'babel-plugin-relay/macro';

import { useTheme } from '@mui/material';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';

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
        <Stack direction="column" spacing={0.5} alignItems="flex-start">
          <Typography variant="caption" color={theme.palette.text.disabled}>
            Repository
          </Typography>
          <Chip
            className={props.className}
            label={repository.name}
            avatar={<BookOutlinedIcon />}
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
          avatar={<BookOutlinedIcon />}
          size="small"
          title={repository.name}
          onClick={e => handleRepositoryClick(e, repository)}
          onAuxClick={e => handleRepositoryClick(e, repository)}
        />
      )}
    </>
  );
}
