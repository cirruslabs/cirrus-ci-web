import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { graphql } from 'babel-plugin-relay/macro';
import { useFragment, useSubscription } from 'react-relay';

import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Settings from '@mui/icons-material/Settings';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import Hash from '../chips/Hash';
import BuildStatusChipNew from '../chips/BuildStatusChipNew';
import BuildBranchNameChipNew from '../chips/BuildBranchNameChipNew';
import { createLinkToRepository } from '../../utils/github';
import { navigateRepositoryHelper } from '../../utils/navigateHelper';

import { RepositoryCard_repository$key } from './__generated__/RepositoryCard_repository.graphql';

interface Props {
  className?: string;
  repository: RepositoryCard_repository$key;
  isDrawerView?: boolean;
}

const buildSubscription = graphql`
  subscription RepositoryCardSubscription($repositoryID: ID!) {
    repository(id: $repositoryID) {
      ...RepositoryCard_repository
    }
  }
`;

const useStyles = makeStyles(theme => {
  return {
    card: {
      cursor: 'pointer',
      border: `1px solid ${theme.palette.divider}`,
      transition: 'background-color 0.1s ease-in-out',
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
        '& $actionButtonToLastBuild': {
          // visibility: 'visible',
          opacity: 1,
        },
      },
    },
    actionButton: {
      color: theme.palette.text.disabled,
      transition: 'color 0.1s ease-in-out',
      '&:hover': {
        color: theme.palette.text.primary,
      },
    },
    actionButtonToLastBuild: {
      transition: 'opacity 0.2s',
      opacity: 0,
      // visibility: 'hidden',
    },
    commitName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'normal',
      // Text truncate doesnt't work here without styles below
      display: '-webkit-box',
      WebkitLineClamp: 1,
      WebkitBoxOrient: 'vertical',
    },
  };
});

export default function RepositoryCard(props: Props) {
  let repository = useFragment(
    graphql`
      fragment RepositoryCard_repository on Repository {
        id
        owner
        name
        viewerPermission
        lastDefaultBranchBuild {
          id
          branch
          changeMessageTitle
          ...Hash_build
          ...BuildStatusChipNew_build
          ...BuildBranchNameChipNew_build
        }
      }
    `,
    props.repository,
  );

  const buildSubscriptionConfig = useMemo(
    () => ({
      variables: { repositoryID: repository.id },
      subscription: buildSubscription,
    }),
    [repository.id],
  );
  useSubscription(buildSubscriptionConfig);

  let theme = useTheme();
  let classes = useStyles();
  let navigate = useNavigate();
  let build = repository.lastDefaultBranchBuild;

  let repositorySettings = null;
  if (repository.viewerPermission === 'WRITE' || repository.viewerPermission === 'ADMIN') {
    repositorySettings = (
      <Tooltip title="Repository Settings">
        <Link href={'/settings/repository/' + repository.id}>
          <IconButton disableRipple className={classes.actionButton} size="small">
            <Settings fontSize="small" />
          </IconButton>
        </Link>
      </Tooltip>
    );
  }

  const repositoryLinkButton = (
    <Tooltip title="Open on GitHub">
      <Link href={createLinkToRepository(repository, build?.branch)} target="_blank" rel="noopener noreferrer">
        <IconButton disableRipple className={classes.actionButton} size="small">
          <GitHubIcon fontSize="small" />
        </IconButton>
      </Link>
    </Tooltip>
  );

  const repositoryActionButtons = (
    <Stack direction="row" spacing={0}>
      {repositorySettings}
      {repositoryLinkButton}
    </Stack>
  );

  const repositoryOwner = (
    <Stack direction="row" alignItems={'center'} spacing={0.5} pl={0.5}>
      <Avatar src={`https://github.com/${repository.owner}.png`} sizes="small" sx={{ width: '18px', height: '18px' }} />
      <Typography variant="body1" color={theme.palette.text.primary} lineHeight={1}>
        {repository.owner}
      </Typography>
    </Stack>
  );

  const LastBuild = () => (
    <Box borderTop={`1px solid ${theme.palette.divider}`} p={0.5} pb={0}>
      <Typography variant="overline" color={theme.palette.text.secondary} lineHeight={1} pl={0.5}>
        Last build
      </Typography>
      {/* ????? TO THE LAST BUILD */}
      {/* <Tooltip className={classes.actionButtonToLastBuild} title="Go to last build">
        <Link href={createLinkToRepository(repository, build?.branch)} target="_blank" rel="noopener noreferrer">
          <IconButton disableRipple className={classes.actionButton} size="small">
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        </Link>
      </Tooltip> */}
      <Stack direction="row" alignItems="center" spacing={0.5} my={0.5}>
        <BuildStatusChipNew mini build={build} />
        <Typography
          className={classes.commitName}
          variant="subtitle1"
          title={build.changeMessageTitle}
          lineHeight={1.1}
        >
          {build.changeMessageTitle}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="start" spacing={0.5}>
        <Hash build={build} />
        <BuildBranchNameChipNew build={build} />
      </Stack>
    </Box>
  );

  return (
    <Card
      className={classes.card}
      elevation={0}
      sx={{ width: '100%', p: 2, pt: 1.5 }}
      onClick={e => {
        const target = e.target as HTMLElement;
        if (target.closest('a')) return;
        navigateRepositoryHelper(navigate, e, repository.owner, repository.name);
      }}
      onAuxClick={e => {
        const target = e.target as HTMLElement;
        if (target.closest('a')) return;
        navigateRepositoryHelper(navigate, e, repository.owner, repository.name);
      }}
    >
      <Stack
        direction={props.isDrawerView ? 'row' : 'row'}
        justifyContent={props.isDrawerView ? 'space-between' : 'space-between'}
        alignItems={props.isDrawerView ? 'center' : 'center'}
        spacing={props.isDrawerView ? 0 : 0.5}
        pb={1.5}
      >
        <Typography className={classes.commitName} title={repository.name} variant="h6" pl={0.5}>
          {repository.name}
        </Typography>
        {props.isDrawerView ? repositoryOwner : repositoryActionButtons}
      </Stack>
      <LastBuild />
    </Card>
  );
}
