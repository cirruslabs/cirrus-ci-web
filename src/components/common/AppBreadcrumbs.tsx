import { WithStyles } from '@mui/styles';
import Link from '@mui/material/Link';
import SvgIcon from '@mui/material/SvgIcon';
import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography';
import InputIcon from '@mui/icons-material/Input';
import Settings from '@mui/icons-material/Settings';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import createStyles from '@mui/styles/createStyles';
import GitHubIcon from '@mui/icons-material/GitHub';
import StorageIcon from '@mui/icons-material/Storage';
import CallSplit from '@mui/icons-material/CallSplit';
import TimelineIcon from '@mui/icons-material/Timeline';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

import { absoluteLink } from '../../utils/link';

const styles = () =>
  createStyles({
    root: {
      padding: 22,
    },
    separator: {
      marginLeft: 4,
      marginRight: 4,
    },
    crumb: {
      display: 'flex',
      alignItems: 'center',
      fontSize: 15,
    },
    icon: {
      display: 'flex',
      fontSize: 17,
      marginRight: 8,
    },
  });

const styled = withStyles(styles);

interface Props extends WithStyles<typeof styles> {
  page:
    | 'owner'
    | 'repository'
    | 'branch'
    | 'build'
    | 'task'
    | 'repositoryMetrics'
    | 'ownerSettings'
    | 'repositorySettings';
  platform: string;
  ownerName: string;
  repositoryId?: string;
  repositoryName?: string;
  branchName?: string;
  buildId?: string;
  buildHash?: string;
  taskId?: string;
  taskName?: string;
}

const AppBreadcrumbs = ({
  page,
  platform,
  ownerName,
  repositoryId,
  repositoryName,
  branchName,
  buildId,
  buildHash,
  taskId,
  taskName,
  classes,
}: Props) => {
  const owner = (active = false) => (
    <Crumb key="owner" active={active} name={ownerName} href={absoluteLink(platform, ownerName)} Icon={GitHubIcon} />
  );

  const repository = (active = false) => (
    <Crumb
      key="repository"
      active={active}
      name={repositoryName}
      href={absoluteLink(platform, ownerName, repositoryName)}
      Icon={StorageIcon}
    />
  );

  const branch = (active = false) => (
    <Crumb
      key="branch"
      active={active}
      name={branchName}
      href={absoluteLink(platform, ownerName, repositoryName, branchName)}
      Icon={CallSplit}
    />
  );

  const build = (active = false) => (
    <Crumb
      key="build"
      active={active}
      name={`Build for ${buildHash}`}
      href={absoluteLink('build', buildId)}
      Icon={InputIcon}
    />
  );

  const task = (active = false) => (
    <Crumb key="task" active={active} name={taskName} href={absoluteLink('task', taskId)} Icon={BookmarkBorderIcon} />
  );

  const repositoryMetrics = (active = false) => (
    <Crumb
      key="repositoryMetrics"
      active={active}
      name="Metrics"
      href={absoluteLink('metrics', 'repository', platform, ownerName, repositoryName)}
      Icon={TimelineIcon}
    />
  );

  const ownerSettings = (active = false) => (
    <Crumb
      key="ownerSettings"
      active={active}
      name="Account Settings"
      href={absoluteLink('settings', platform, ownerName)}
      Icon={Settings}
    />
  );

  const repositorySettings = (active = false) => (
    <Crumb
      key="repositorySettings"
      active={active}
      name="Repository Settings"
      href={absoluteLink('settings', 'repository', repositoryId)}
      Icon={Settings}
    />
  );

  const crumbCreators =
    {
      owner: [owner],
      repository: [owner, repository],
      branch: [owner, repository, branch],
      build: [owner, repository, branch, build],
      task: [owner, repository, branch, build, task],
      repositoryMetrics: [owner, repository, repositoryMetrics],
      repositorySettings: [owner, repository, repositorySettings],
      ownerSettings: [owner, ownerSettings],
    }[page] || [];

  const crumbCount = crumbCreators.length;
  const crumbs = crumbCreators.map((f, i) => f(i === crumbCount - 1));

  return (
    <Breadcrumbs
      className={classes.root}
      separator={<NavigateNextIcon className={classes.separator} fontSize="small" />}
      aria-label="breadcrumb"
    >
      {crumbs}
    </Breadcrumbs>
  );
};

interface CrumbProps extends WithStyles<typeof styles> {
  active: boolean;
  name: string;
  href: string;
  Icon: typeof SvgIcon;
}

const Crumb = styled(({ active, name, href, Icon, classes }: CrumbProps) => {
  const content = (
    <>
      <div className={classes.icon}>
        <Icon fontSize="inherit" />
      </div>
      {name}
    </>
  );

  if (active) {
    return (
      <Typography className={classes.crumb} color="text.primary">
        {content}
      </Typography>
    );
  }

  return (
    <Link className={classes.crumb} color="inherit" underline="hover" href={href}>
      {content}
    </Link>
  );
});

export default styled(AppBreadcrumbs);
