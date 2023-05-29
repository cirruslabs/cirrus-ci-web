import React, { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { graphql } from 'babel-plugin-relay/macro';
import { useFragment, useSubscription } from 'react-relay';

import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import CardActionArea from '@mui/material/CardActionArea';
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
import { absoluteLink } from '../../utils/link';
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

const useStyles = makeStyles(theme => ({
  actions: {
    transition: theme.transitions.create('opacity'),
    '.RepositoryCard__header:not(:hover):not(:has(& :focus)) &': {
      opacity: 0,
      position: 'absolute',
      right: theme.spacing(2),
    },
  },
}));

export default function RepositoryCard(props: Props) {
  const repository = useFragment(
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

  const theme = useTheme();
  const classes = useStyles();
  const build = repository.lastDefaultBranchBuild;
  const hasEditPermissions = repository.viewerPermission === 'WRITE' || repository.viewerPermission === 'ADMIN';
  const stopPropagation = e => e.stopPropagation();

  const owner = (
    <Link
      component={RouterLink}
      underline="hover"
      color="text.primary"
      to={absoluteLink(repository.platform, repository.owner)}
      onMouseDown={stopPropagation}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Avatar
          src={`https://github.com/${repository.owner}.png`}
          sx={{ width: 20, height: 20, background: theme.palette.action.selected }}
        />
        <Typography variant="body1">{repository.owner}</Typography>
      </Stack>
    </Link>
  );

  const actions = (
    <Stack className={classes.actions} direction="row" spacing={0.5}>
      {/* SETTINGS */}
      {hasEditPermissions && (
        <Tooltip title="Repository Settings">
          <IconButton
            component={RouterLink}
            size="small"
            to={absoluteLink('settings', 'repository', repository.id)}
            onMouseDown={stopPropagation}
          >
            <Settings fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {/* GITHUB */}
      <Tooltip title="Open on GitHub">
        <IconButton
          component={Link}
          href={createLinkToRepository(repository, build?.branch)}
          target="_blank"
          size="small"
          rel="noopener noreferrer"
          onMouseDown={stopPropagation}
        >
          <GitHubIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      {/* HEADER */}
      <CardActionArea>
        <Link
          component={RouterLink}
          underline="none"
          to={absoluteLink(repository.platform, repository.owner, repository.name)}
        >
          <Stack
            className="RepositoryCard__header"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
            p={2}
          >
            {/* REPOSITORY NAME */}
            <Typography variant="h6" color="text.primary" title={repository.name} noWrap>
              {repository.name}
            </Typography>

            {/* OWNER / ACTIONS */}
            {props.isDrawerView ? owner : actions}
          </Stack>
        </Link>
      </CardActionArea>

      <Divider />

      {/* LAST BUILD */}
      <Stack p={0.5}>
        <CardActionArea sx={{ borderRadius: 1 }}>
          <Link component={RouterLink} underline="none" to={absoluteLink('build', build.id)}>
            <Stack p={1.5} spacing={1}>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                LAST BUILD
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <BuildStatusChipNew mini build={build} />
                <Typography title={build.changeMessageTitle} color="text.primary" noWrap>
                  {build.changeMessageTitle}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Hash build={build} />
                <Box onMouseDown={stopPropagation}>
                  <BuildBranchNameChipNew build={build} />
                </Box>
              </Stack>
            </Stack>
          </Link>
        </CardActionArea>
      </Stack>
    </Card>
  );
}
