import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { useRecoilValue } from 'recoil';
import { useFragment, useSubscription } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { Helmet as Head } from 'react-helmet';
import cx from 'classnames';

import { createTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import Settings from '@mui/icons-material/Settings';
import AddCircle from '@mui/icons-material/AddCircle';
import Timeline from '@mui/icons-material/Timeline';

import Hash from '../chips/Hash';
import Duration from '../chips/Duration';
import { absoluteLink } from '../../utils/link';
import { muiThemeOptions } from '../../cirrusTheme';
import { createLinkToRepository } from '../../utils/github';
import { NodeOfConnection } from '../../utils/utility-types';
import { navigateBuildHelper } from '../../utils/navigateHelper';
import usePageWidth from '../../utils/usePageWidth';
import CreateBuildDialog from '../builds/CreateBuildDialog';
import BuildDurationsChart from '../builds/BuildDurationsChart';
import BuildsTable from '../../components/builds/BuildsTable';
import BuildStatusChipNew from '../chips/BuildStatusChipNew';
import BuildBranchNameChipNew from '../chips/BuildBranchNameChipNew';

import {
  RepositoryBuildList_repository,
  RepositoryBuildList_repository$key,
} from './__generated__/RepositoryBuildList_repository.graphql';

// todo: move custom values to mui theme adjustments
const useStyles = makeStyles(theme => {
  return {
    root: {
      paddingBottom: theme.spacing(16.0),
    },
    paper: {
      padding: theme.spacing(1.0, 2.5, 1.5),
      boxShadow: '0 16px 52px rgb(0 0 0 / 13%)',
      borderRadius: 4 * theme.shape.borderRadius,
    },
    paperBuildsTable: {
      paddingBottom: theme.spacing(4.0),
    },
    header: {
      paddingLeft: 14,
      justifyContent: 'space-between',
    },
    buildsChart: {
      height: 150,
    },
    commitName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'normal',
      // Text truncate doesnt't work here without styles below
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
    },
  };
});

interface Props {
  branch?: string;
  repository: RepositoryBuildList_repository$key;
}

const repositorySubscription = graphql`
  subscription RepositoryBuildListSubscription($repositoryID: ID!, $branch: String) {
    repository(id: $repositoryID) {
      ...RepositoryBuildList_repository @arguments(branch: $branch)
    }
  }
`;

export default function RepositoryBuildList(props: Props) {
  let repository = useFragment(
    graphql`
      fragment RepositoryBuildList_repository on Repository @argumentDefinitions(branch: { type: "String" }) {
        id
        platform
        owner
        name
        viewerPermission
        ...CreateBuildDialog_repository
        builds(last: 50, branch: $branch) {
          edges {
            node {
              id
              changeMessageTitle
              clockDurationInSeconds
              durationInSeconds
              status
              ...Hash_build
              ...Duration_build
              ...BuildsTable_builds
              ...BuildStatusChipNew_build
              ...BuildBranchNameChipNew_build
            }
          }
        }
      }
    `,
    props.repository,
  );

  const pageWidth = usePageWidth();
  const isNewDesign = pageWidth > 900;

  const themeOptions = useRecoilValue(muiThemeOptions);
  const muiTheme = useMemo(() => createTheme(themeOptions), [themeOptions]);

  const repositorySubscriptionConfig = useMemo(
    () => ({
      variables: { repositoryID: repository.id, branch: props.branch },
      subscription: repositorySubscription,
    }),
    [repository.id, props.branch],
  );
  useSubscription(repositorySubscriptionConfig);

  let navigate = useNavigate();
  let [selectedBuildId, setSelectedBuildId] = useState(null);
  let [openCreateDialog, setOpenCreateDialog] = useState(false);
  let classes = useStyles();
  let builds = repository.builds.edges.map(edge => edge.node);

  let repositorySettings = null;
  let repositoryAction = null;
  if (repository.viewerPermission === 'WRITE' || repository.viewerPermission === 'ADMIN') {
    repositorySettings = (
      <Tooltip title="Repository Settings">
        <Link href={'/settings/repository/' + repository.id}>
          <IconButton size="large">
            <Settings />
          </IconButton>
        </Link>
      </Tooltip>
    );
    repositoryAction = (
      <>
        <div key="create-build-gap" />
        <Tooltip title="Create Build">
          <IconButton key="create-build-button" onClick={() => setOpenCreateDialog(true)} size="large">
            <AddCircle />
          </IconButton>
        </Tooltip>
      </>
    );
  }

  let repositoryMetrics = (
    <Link href={absoluteLink('metrics', 'repository', repository.platform, repository.owner, repository.name)}>
      <Tooltip title="Repository Metrics">
        <IconButton size="large">
          <Timeline />
        </IconButton>
      </Tooltip>
    </Link>
  );

  const repositoryLinkButton = (
    <Tooltip title="Open on GitHub">
      <Link href={createLinkToRepository(repository, props.branch)} target="_blank" rel="noopener noreferrer">
        <IconButton size="large">
          <GitHubIcon />
        </IconButton>
      </Link>
    </Tooltip>
  );

  let buildsChart = null;

  if (props.branch && builds.length > 5) {
    buildsChart = (
      <Paper className={classes.paper} sx={{ mb: 2 }}>
        <Toolbar className={classes.header} disableGutters>
          <Typography variant="h5" color="inherit">
            Duration Chart
          </Typography>
        </Toolbar>
        <div className={classes.buildsChart}>
          <BuildDurationsChart
            builds={builds.slice().reverse()}
            selectedBuildId={selectedBuildId}
            onSelectBuildId={buildId => setSelectedBuildId(buildId)}
          />
        </div>
      </Paper>
    );
  }

  function buildItem(build: NodeOfConnection<RepositoryBuildList_repository['builds']>) {
    let isSelectedBuild = selectedBuildId === build.id;
    return (
      <TableRow
        key={build.id}
        hover={true}
        selected={isSelectedBuild}
        onMouseOver={() => !isSelectedBuild && setSelectedBuildId(build.id)}
        onClick={e => navigateBuildHelper(navigate, e, build.id)}
        style={{ cursor: 'pointer' }}
      >
        {/* STATUS */}
        <TableCell>
          <Stack direction="column" alignItems="start" spacing={0.5}>
            <BuildStatusChipNew build={build} />
            {/* DURATION XS-SCREEN */}
            <Box
              sx={{
                display: { xs: 'block', sm: 'none' },
              }}
              pl={0.5}
            >
              <Duration build={build} iconFirst />
            </Box>
          </Stack>
        </TableCell>

        {/* COMMIT */}
        <TableCell>
          <Typography
            className={classes.commitName}
            variant="subtitle1"
            title={build.changeMessageTitle}
            gutterBottom
            lineHeight={1}
          >
            {build.changeMessageTitle}
          </Typography>
          {/* HASH BRANCH */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Hash build={build} />
            <Box maxWidth={170}>
              <BuildBranchNameChipNew build={build} />
            </Box>
          </Stack>
        </TableCell>

        {/* DURATION SM-SCREEN*/}
        <TableCell
          sx={{
            display: { xs: 'none', sm: 'table-cell' },
          }}
        >
          <Duration build={build} rightAlighment />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <div className={classes.root}>
        <Head>
          <title>
            {repository.owner}/{repository.name} - Cirrus CI
          </title>
        </Head>
        {/* CHART */}
        {buildsChart}

        {/* BUILDS TABLE */}
        <Paper className={cx(classes.paper, classes.paperBuildsTable)}>
          <Toolbar className={classes.header} disableGutters>
            <Stack direction="row" alignItems="center">
              <Typography variant="h5" color="inherit">
                Builds
              </Typography>
              {repositoryAction}
            </Stack>
            <div>
              {repositoryMetrics}
              {repositoryLinkButton}
              {repositorySettings}
            </div>
          </Toolbar>
          {isNewDesign ? (
            <BuildsTable builds={builds} selectedBuildId={selectedBuildId} setSelectedBuildId={setSelectedBuildId} />
          ) : (
            <Table style={{ tableLayout: 'auto' }}>
              <TableBody>{builds.map(build => buildItem(build))}</TableBody>
            </Table>
          )}
        </Paper>
        {openCreateDialog && (
          <CreateBuildDialog
            repository={repository}
            open={openCreateDialog}
            onClose={() => setOpenCreateDialog(false)}
          />
        )}
      </div>
    </ThemeProvider>
  );
}
