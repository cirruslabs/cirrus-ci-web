import React from 'react';
import { useFragment } from 'react-relay';
import { useNavigate } from 'react-router-dom';
import { graphql } from 'babel-plugin-relay/macro';

import { useTheme } from '@mui/material';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { navigateHelper } from '../../utils/navigateHelper';

import { RepositoryOwnerChipNew_repository$key } from './__generated__/RepositoryOwnerChipNew_repository.graphql';

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

  let navigate = useNavigate();
  let theme = useTheme();

  function handleRepositoryClick(event, repository) {
    navigateHelper(navigate, event, '/github/' + repository.owner);
  }

  const OwnerChip: React.FC = () => (
    <Chip
      className={props.className}
      label={repository.owner}
      avatar={
        <Avatar
          src={`https://github.com/${repository.owner}.png`}
          alt={repository.owner}
          sx={{ backgroundColor: theme.palette.action.selected }}
        />
      }
      size="small"
      title={repository.owner}
      onClick={e => handleRepositoryClick(e, repository)}
      onAuxClick={e => handleRepositoryClick(e, repository)}
    />
  );

  return (
    <>
      {props.withHeader ? (
        <Stack direction="column" spacing={1} alignItems="flex-start">
          <Typography variant="caption" color={theme.palette.text.disabled} lineHeight={1}>
            Owner
          </Typography>
          <OwnerChip />
        </Stack>
      ) : (
        <OwnerChip />
      )}
    </>
  );
}
