import React, { useMemo } from 'react';

import { Link as RouterLink } from 'react-router-dom';
import { graphql } from 'babel-plugin-relay/macro';
import { useFragment, useSubscription } from 'react-relay';

import mui from 'mui';
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

const useStyles = mui.makeStyles(theme => ({
  actions: {
    '@media (hover: hover)': {
      transition: theme.transitions.create('opacity'),
      '.RepositoryCard__header:not(:hover):not(:has(& :focus)) &': {
        opacity: 0,
        position: 'absolute',
        right: theme.spacing(2),
      },
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

  const theme = mui.useTheme();
  const classes = useStyles();
  const build = repository.lastDefaultBranchBuild;
  const hasEditPermissions = repository.viewerPermission === 'WRITE' || repository.viewerPermission === 'ADMIN';
  const stopPropagation = e => e.stopPropagation();

  const owner = (
    <mui.Link
      component={RouterLink}
      underline="hover"
      color="text.primary"
      to={absoluteLink(repository.platform, repository.owner)}
      onMouseDown={stopPropagation}
    >
      <mui.Stack direction="row" alignItems="center" spacing={1}>
        <mui.Avatar
          src={`https://github.com/${repository.owner}.png`}
          sx={{ width: 20, height: 20, background: theme.palette.action.selected }}
        />
        <mui.Typography variant="body1">{repository.owner}</mui.Typography>
      </mui.Stack>
    </mui.Link>
  );

  const actions = (
    <mui.Stack className={classes.actions} direction="row" spacing={0.5}>
      {/* SETTINGS */}
      {hasEditPermissions && (
        <mui.Tooltip title="Repository Settings">
          <mui.IconButton
            component={RouterLink}
            size="small"
            to={absoluteLink('settings', 'repository', repository.id)}
            onMouseDown={stopPropagation}
          >
            <mui.icons.Settings fontSize="small" />
          </mui.IconButton>
        </mui.Tooltip>
      )}

      {/* GITHUB */}
      <mui.Tooltip title="Open on GitHub">
        <mui.IconButton
          component={mui.Link}
          href={createLinkToRepository(repository, build?.branch)}
          target="_blank"
          size="small"
          rel="noopener noreferrer"
          onMouseDown={stopPropagation}
        >
          <mui.icons.GitHub fontSize="small" />
        </mui.IconButton>
      </mui.Tooltip>
    </mui.Stack>
  );

  let lastBuildComponent = build ? (
    <mui.Stack p={0.5}>
      <mui.CardActionArea sx={{ borderRadius: 1 }}>
        <mui.Link component={RouterLink} underline="none" to={absoluteLink('build', build.id)}>
          <mui.Stack p={1.5} spacing={1}>
            <mui.Typography variant="caption" color="text.secondary" gutterBottom>
              LAST BUILD
            </mui.Typography>
            <mui.Stack direction="row" alignItems="center" spacing={1}>
              <BuildStatusChipNew mini build={build} />
              <mui.Typography title={build.changeMessageTitle} color="text.primary" noWrap>
                {build.changeMessageTitle}
              </mui.Typography>
            </mui.Stack>
            <mui.Stack direction="row" alignItems="center" spacing={1.5}>
              <Hash build={build} />
              <mui.Box onMouseDown={stopPropagation}>
                <BuildBranchNameChipNew build={build} />
              </mui.Box>
            </mui.Stack>
          </mui.Stack>
        </mui.Link>
      </mui.CardActionArea>
    </mui.Stack>
  ) : null;
  return (
    <mui.Card variant="outlined" sx={{ width: '100%' }}>
      {/* HEADER */}
      <mui.CardActionArea>
        <mui.Link
          component={RouterLink}
          underline="none"
          to={absoluteLink(repository.platform, repository.owner, repository.name)}
        >
          <mui.Stack
            className="RepositoryCard__header"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
            p={2}
          >
            {/* REPOSITORY NAME */}
            <mui.Typography variant="h6" color="text.primary" title={repository.name} noWrap>
              {repository.name}
            </mui.Typography>

            {/* OWNER / ACTIONS */}
            {props.isDrawerView ? owner : actions}
          </mui.Stack>
        </mui.Link>
      </mui.CardActionArea>

      <mui.Divider />

      {/* LAST BUILD */}
      {lastBuildComponent}
      <mui.Stack p={0.5}>
        <mui.CardActionArea sx={{ borderRadius: 1 }}>
          <mui.Link component={RouterLink} underline="none" to={absoluteLink('build', build.id)}>
            <mui.Stack p={1.5} spacing={1}>
              <mui.Typography variant="caption" color="text.secondary" gutterBottom>
                LAST BUILD
              </mui.Typography>
              <mui.Stack direction="row" alignItems="center" spacing={1}>
                <BuildStatusChipNew mini build={build} />
                <mui.Typography title={build.changeMessageTitle} color="text.primary" noWrap>
                  {build.changeMessageTitle}
                </mui.Typography>
              </mui.Stack>
              <mui.Stack direction="row" alignItems="center" spacing={1}>
                <Hash build={build} />
                <mui.Box onMouseDown={stopPropagation}>
                  <BuildBranchNameChipNew build={build} />
                </mui.Box>
              </mui.Stack>
            </mui.Stack>
          </mui.Link>
        </mui.CardActionArea>
      </mui.Stack>
    </mui.Card>
  );
}
