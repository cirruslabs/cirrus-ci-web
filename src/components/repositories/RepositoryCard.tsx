import React, { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { graphql } from 'babel-plugin-relay/macro';
import { useFragment, useSubscription } from 'react-relay';

import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Settings from '@mui/icons-material/Settings';
import GitHubIcon from '@mui/icons-material/GitHub';

import Hash from '../chips/Hash';
import BuildStatusChipNew from '../chips/BuildStatusChipNew';
import BuildBranchNameChipNew from '../chips/BuildBranchNameChipNew';
import { createLinkToRepository } from '../../utils/github';

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
    repositoryOwnerLink: {
      // hitbox
      '&::after': {
        content: '""',
        position: 'absolute',
        top: -16,
        left: -24,
        right: -18,
        bottom: -18,
        // backgroundColor: '#ff00ad73',
      },
    },
    repositoryBuildsLink: {
      // hitbox
      '&::after': {
        content: '""',
        position: 'absolute',
        top: -10,
        left: -18,
        right: 2,
        bottom: -12,
        // backgroundColor: '#ff000073',
      },
    },
    actionButton: {
      color: theme.palette.text.disabled,
      transition: 'color 0.1s ease-in-out',
      '&:hover': {
        color: theme.palette.text.primary,
      },
    },
    lastBuildTitle: {
      width: 'fit-content',
      padding: '0 4px',
      borderRadius: 4,
      transition: 'background 0.1s ease-in-out',
    },
    lastBuildLink: {
      position: 'absolute',
      top: 0,
      left: -14,
      right: -14,
      bottom: -14,
      '&:hover ~ .lastBuildTitle': {
        background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.24)' : theme.palette.action.hover,
      },
      // backgroundColor: '#00e9ff73',
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
        platform
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
  let build = repository.lastDefaultBranchBuild;

  let repositorySettings = null;
  if (repository.viewerPermission === 'WRITE' || repository.viewerPermission === 'ADMIN') {
    repositorySettings = (
      <Tooltip title="Repository Settings">
        <IconButton
          className={classes.actionButton}
          component={RouterLink}
          to={'/settings/repository/' + repository.id}
          disableRipple
          size="small"
        >
          <Settings fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  }

  const repositoryLinkButton = (
    <Tooltip title="Open on GitHub">
      <IconButton
        className={classes.actionButton}
        component={Link}
        href={createLinkToRepository(repository, build?.branch)}
        target="_blank"
        rel="noopener noreferrer"
        disableRipple
        size="small"
      >
        <GitHubIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );

  const repositoryActionButtons = (
    <Stack direction="row">
      {repositorySettings}
      {repositoryLinkButton}
    </Stack>
  );

  const repositoryOwner = (
    <Stack direction="row" alignItems={'center'} spacing={0.5} pr={0.5}>
      <Avatar
        src={`https://github.com/${repository.owner}.png`}
        sizes="small"
        sx={{ backgroundColor: theme.palette.action.selected, width: '18px', height: '18px' }}
      />
      <Link
        className={classes.repositoryOwnerLink}
        component={RouterLink}
        to={`/${repository.platform}/${repository.owner}`}
        sx={{ position: 'relative' }}
        underline="hover"
        color={theme.palette.text.primary}
      >
        <Typography variant="body1" lineHeight={1}>
          {repository.owner}
        </Typography>
      </Link>
    </Stack>
  );

  const LastBuild = () => (
    <Box borderTop={`1px solid ${theme.palette.divider}`} pt={0.5} position="relative">
      <Link
        className={classes.lastBuildLink}
        component={RouterLink}
        to={`/build/${build.id}`}
        sx={{ position: 'absolute' }}
        underline="hover"
      />
      <Box className={`${classes.lastBuildTitle} lastBuildTitle `}>
        <Typography variant="overline" color={theme.palette.text.secondary} lineHeight={1}>
          Last build
        </Typography>
      </Box>
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
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Hash build={build} />
        <BuildBranchNameChipNew build={build} />
      </Stack>
    </Box>
  );

  return (
    <Card elevation={0} sx={{ width: '100%', border: `1px solid ${theme.palette.divider}` }}>
      <CardContent sx={{ '&.MuiCardContent-root:last-child': { pb: 2 } }}>
        <Stack
          direction="row"
          justifyContent="start"
          alignItems="center"
          spacing={props.isDrawerView ? 0 : 0.5}
          my="-5px"
          pb={2}
        >
          <Link
            className={classes.repositoryBuildsLink}
            component={RouterLink}
            to={`/${repository.platform}/${repository.owner}/${repository.name}`}
            sx={{ position: 'relative', width: '100%' }}
            underline="hover"
            color={theme.palette.text.primary}
          >
            <Typography className={classes.commitName} title={repository.name} variant="h6" pl={0.5}>
              {repository.name}
            </Typography>
          </Link>
          <Box ml="auto">{props.isDrawerView ? repositoryOwner : repositoryActionButtons}</Box>
        </Stack>
        <LastBuild />
      </CardContent>
    </Card>
  );
}
