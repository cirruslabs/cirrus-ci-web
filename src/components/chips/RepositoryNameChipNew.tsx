import React from 'react';
import { useFragment } from 'react-relay';
import { useNavigate } from 'react-router-dom';
import { graphql } from 'babel-plugin-relay/macro';

import { makeStyles } from '@mui/styles';
import { deepPurple } from '@mui/material/colors';
import Chip from '@mui/material/Chip';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';

import { navigateHelper } from '../../utils/navigateHelper';

import { RepositoryNameChipNew_repository$key } from './__generated__/RepositoryNameChipNew_repository.graphql';

const useStyles = makeStyles(theme => {
  return {
    chip: {
      '& .MuiChip-avatar': {
        height: 16,
        width: 16,
        marginLeft: 6,
        marginRight: theme.spacing(-0.5),
        color: deepPurple[500],
      },
    },
  };
});

interface Props {
  repository: RepositoryNameChipNew_repository$key;
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

  let classes = useStyles();
  let navigate = useNavigate();

  function handleRepositoryClick(event, repository) {
    navigateHelper(navigate, event, '/github/' + repository.owner + '/' + repository.name);
  }

  return (
    <Chip
      className={classes.chip}
      label={repository.name}
      avatar={<BookOutlinedIcon />}
      size="small"
      title={repository.name}
      onClick={e => handleRepositoryClick(e, repository)}
      onAuxClick={e => handleRepositoryClick(e, repository)}
    />
  );
}
