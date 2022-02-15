import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFragmentContainer, requestSubscription } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import { navigateBuildHelper } from '../../utils/navigateHelper';
import { Box } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import RepositoryNameChip from '../chips/RepositoryNameChip';
import BuildBranchNameChip from '../chips/BuildBranchNameChip';
import BuildChangeChip from '../chips/BuildChangeChip';
import BuildStatusChip from '../chips/BuildStatusChip';
import MarkdownTypography from '../common/MarkdownTypography';
import { RunningBuild_build } from './__generated__/RunningBuild_build.graphql';
import { isBuildFinalStatus } from '../../utils/status';
import environment from '../../createRelayEnvironment';

const styles = theme =>
  createStyles({
    gap: {
      paddingTop: 16,
    },
    row: {
      display: 'flex',
      alignItems: 'center',
    },
    chip: {
      margin: theme.spacing(0.5),
    },
    cell: {
      width: '100%',
      maxWidth: '600px',
    },
    padding: {
      margin: theme.spacing(0.5),
    },
  });

interface Props extends WithStyles<typeof styles> {
  build: RunningBuild_build;
}

const buildSubscription = graphql`
  subscription RunningBuildSubscription($buildID: ID!) {
    build(id: $buildID) {
      ...RunningBuild_build
    }
  }
`;

function RunningBuild(props: Props) {
  const navigate = useNavigate();

  let { build, classes } = props;

  useEffect(() => {
    if (isBuildFinalStatus(props.build.status)) {
      return;
    }

    let variables = { buildID: props.build.id };

    const subscription = requestSubscription(environment, {
      subscription: buildSubscription,
      variables: variables,
    });
    return () => {
      subscription.dispose();
    };
  }, [props.build.id, props.build.status]);

  if (isBuildFinalStatus(props.build.status)) {
    return null;
  }

  return (
    <TableRow
      key={build.id}
      onClick={e => navigateBuildHelper(navigate, e, build.id)}
      hover={true}
      style={{ cursor: 'pointer' }}
    >
      <TableCell className={classes.padding}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
          <RepositoryNameChip repository={build.repository} fullName={true} className={classes.chip} />
          <BuildBranchNameChip build={build} className={classes.chip} />
          <BuildChangeChip build={build} className={classes.chip} />
          <Box component="span" sx={{ display: { xs: 'block', sm: 'none' } }}>
            <BuildStatusChip build={build} className={classes.chip} />
          </Box>
        </div>
      </TableCell>
      <TableCell className={classes.cell}>
        <div>
          <MarkdownTypography text={build.changeMessageTitle} variant="body1" color="inherit" />
        </div>
      </TableCell>
      <TableCell className={classes.cell} sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
        <BuildStatusChip build={build} className={classes.chip} />
      </TableCell>
    </TableRow>
  );
}

export default createFragmentContainer(withStyles(styles)(RunningBuild), {
  build: graphql`
    fragment RunningBuild_build on Build {
      id
      changeMessageTitle
      durationInSeconds
      status
      ...BuildBranchNameChip_build
      ...BuildChangeChip_build
      ...BuildStatusChip_build
      repository {
        ...RepositoryNameChip_repository
      }
    }
  `,
});
