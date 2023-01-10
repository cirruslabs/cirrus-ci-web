import { WithStyles } from '@mui/styles';
import Link from '@mui/material/Link';
import SvgIcon from '@mui/material/SvgIcon';
import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography';
import InputIcon from '@mui/icons-material/Input';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import GitHubIcon from '@mui/icons-material/GitHub';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import createStyles from '@mui/styles/createStyles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

import { absoluteLink } from '../../utils/link';
import RepositoryIcon from './RepositoryIcon';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { AppBreadcrumbs_build } from './__generated__/AppBreadcrumbs_build.graphql';
import { AppBreadcrumbs_repository } from './__generated__/AppBreadcrumbs_repository.graphql';
import { AppBreadcrumbs_task } from './__generated__/AppBreadcrumbs_task.graphql';
import { AppBreadcrumbs_info } from './__generated__/AppBreadcrumbs_info.graphql';

const styles = theme =>
  createStyles({
    root: {
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
  });

const styled = withStyles(styles);

interface Props extends WithStyles<typeof styles> {
  info?: AppBreadcrumbs_info;
  repository?: AppBreadcrumbs_repository;
  build?: AppBreadcrumbs_build;
  task?: AppBreadcrumbs_task;
  branch?: string;
  extraCrumbs?: Array<{
    name: string;
    href?: string;
    Icon: typeof SvgIcon | React.ElementType;
  }>;
}

const AppBreadcrumbs = (props: Props) => {
  let { classes, branch, extraCrumbs, info, repository, build, task } = props;

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
    <Breadcrumbs className={classes.root} separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
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
  );
};

interface CrumbProps extends WithStyles<typeof styles> {
  active: boolean;
  name: string;
  href?: string;
  Icon: typeof SvgIcon | React.ElementType;
}

const Crumb = styled(({ active, name, href, Icon, classes }: CrumbProps) => {
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
});

export default createFragmentContainer(styled(AppBreadcrumbs), {
  info: graphql`
    fragment AppBreadcrumbs_info on OwnerInfo {
      platform
      name
    }
  `,
  repository: graphql`
    fragment AppBreadcrumbs_repository on Repository {
      id
      platform
      owner
      name
    }
  `,
  build: graphql`
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
  task: graphql`
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
});
