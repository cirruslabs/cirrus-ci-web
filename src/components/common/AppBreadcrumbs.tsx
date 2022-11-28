import { WithStyles } from '@mui/styles';
import Link from '@mui/material/Link';
import SvgIcon from '@mui/material/SvgIcon';
import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography';
import InputIcon from '@mui/icons-material/Input';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import createStyles from '@mui/styles/createStyles';
import GitHubIcon from '@mui/icons-material/GitHub';
import TimelineIcon from '@mui/icons-material/Timeline';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

import { absoluteLink } from '../../utils/link';
import RepositoryIcon from './RepositoryIcon';

const styles = theme =>
  createStyles({
    root: {
      padding: 22,
      color: theme.palette.mode === 'dark' ? '#949599' : '#7a7b83',
    },
    crumb: {
      display: 'flex',
      alignItems: 'center',
      fontSize: 15,
    },
    crumbActive: {
      color: theme.palette.mode === 'dark' ? theme.palette.primary.contrastText : '#000',
    },
    icon: {
      display: 'flex',
      fontSize: 16,
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
    <Crumb
      key="owner"
      active={active}
      name={ownerName}
      href={absoluteLink(platform, ownerName)}
      Icon={GitHubIcon}
      iconStyle={{ fontSize: 17 }}
    />
  );

  const repository = (active = false) => (
    <Crumb
      key="repository"
      active={active}
      name={repositoryName}
      href={absoluteLink(platform, ownerName, repositoryName)}
      Icon={RepositoryIcon}
      iconStyle={{ fontSize: 15.5 }}
    />
  );

  const branch = (active = false) => (
    <Crumb
      key="branch"
      active={active}
      name={branchName}
      href={absoluteLink(platform, ownerName, repositoryName, branchName)}
      Icon={CallSplitIcon}
      iconStyle={{ fontSize: 17.5 }}
    />
  );

  const build = (active = false) => (
    <Crumb
      key="build"
      active={active}
      name={`Build for ${buildHash}`}
      href={absoluteLink('build', buildId)}
      Icon={InputIcon}
      iconStyle={{ fontSize: 16, marginRight: 9 }}
    />
  );

  const task = (active = false) => (
    <Crumb
      key="task"
      active={active}
      name={taskName}
      href={absoluteLink('task', taskId)}
      Icon={BookmarkBorderIcon}
      iconStyle={{ fontSize: 18, marginLeft: -3, marginRight: 6 }}
    />
  );

  const repositoryMetrics = (active = false) => (
    <Crumb
      key="repositoryMetrics"
      active={active}
      name="Metrics"
      href={absoluteLink('metrics', 'repository', platform, ownerName, repositoryName)}
      Icon={TimelineIcon}
      iconStyle={{ fontSize: 16 }}
    />
  );

  const ownerSettings = (active = false) => (
    <Crumb
      key="ownerSettings"
      active={active}
      name="Account Settings"
      href={absoluteLink('settings', platform, ownerName)}
      Icon={ManageAccountsIcon}
      iconStyle={{ fontSize: 18 }}
    />
  );

  const repositorySettings = (active = false) => (
    <Crumb
      key="repositorySettings"
      active={active}
      name="Repository Settings"
      href={absoluteLink('settings', 'repository', repositoryId)}
      Icon={SettingsOutlinedIcon}
      iconStyle={{ fontSize: 16 }}
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
    <Breadcrumbs className={classes.root} separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
      {crumbs}
    </Breadcrumbs>
  );
};

interface CrumbProps extends WithStyles<typeof styles> {
  active: boolean;
  name: string;
  href: string;
  Icon: typeof SvgIcon | React.ElementType;
  iconStyle: Object;
}

const Crumb = styled(({ active, name, href, Icon, iconStyle, classes }: CrumbProps) => {
  const className = `${classes.crumb} ${active ? classes.crumbActive : ''}`;
  const content = (
    <>
      <div className={classes.icon} style={iconStyle}>
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

export default styled(AppBreadcrumbs);
