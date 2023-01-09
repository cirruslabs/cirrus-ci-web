import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import { WithStyles } from '@mui/styles';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import MenuItem from '@mui/material/MenuItem';
import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography';
import InputIcon from '@mui/icons-material/Input';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import GitHubIcon from '@mui/icons-material/GitHub';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import createStyles from '@mui/styles/createStyles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import RepositoryIcon from './RepositoryIcon';
import { absoluteLink } from '../../utils/link';
import { navigateHelper } from '../../utils/navigateHelper';

import { AppBreadcrumbs_viewer } from './__generated__/AppBreadcrumbs_viewer.graphql';

const styles = theme =>
  createStyles({
    root: {
      padding: theme.spacing(2.5),
      paddingLeft: theme.spacing(2),
      color: theme.palette.text.disabled,
    },
    accountsCrumb: {
      background: 'none',
      border: 'none',
      color: theme.palette.text.disabled,
      cursor: 'pointer',
      marginRight: '-12px',
      '&:hover': {
        textDecoration: 'underline',
      },
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
  }>;
  viewer?: AppBreadcrumbs_viewer;
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
  viewer,
}: Props) => {
  console.log(viewer);
  const owner = {
    name: ownerName,
    href: absoluteLink(platform, ownerName),
    Icon: GitHubIcon,
  };

  const repository = repositoryName && {
    name: repositoryName,
    href: absoluteLink(platform, ownerName, repositoryName),
    Icon: RepositoryIcon,
  };

  const branch = branchName && {
    name: branchName,
    href: absoluteLink(platform, ownerName, repositoryName, branchName),
    Icon: CallSplitIcon,
  };

  const hasBuild = !!(buildHash && buildId);
  const build = hasBuild && {
    name: `Build for ${buildHash}`,
    href: absoluteLink('build', buildId),
    Icon: InputIcon,
  };

  const hasTask = !!(taskName && taskId);
  const task = hasTask && {
    name: taskName,
    href: absoluteLink('task', taskId),
    Icon: BookmarkBorderIcon,
  };

  const crumbs = [owner, repository, branch, build, task, ...(extraCrumbs || [])].filter(Boolean);
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      {viewer.relatedOwners && viewer.relatedOwners.length === 1 ? null : <AccountsCrumb viewer={viewer} />}
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
    </Stack>
  );
};

interface AccountsCrumbProps extends WithStyles<typeof styles> {
  viewer: AppBreadcrumbs_viewer;
}

const AccountsCrumb = styled(({ viewer, classes }: AccountsCrumbProps) => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (e, name) => {
    setAnchorEl(null);
    navigateHelper(navigate, e, '/github/' + name);
  };

  return (
    <>
      <Button variant="contained" onClick={handleClick}>
        Accounts
        <ArrowDropDownIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {viewer.relatedOwners.map(viewer => {
          return <MenuItem onClick={e => handleMenuItemClick(e, viewer.name)}>{viewer.name}</MenuItem>;
        })}
      </Menu>
    </>
  );
});

interface CrumbProps extends WithStyles<typeof styles> {
  active: boolean;
  name: string;
  href?: string;
  Icon?: typeof SvgIcon | React.ElementType | null;
}

const Crumb = styled(({ active, name, href, Icon, classes }: CrumbProps) => {
  const className = `${classes.crumb} ${active ? classes.crumbActive : ''}`;
  const content = (
    <>
      <div className={classes.icon}>{Icon && <Icon fontSize="inherit" />}</div>
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

export default createFragmentContainer(withStyles(styles)(AppBreadcrumbs), {
  viewer: graphql`
    fragment AppBreadcrumbs_viewer on User {
      relatedOwners {
        platform
        name
      }
    }
  `,
});
