import { WithStyles } from '@mui/styles';
import Link from '@mui/material/Link';
import SvgIcon from '@mui/material/SvgIcon';
import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography';
import InputIcon from '@mui/icons-material/Input';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import createStyles from '@mui/styles/createStyles';
import GitHubIcon from '@mui/icons-material/GitHub';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

import { absoluteLink } from '../../utils/link';
import RepositoryIcon from './RepositoryIcon';

const styles = theme =>
  createStyles({
    root: {
      padding: 22,
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
      marginRight: theme.spacing(1.0),
    },
  });

const styled = withStyles(styles);

interface Props extends WithStyles<typeof styles> {
  platform: string;
  ownerName: string;
  repositoryName?: string;
  branchName?: string;
  buildId?: string;
  buildHash?: string;
  taskId?: string;
  taskName?: string;
  extraCrumbs?: Array<{
    name: string;
    href?: string;
    Icon: typeof SvgIcon | React.ElementType;
    iconStyle?: Object;
  }>;
}

const AppBreadcrumbs = ({
  platform,
  ownerName,
  repositoryName,
  branchName,
  buildId,
  buildHash,
  taskId,
  taskName,
  classes,
  extraCrumbs,
}: Props) => {
  const owner = {
    name: ownerName,
    href: absoluteLink(platform, ownerName),
    Icon: GitHubIcon,
    iconStyle: { fontSize: 17 },
  };

  const repository = repositoryName && {
    name: repositoryName,
    href: absoluteLink(platform, ownerName, repositoryName),
    Icon: RepositoryIcon,
    iconStyle: { fontSize: 15.5 },
  };

  const branch = branchName && {
    name: branchName,
    href: absoluteLink(platform, ownerName, repositoryName, branchName),
    Icon: CallSplitIcon,
    iconStyle: { fontSize: 17.5 },
  };

  const hasBuild = !!(buildHash && buildId);
  const build = hasBuild && {
    name: `Build for ${buildHash}`,
    href: absoluteLink('build', buildId),
    Icon: InputIcon,
    iconStyle: { fontSize: 16, marginRight: 9 },
  };

  const hasTask = !!(taskName && taskId);
  const task = hasTask && {
    name: taskName,
    href: absoluteLink('task', taskId),
    Icon: BookmarkBorderIcon,
    iconStyle: { fontSize: 18, marginLeft: -3, marginRight: 6 },
  };

  const crumbs = [owner, repository, branch, build, task, ...(extraCrumbs || [])].filter(Boolean);
  return (
    <Breadcrumbs className={classes.root} separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
      {crumbs.map((crumb, i) => (
        <Crumb
          key={crumb.name}
          active={crumbs.length - 1 === i}
          name={crumb.name}
          href={crumb.href}
          Icon={crumb.Icon}
          iconStyle={crumb.iconStyle}
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
