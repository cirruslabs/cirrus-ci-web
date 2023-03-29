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

import { RepositoryOwnerChipNew_build$key } from './__generated__/RepositoryOwnerChipNew_build.graphql';

interface Props {
  build: RepositoryOwnerChipNew_build$key;
  withHeader?: boolean;
  className?: string;
}

export default function RepositoryOwnerChipNew(props: Props) {
  let build = useFragment(
    graphql`
      fragment RepositoryOwnerChipNew_build on Build {
        initializer {
          avatarURL
        }
        repository {
          owner
        }
      }
    `,
    props.build,
  );

  let navigate = useNavigate();
  let theme = useTheme();

  function handleRepositoryClick(event, repository) {
    navigateHelper(navigate, event, '/github/' + repository.owner);
  }

  const OwnerChip: React.FC = () => (
    <Chip
      className={props.className}
      label={build.repository.owner}
      avatar={<Avatar src={build.initializer?.avatarURL} alt={build.repository.owner} />}
      size="small"
      title={build.repository.owner}
      onClick={e => handleRepositoryClick(e, build.repository)}
      onAuxClick={e => handleRepositoryClick(e, build.repository)}
    />
  );

  return (
    <>
      {props.withHeader ? (
        <Stack direction="column" spacing={0.5} alignItems="flex-start">
          <Typography variant="caption" color={theme.palette.text.disabled}>
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
