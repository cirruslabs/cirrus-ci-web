import * as React from 'react';
import { useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import GitHubIcon from '@mui/icons-material/GitHub';
import InputIcon from '@mui/icons-material/Input';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import { absoluteLink } from 'utils/link';

import AccountSwitch from './AccountSwitch';
import RepositoryIcon from './RepositoryIcon';
import { AppBreadcrumbs_build$key } from './__generated__/AppBreadcrumbs_build.graphql';
import { AppBreadcrumbs_info$key } from './__generated__/AppBreadcrumbs_info.graphql';
import { AppBreadcrumbs_repository$key } from './__generated__/AppBreadcrumbs_repository.graphql';
import { AppBreadcrumbs_task$key } from './__generated__/AppBreadcrumbs_task.graphql';
import { AppBreadcrumbs_viewer$key } from './__generated__/AppBreadcrumbs_viewer.graphql';

const useStyles = makeStyles(theme => {
  return {
    root: {
      alignItems: 'center',
    },
    breadcrumbs: {
      padding: theme.spacing(2.5),
      paddingLeft: theme.spacing(2),
      color: theme.palette.text.disabled,
    },
    crumb: {
      display: 'flex',
      alignItems: 'center',
      fontSize: 15,
    },
    crumbActive: {
      color: theme.palette.text.primary,
    },
    icon: {
      display: 'flex',
      fontSize: 16,
      marginRight: theme.spacing(1),
    },
  };
});

interface Props {
  info?: AppBreadcrumbs_info$key;
  repository?: AppBreadcrumbs_repository$key;
  build?: AppBreadcrumbs_build$key;
  task?: AppBreadcrumbs_task$key;
  branch?: string;
  extraCrumbs?: Array<Crumb>;
  viewer?: AppBreadcrumbs_viewer$key | null;
}

interface Crumb {
  name: string;
  href?: string;
  Icon: typeof SvgIcon | React.ElementType;
}

export default function AppBreadcrumbs(props: Props) {
  let info = useFragment(
    graphql`
      fragment AppBreadcrumbs_info on OwnerInfo {
        platform
        name
      }
    `,
    props.info ?? null,
  );
  let repository = useFragment(
    graphql`
      fragment AppBreadcrumbs_repository on Repository {
        id
        platform
        owner
        name
      }
    `,
    props.repository ?? null,
  );
  let build = useFragment(
    graphql`
      fragment AppBreadcrumbs_build on Build {
        id
        branch
        changeIdInRepo
        repository {
          id
          platform
          owner
          name
        }
      }
    `,
    props.build ?? null,
  );
  let task = useFragment(
    graphql`
      fragment AppBreadcrumbs_task on Task {
        id
        name
        build {
          id
          branch
          changeIdInRepo
          repository {
            id
            platform
            owner
            name
          }
        }
      }
    `,
    props.task ?? null,
  );
  let viewer = useFragment(
    graphql`
      fragment AppBreadcrumbs_viewer on User {
        ...AccountSwitch_viewer
      }
    `,
    props.viewer ?? null,
  );

  let { branch, extraCrumbs } = props;
  let classes = useStyles();

  let ownerName = task?.build?.repository?.owner || build?.repository?.owner || repository?.owner || info?.name;
  let platform =
    task?.build?.repository?.platform || build?.repository?.platform || repository?.platform || info?.platform;
  const ownerCrumb: Crumb | null =
    platform && ownerName
      ? {
          name: ownerName,
          href: absoluteLink(platform, ownerName),
          Icon: GitHubIcon,
        }
      : null;

  let repositoryName = task?.build?.repository?.name || build?.repository?.name || repository?.name;
  const repositoryCrumb: Crumb | null =
    platform && ownerName && repositoryName
      ? {
          name: repositoryName,
          href: absoluteLink(platform, ownerName, repositoryName),
          Icon: RepositoryIcon,
        }
      : null;

  let branchName = branch || task?.build?.branch || build?.branch;
  const branchCrumb: Crumb | null =
    platform && ownerName && repositoryName && branchName
      ? {
          name: branchName,
          href: absoluteLink(platform, ownerName, repositoryName, branchName),
          Icon: CallSplitIcon,
        }
      : null;

  let buildId = task?.build?.id || build?.id;
  let buildHash = task?.build?.changeIdInRepo || build?.changeIdInRepo;
  const buildCrumb: Crumb | null =
    buildId && buildHash
      ? {
          name: `Build for ${buildHash.substr(0, 7)}`,
          href: absoluteLink('build', buildId),
          Icon: InputIcon,
        }
      : null;

  const taskCrumb: Crumb | null = task
    ? {
        name: task.name,
        href: absoluteLink('task', task.id),
        Icon: BookmarkBorderIcon,
      }
    : null;

  const crumbs: Crumb[] = [
    ownerCrumb,
    repositoryCrumb,
    branchCrumb,
    buildCrumb,
    taskCrumb,
    ...(extraCrumbs || []),
  ].filter(crumb => crumb !== null) as Crumb[];

  return (
    <Stack className={classes.root} direction="row" spacing={1}>
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>{viewer ? <AccountSwitch viewer={viewer} /> : null}</Box>
      <Breadcrumbs
        className={classes.breadcrumbs}
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {crumbs.map((crumb, i) => (
          <CrumbComponent
            key={crumb.name}
            active={crumbs.length - 1 === i}
            name={crumb.name}
            href={crumb.href}
            Icon={crumb.Icon}
          />
        ))}
      </Breadcrumbs>
    </Stack>
  );
}

interface CrumbProps {
  active: boolean;
  name: string;
  href?: string;
  Icon: typeof SvgIcon | React.ElementType;
}

const CrumbComponent = ({ active, name, href, Icon }: CrumbProps) => {
  let classes = useStyles();
  const className = `${classes.crumb} ${active ? classes.crumbActive : ''}`;
  const content = (
    <>
      <div className={classes.icon}>
        <Icon fontSize="inherit" />
      </div>
      {name}
    </>
  );

  if (active) {
    return <Typography className={className}>{content}</Typography>;
  }

  return (
    <Link className={className} color="inherit" underline="hover" href={href}>
      {content}
    </Link>
  );
};
