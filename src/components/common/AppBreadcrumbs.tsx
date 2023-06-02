import * as React from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { Link as RouterLink } from 'react-router-dom';

import { makeStyles } from '@mui/styles';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import InputIcon from '@mui/icons-material/Input';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import GitHubIcon from '@mui/icons-material/GitHub';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

import { absoluteLink } from '../../utils/link';
import RepositoryIcon from './RepositoryIcon';
import AccountSwitch from './AccountSwitch';

import { AppBreadcrumbs_build$key } from './__generated__/AppBreadcrumbs_build.graphql';
import { AppBreadcrumbs_repository$key } from './__generated__/AppBreadcrumbs_repository.graphql';
import { AppBreadcrumbs_task$key } from './__generated__/AppBreadcrumbs_task.graphql';
import { AppBreadcrumbs_info$key } from './__generated__/AppBreadcrumbs_info.graphql';
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
  extraCrumbs?: Array<{
    name: string;
    href?: string;
    Icon: typeof SvgIcon | React.ElementType;
  }>;
  viewer?: AppBreadcrumbs_viewer$key;
}

export default function AppBreadcrumbs(props: Props) {
  let info = useFragment(
    graphql`
      fragment AppBreadcrumbs_info on OwnerInfo {
        platform
        name
      }
    `,
    props.info,
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
    props.repository,
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
    props.build,
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
    props.task,
  );
  let viewer = useFragment(
    graphql`
      fragment AppBreadcrumbs_viewer on User {
        ...AccountSwitch_viewer
      }
    `,
    props.viewer,
  );

  let { branch, extraCrumbs } = props;
  let classes = useStyles();

  let ownerName = task?.build?.repository?.owner || build?.repository?.owner || repository?.owner || info?.name;
  let platform =
    task?.build?.repository?.platform || build?.repository?.platform || repository?.platform || info?.platform;
  const ownerCrumb = {
    name: ownerName,
    href: absoluteLink(platform, ownerName),
    Icon: GitHubIcon,
  };

  let repositoryName = task?.build?.repository?.name || build?.repository?.name || repository?.name;
  const repositoryCrumb = repositoryName && {
    name: repositoryName,
    href: absoluteLink(platform, ownerName, repositoryName),
    Icon: RepositoryIcon,
  };

  let branchName = branch || task?.build?.branch || build?.branch;
  const branchCrumb = branchName && {
    name: branchName,
    href: absoluteLink(platform, ownerName, repositoryName, branchName),
    Icon: CallSplitIcon,
  };

  let buildId = task?.build?.id || build?.id;
  let buildHash = task?.build?.changeIdInRepo || build?.changeIdInRepo;
  const hasBuild = !!(buildHash && buildId);
  const buildCrumb = hasBuild && {
    name: `Build for ${buildHash.substr(0, 7)}`,
    href: absoluteLink('build', buildId),
    Icon: InputIcon,
  };

  const taskCrumb = task && {
    name: task.name,
    href: absoluteLink('task', task.id),
    Icon: BookmarkBorderIcon,
  };

  const crumbs = [ownerCrumb, repositoryCrumb, branchCrumb, buildCrumb, taskCrumb, ...(extraCrumbs || [])].filter(
    Boolean,
  );

  return (
    <Stack className={classes.root} direction="row" spacing={1}>
      <AccountSwitch viewer={viewer} />
      <Breadcrumbs
        className={classes.breadcrumbs}
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {crumbs.map((crumb, i) => (
          <Crumb
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

const Crumb = ({ active, name, href, Icon }: CrumbProps) => {
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
    <Link className={className} component={RouterLink} color="inherit" underline="hover" to={href}>
      {content}
    </Link>
  );
};
